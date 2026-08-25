import type { PositionAnchor, WatermarkSettings } from '../types';

// 参考尺寸：水印尺寸按 min(w,h)/REF 缩放，避免大图水印过小
const REF = 800;

export function scaleFor(w: number, h: number): number {
  const m = Math.min(w, h);
  return m === 0 ? 1 : m / REF;
}

/** 九宫格锚点下的内容盒中心坐标 */
export function anchorCenter(
  w: number,
  h: number,
  pos: PositionAnchor,
  boxW: number,
  boxH: number,
  mx: number,
  my: number
): { x: number; y: number } {
  const halfW = boxW / 2;
  const halfH = boxH / 2;
  const innerW = w - 2 * mx;
  const innerH = h - 2 * my;
  switch (pos) {
    case 'top-left':
      return { x: mx + halfW, y: my + halfH };
    case 'top-center':
      return { x: w / 2, y: my + halfH };
    case 'top-right':
      return { x: w - mx - halfW, y: my + halfH };
    case 'middle-left':
      return { x: mx + halfW, y: h / 2 };
    case 'center':
      return { x: w / 2, y: h / 2 };
    case 'middle-right':
      return { x: w - mx - halfW, y: h / 2 };
    case 'bottom-left':
      return { x: mx + halfW, y: h - my - halfH };
    case 'bottom-center':
      return { x: w / 2, y: h - my - halfH };
    case 'bottom-right':
      return { x: w - mx - halfW, y: h - my - halfH };
  }
  void innerW;
  void innerH;
}

/** 平铺网格：返回所有格子中心坐标（居中网格，覆盖整图） */
export function tileCenters(
  w: number,
  h: number,
  gap: number
): { x: number; y: number }[] {
  const step = Math.max(gap, 1);
  const cols = Math.ceil(w / step) + 2;
  const rows = Math.ceil(h / step) + 2;
  const startX = -((cols - 1) * step) / 2;
  const startY = -((rows - 1) * step) / 2;
  const centers: { x: number; y: number }[] = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      centers.push({ x: startX + i * step, y: startY + j * step });
    }
  }
  return centers;
}

export interface Measure {
  /** 单个水印内容盒的宽高（含边距），用于单点定位 */
  boxW: number;
  boxH: number;
}

/** 计算水印文字内容的测量（用于定位）。返回数值供几何使用。 */
export function measureText(text: string, fontPx: number, padding: number): Measure {
  // 粗略估算：中文/全角 ≈ fontPx，ASCII ≈ 0.6*fontPx
  let w = 0;
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    w += code > 0xff ? fontPx : fontPx * 0.62;
  }
  return {
    boxW: w + padding * 2,
    boxH: fontPx * 1.2 + padding * 2,
  };
}

export function measureLogo(w: number, h: number): void {}

/**
 * 生成本次绘制的所有水印「槽位」：中心坐标 + 旋转角度。
 * 预览与导出共用，保证所见即所得。
 */
export function watermarkSlots(
  canvasW: number,
  canvasH: number,
  settings: WatermarkSettings,
  content: { w: number; h: number }
): { center: { x: number; y: number }; rotation: number }[] {
  const sc = scaleFor(canvasW, canvasH);
  const angle = (settings.rotation * Math.PI) / 180;
  if (settings.tile) {
    return tileCenters(canvasW, canvasH, settings.tileGap * sc).map((c) => ({
      center: c,
      rotation: angle,
    }));
  }
  const { x, y } = anchorCenter(
    canvasW,
    canvasH,
    settings.position,
    content.w,
    content.h,
    settings.marginX * sc,
    settings.marginY * sc
  );
  return [{ center: { x, y }, rotation: angle }];
}
