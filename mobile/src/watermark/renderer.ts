import {
  Skia,
  PaintStyle,
  type SkCanvas,
  type SkFont,
  type SkImage,
  type SkPaint,
} from '@shopify/react-native-skia';
import type { WatermarkSettings } from '../types';
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
 * 在 CPU 离屏 Surface 上渲染「底图 + 水印」，返回合成后的 SkImage。
 * 用于批量导出（全分辨率、像素级保真，避免 GPU 纹理尺寸上限）。
 */
export async function renderWatermarked(
  baseUri: string,
  settings: WatermarkSettings,
  logoUri?: string | null
): Promise<RenderResult> {
  const base = await loadImage(baseUri);
  const w = base.width();
  const h = base.height();
  const surface = Skia.Surface.Make(w, h);
  if (!surface) throw new Error('无法创建画布');
  const canvas = surface.getCanvas();
  canvas.clear(Skia.Color('transparent'));

  // 底图
  canvas.drawImage(base, 0, 0);

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
  return { image, width: w, height: h };
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

/** 导出单张：渲染 + 返回 PNG base64 与尺寸 */
export async function exportOne(
  uri: string,
  settings: WatermarkSettings,
  logoUri?: string | null
): Promise<{ base64: string; width: number; height: number }> {
  const { image } = await renderWatermarked(uri, settings, logoUri);
  const base64 = imageToPngBase64(image);
  return { base64, width: image.width(), height: image.height() };
}
