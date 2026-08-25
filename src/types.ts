// 全局类型定义

/** 水印类型：文字 / 图片(Logo) / 无 */
export type WatermarkType = 'text' | 'image' | 'none';

/** 九宫格位置锚点 */
export type PositionAnchor =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/** 导出格式 */
export type ExportFormat = 'jpeg' | 'png' | 'webp';

export interface WatermarkSettings {
  type: WatermarkType;
  // 文字水印
  text: string;
  textColor: string;
  fontSize: number; // 相对原图的字号，8~120
  fontWeight: 'normal' | 'bold';
  opacity: number; // 0~1
  rotation: number; // -90 ~ 90 度
  strokeWidth: number; // 描边宽度，0 表示无
  strokeColor: string;
  // 图片水印
  logoDataUrl: string | null;
  logoScale: number; // 0.1~2
  // 位置
  position: PositionAnchor;
  marginX: number;
  marginY: number;
  tile: boolean; // 平铺模式
  tileGap: number; // 平铺间距
  padding: number; // 文字边距
}

export const defaultWatermark = (): WatermarkSettings => ({
  type: 'text',
  text: '印流 MarkFlow',
  textColor: '#ffffff',
  fontSize: 48,
  fontWeight: 'bold',
  opacity: 1,
  rotation: 0,
  strokeWidth: 0,
  strokeColor: '#000000',
  logoDataUrl: null,
  logoScale: 1,
  position: 'bottom-right',
  marginX: 20,
  marginY: 20,
  tile: false,
  tileGap: 120,
  padding: 10,
});

export interface ImageItem {
  id: string;
  name: string;
  file: File;
  url: string; // object URL for preview
  width: number;
  height: number;
  size: number;
  status: 'idle' | 'processing' | 'done' | 'error';
  error?: string;
}

export interface ExportSettings {
  format: ExportFormat;
  quality: number; // 0~1，PNG 忽略
  naming: 'original' | 'prefix' | 'suffix' | 'sequence';
  prefix: string;
  suffix: string;
}

export const defaultExport = (): ExportSettings => ({
  format: 'jpeg',
  quality: 0.92,
  naming: 'original',
  prefix: '',
  suffix: '',
});

/** 平台尺寸预设 */
export interface PlatformPreset {
  key: string;
  label: string;
  hint: string;
  width: number; // 0 表示不裁剪（保持原图）
  height: number;
  mode: 'none' | 'fit' | 'crop';
}

export const platformPresets: PlatformPreset[] = [
  { key: 'none', label: '保持原图', hint: '不缩放不裁剪', width: 0, height: 0, mode: 'none' },
  { key: 'xhs-3-4', label: '小红书 3:4', hint: '1080×1440', width: 1080, height: 1440, mode: 'fit' },
  { key: 'xhs-1-1', label: '小红书 1:1', hint: '1080×1080', width: 1080, height: 1080, mode: 'fit' },
  { key: 'tb-800', label: '淘宝主图', hint: '800×800', width: 800, height: 800, mode: 'fit' },
  { key: 'tb-detail', label: '淘宝详情宽', hint: '宽 750', width: 750, height: 0, mode: 'fit' },
  { key: 'pdd-800', label: '拼多多主图', hint: '800×800', width: 800, height: 800, mode: 'fit' },
];

export interface ProcessProgress {
  total: number;
  done: number;
  currentName: string;
}
