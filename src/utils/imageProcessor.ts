import type { ExportSettings, ImageItem, PlatformPreset, WatermarkSettings } from '../types';
import { drawWatermark, ensureFontsLoaded, loadImage } from './watermarkRenderer';

export interface ProcessResult {
  blob: Blob;
  name: string;
  width: number;
  height: number;
}

/** 将原图按平台预设适配到目标画布尺寸，返回 {canvas, 绘制偏移} */
function applyPreset(
  img: HTMLImageElement,
  preset: PlatformPreset
): { canvas: HTMLCanvasElement; dx: number; dy: number } {
  const canvas = document.createElement('canvas');
  const sw = img.naturalWidth || img.width;
  const sh = img.naturalHeight || img.height;

  // 保持原图
  if (preset.mode === 'none' || (preset.width === 0 && preset.height === 0)) {
    canvas.width = sw;
    canvas.height = sh;
    return { canvas, dx: 0, dy: 0 };
  }

  // 仅指定宽度（如详情页宽 750）
  if (preset.height === 0) {
    const scale = preset.width / sw;
    canvas.width = preset.width;
    canvas.height = Math.round(sh * scale);
    return { canvas, dx: 0, dy: 0 };
  }

  const targetW = preset.width;
  const targetH = preset.height;
  const targetRatio = targetW / targetH;
  const srcRatio = sw / sh;

  if (preset.mode === 'crop') {
    // 缩放以覆盖目标，再居中裁剪
    const scale = Math.max(targetW / sw, targetH / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    canvas.width = targetW;
    canvas.height = targetH;
    return { canvas, dx: (targetW - dw) / 2, dy: (targetH - dh) / 2 };
  }

  // fit：缩放以适应目标，保持长宽比
  let dw: number;
  let dh: number;
  if (srcRatio > targetRatio) {
    dw = targetW;
    dh = targetW / srcRatio;
  } else {
    dw = targetH * srcRatio;
    dh = targetH;
  }
  canvas.width = targetW;
  canvas.height = targetH;
  return { canvas, dx: (targetW - dw) / 2, dy: (targetH - dh) / 2 };
}

/**
 * 处理单张图片：加载 → 按预设缩放 → 绘制原图 → 叠加水印 → 导出 Blob。
 */
export async function processImage(
  item: ImageItem,
  settings: WatermarkSettings,
  exportSettings: ExportSettings,
  preset: PlatformPreset
): Promise<ProcessResult> {
  await ensureFontsLoaded();
  const img = await loadImage(item.url);
  const { canvas, dx, dy } = applyPreset(img, preset);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('无法创建画布上下文');

  ctx.drawImage(img, dx, dy, canvas.width - dx * 2, canvas.height - dy * 2);

  // Logo 水印需预先加载 Logo 图
  let logoImage: HTMLImageElement | null = null;
  if (settings.type === 'image' && settings.logoDataUrl) {
    try {
      logoImage = await loadImage(settings.logoDataUrl);
    } catch {
      logoImage = null;
    }
  }

  drawWatermark(ctx, canvas.width, canvas.height, settings, logoImage);

  const mime =
    exportSettings.format === 'jpeg'
      ? 'image/jpeg'
      : exportSettings.format === 'webp'
        ? 'image/webp'
        : 'image/png';

  const blob = await canvasToBlob(canvas, mime, exportSettings.quality);
  return { blob, name: item.name, width: canvas.width, height: canvas.height };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('图片导出失败'))),
      mime,
      quality
    );
  });
}

/** 生成导出文件名 */
export function buildOutputName(
  original: string,
  exportSettings: ExportSettings,
  sequence: number
): string {
  // 去掉原扩展名
  const base = original.replace(/\.[^.]+$/, '');
  const ext = exportSettings.format === 'jpeg' ? 'jpg' : exportSettings.format;
  let name = base;
  if (exportSettings.naming === 'prefix') name = exportSettings.prefix + base;
  else if (exportSettings.naming === 'suffix') name = base + exportSettings.suffix;
  else if (exportSettings.naming === 'sequence') name = `${exportSettings.prefix || 'watermark'}_${sequence}`;
  return `${name}.${ext}`;
}
