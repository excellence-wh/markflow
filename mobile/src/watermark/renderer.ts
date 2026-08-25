import {
  Skia,
  PaintStyle,
  type SkCanvas,
  type SkFont,
  type SkImage,
  type SkPaint,
} from '@shopify/react-native-skia';
import type { PlatformPreset, WatermarkSettings } from '../types';
import { measureText, watermarkSlots, scaleFor } from './geometry';

async function loadImage(uri: string): Promise<SkImage> {
  const data = await Skia.Data.fromURI(uri);
  const img = Skia.Image.MakeImageFromEncoded(data);
  if (!img) throw new Error('图片解码失败');
  return img;
}

export interface RenderResult {
  image: SkImage;
  width: number;
  height: number;
}

/**
 * 计算目标画布尺寸与底图绘制的源矩形（center-crop）。
 * - preset 未指定 / 宽高均为 0 → 保持原图
 * - 仅宽(height=0) → 等比缩放到指定宽度
 * - 宽高都有 → 等比放大铺满目标，居中裁剪
 */
function computeLayout(
  srcW: number,
  srcH: number,
  preset?: PlatformPreset
): { canvasW: number; canvasH: number; src: { x: number; y: number; w: number; h: number } } {
  if (!preset || (preset.width === 0 && preset.height === 0)) {
    return { canvasW: srcW, canvasH: srcH, src: { x: 0, y: 0, w: srcW, h: srcH } };
  }
  if (preset.height === 0) {
    // 仅限宽
    const canvasW = preset.width;
    const canvasH = Math.round((srcH * preset.width) / srcW);
    return { canvasW, canvasH, src: { x: 0, y: 0, w: srcW, h: srcH } };
  }
  const targetW = preset.width;
  const targetH = preset.height;
  const scale = Math.max(targetW / srcW, targetH / srcH);
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const srcX = (drawW - targetW) / 2 / scale;
  const srcY = (drawH - targetH) / 2 / scale;
  return {
    canvasW: targetW,
    canvasH: targetH,
    src: { x: srcX, y: srcY, w: targetW / scale, h: targetH / scale },
  };
}

/**
 * 在 CPU 离屏 Surface 上渲染「底图(按平台预设裁剪/缩放) + 水印」，返回合成后的 SkImage。
 * 用于批量导出（全分辨率、像素级保真，避免 GPU 纹理尺寸上限）。
 */
export async function renderWatermarked(
  baseUri: string,
  settings: WatermarkSettings,
  logoUri?: string | null,
  preset?: PlatformPreset
): Promise<RenderResult> {
  const base = await loadImage(baseUri);
  const sw = base.width();
  const sh = base.height();
  const { canvasW, canvasH, src } = computeLayout(sw, sh, preset);
  const surface = Skia.Surface.Make(canvasW, canvasH);
  if (!surface) throw new Error('无法创建画布');
  const canvas = surface.getCanvas();
  canvas.clear(Skia.Color('transparent'));

  // 底图：从 src 源矩形绘制到整个目标画布
  const srcRect = Skia.XYWHRect(src.x, src.y, src.w, src.h);
  const dstRect = Skia.XYWHRect(0, 0, canvasW, canvasH);
  const basePaint = Skia.Paint();
  canvas.drawImageRect(base, srcRect, dstRect, basePaint);

  const w = canvasW;
  const h = canvasH;
  const sc = scaleFor(w, h);

  if (settings.type === 'text' && settings.text.trim()) {
    const fontPx = settings.fontSize * sc;
    const font: SkFont = Skia.Font(undefined, fontPx);
    const fm = font.measureText(settings.text);
    const textW = fm.width;
    const textH = fontPx * 1.2;
    const pad = settings.padding * sc;
    const slots = watermarkSlots(w, h, settings, { w: textW + pad * 2, h: textH + pad * 2 });
    drawTextMarks(canvas, settings.text, font, settings, slots);
  } else if (settings.type === 'image' && logoUri) {
    const logo = await loadImage(logoUri);
    const dw = logo.width() * settings.logoScale * sc;
    const dh = logo.height() * settings.logoScale * sc;
    const slots = watermarkSlots(w, h, settings, { w: dw, h: dh });
    drawLogoMarks(canvas, logo, dw, dh, settings, slots);
  }

  const image = surface.makeImageSnapshot();
  return { image, width: canvasW, height: canvasH };
}

function drawTextMarks(
  canvas: SkCanvas,
  text: string,
  font: SkFont,
  settings: WatermarkSettings,
  slots: { center: { x: number; y: number }; rotation: number }[]
): void {
  const fm = font.measureText(text);
  const textW = fm.width;
  const fill: SkPaint = Skia.Paint();
  fill.setColor(Skia.Color(settings.textColor));
  fill.setAlphaf(settings.opacity);

  const hasStroke = settings.strokeWidth > 0;
  const stroke: SkPaint = Skia.Paint();
  stroke.setColor(Skia.Color(settings.strokeColor));
  stroke.setStrokeWidth(settings.strokeWidth);
  stroke.setStyle(PaintStyle.Stroke);
  stroke.setAlphaf(settings.opacity);

  for (const slot of slots) {
    canvas.save();
    canvas.translate(slot.center.x, slot.center.y);
    canvas.rotate(slot.rotation, 0, 0);
    // 以文本测量宽度居中；baseline 大致在中线
    if (hasStroke) canvas.drawText(text, -textW / 2, font.getSize() * 0.35, stroke, font);
    canvas.drawText(text, -textW / 2, font.getSize() * 0.35, fill, font);
    canvas.restore();
  }
}

function drawLogoMarks(
  canvas: SkCanvas,
  logo: SkImage,
  dw: number,
  dh: number,
  settings: WatermarkSettings,
  slots: { center: { x: number; y: number }; rotation: number }[]
): void {
  const paint: SkPaint = Skia.Paint();
  paint.setAlphaf(settings.opacity);
  const src = Skia.XYWHRect(0, 0, logo.width(), logo.height());
  for (const slot of slots) {
    canvas.save();
    canvas.translate(slot.center.x, slot.center.y);
    canvas.rotate(slot.rotation, 0, 0);
    const dest = Skia.XYWHRect(-dw / 2, -dh / 2, dw, dh);
    canvas.drawImageRect(logo, src, dest, paint);
    canvas.restore();
  }
}

/** 编码为 PNG base64，用于保存到相册 */
export function imageToPngBase64(image: SkImage): string {
  return image.encodeToBase64();
}

/** 导出单张：渲染(含预设裁剪) + 返回 PNG base64 与尺寸 */
export async function exportOne(
  uri: string,
  settings: WatermarkSettings,
  logoUri?: string | null,
  preset?: PlatformPreset
): Promise<{ base64: string; width: number; height: number }> {
  const { image } = await renderWatermarked(uri, settings, logoUri, preset);
  const base64 = imageToPngBase64(image);
  return { base64, width: image.width(), height: image.height() };
}
