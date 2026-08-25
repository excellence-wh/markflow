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
