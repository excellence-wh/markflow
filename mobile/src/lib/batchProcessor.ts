import type { PhotoItem, WatermarkSettings } from '../types';
import { exportOne } from '../watermark/renderer';
import { saveBase64PngToGallery } from '../lib/gallery';

export interface BatchResult {
  saved: number;
  failed: string[];
}

/**
 * 批量处理：逐张渲染水印 → 保存到相册。
 * 失败的单张不影响其他，最后汇总。
 */
export async function processAndSave(
  photos: PhotoItem[],
  settings: WatermarkSettings,
  onProgress: (done: number, total: number, current: string) => void
): Promise<BatchResult> {
  const results: BatchResult = { saved: 0, failed: [] };
  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    onProgress(i, photos.length, p.filename ?? `图片${i + 1}`);
    try {
      const { base64 } = await exportOne(p.uri, settings, settings.logoUri);
      const safe = (p.filename ?? `img_${i + 1}`).replace(/\.[^.]+$/, '');
      await saveBase64PngToGallery(base64, `markflow_${safe}.png`);
      results.saved++;
    } catch (e) {
      results.failed.push(p.filename ?? `图片${i + 1}`);
      console.error('处理失败', p.uri, e);
    }
  }
  return results;
}
