// 移动端 MarkFlow 类型定义（与 web 保持一致的水印语义）

export type WatermarkType = 'text' | 'image' | 'none';

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

export interface WatermarkSettings {
  type: WatermarkType;
  // 文字水印
  text: string;
  textColor: string;
  fontSize: number; // 相对参考尺寸的字号（几何层按比例缩放）
  opacity: number; // 0~1
  rotation: number; // -90 ~ 90 度
  strokeWidth: number; // 描边宽度（0 表示无）
  strokeColor: string;
  // 图片水印（Logo）
  logoUri: string | null;
  logoScale: number; // 0.1 ~ 2
  // 位置
  position: PositionAnchor;
  marginX: number;
  marginY: number;
  tile: boolean;
  tileGap: number;
  padding: number;
}

export const defaultWatermark = (): WatermarkSettings => ({
  type: 'text',
  text: '印流 MarkFlow',
  textColor: '#ffffff',
  fontSize: 56,
  opacity: 1,
  rotation: 0,
  strokeWidth: 0,
  strokeColor: '#000000',
  logoUri: null,
  logoScale: 1,
  position: 'bottom-right',
  marginX: 24,
  marginY: 24,
  tile: false,
  tileGap: 160,
  padding: 12,
});

export interface PhotoItem {
  id: string;
  uri: string;
  width: number;
  height: number;
  size?: number;
  filename?: string;
  status: 'idle' | 'processing' | 'done' | 'error';
  error?: string;
}

/** 平台尺寸预设 */
export interface PlatformPreset {
  key: string;
  label: string;
  hint: string;
  width: number; // 0 表示不裁剪（保持原图）
  height: number;
}

/** 尺寸预设列表：key='none' 为保持原图 */
export const platformPresets: PlatformPreset[] = [
  { key: 'none', label: '保持原图', hint: '不缩放不裁剪', width: 0, height: 0 },
  { key: 'xhs-3-4', label: '小红书 3:4', hint: '1080×1440', width: 1080, height: 1440 },
  { key: 'xhs-1-1', label: '小红书 1:1', hint: '1080×1080', width: 1080, height: 1080 },
  { key: 'tb-800', label: '淘宝主图', hint: '800×800', width: 800, height: 800 },
  { key: 'tb-detail', label: '淘宝详情宽', hint: '宽 750', width: 750, height: 0 },
  { key: 'pdd-800', label: '拼多多主图', hint: '800×800', width: 800, height: 800 },
];
