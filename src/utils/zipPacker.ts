import JSZip from 'jszip';
import type { ProcessResult } from './imageProcessor';

/**
 * 将批量处理结果打包为 ZIP Blob。
 */
export async function packZip(results: ProcessResult[]): Promise<Blob> {
  const zip = new JSZip();
  for (const r of results) {
    zip.file(r.name, r.blob);
  }
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}

/** 触发浏览器下载 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** 格式化文件大小 */
export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
