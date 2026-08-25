import type { WatermarkSettings, PositionAnchor } from '../types';

// 参考尺寸：所有水印尺寸按缩放到 min(宽,高)=REF 的比例换算，
// 保证单张预览与批量导出时水印相对大小一致，且大图不会显得水印过小。
const REF = 800;

export const FONT_STACK =
  '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

function scaleFor(w: number, h: number): number {
  const m = Math.min(w, h);
  return m === 0 ? 1 : m / REF;
}

/**
 * 在已经绘制好原图的 Canvas 上叠加水印。
 * @param ctx 目标 Canvas 2d 上下文
 * @param canvasWidth 画布宽（原图尺寸）
 * @param canvasHeight 画布高
 * @param settings 水印参数
 * @param logoImage 已加载的 Logo 图片（图片水印时必填）
 */
export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  settings: WatermarkSettings,
  logoImage?: HTMLImageElement | null
): void {
  const s = scaleFor(canvasWidth, canvasHeight);

  if (settings.type === 'text' && settings.text.trim()) {
    drawText(ctx, canvasWidth, canvasHeight, settings, s);
  } else if (settings.type === 'image' && settings.logoDataUrl && logoImage && logoImage.width > 0) {
    drawLogo(ctx, canvasWidth, canvasHeight, settings, logoImage, s);
  }
}

/** 计算内容盒（文字或 Logo）在九宫格锚点下的中心坐标 */
function anchorCenter(
  w: number,
  h: number,
  pos: PositionAnchor,
  boxW: number,
  boxH: number,
  mx: number,
  my: number
): { cx: number; cy: number } {
  switch (pos) {
    case 'top-left':
      return { cx: mx + boxW / 2, cy: my + boxH / 2 };
    case 'top-center':
      return { cx: w / 2, cy: my + boxH / 2 };
    case 'top-right':
      return { cx: w - mx - boxW / 2, cy: my + boxH / 2 };
    case 'middle-left':
      return { cx: mx + boxW / 2, cy: h / 2 };
    case 'center':
      return { cx: w / 2, cy: h / 2 };
    case 'middle-right':
      return { cx: w - mx - boxW / 2, cy: h / 2 };
    case 'bottom-left':
      return { cx: mx + boxW / 2, cy: h - my - boxH / 2 };
    case 'bottom-center':
      return { cx: w / 2, cy: h - my - boxH / 2 };
    case 'bottom-right':
      return { cx: w - mx - boxW / 2, cy: h - my - boxH / 2 };
  }
}

function drawTiled(
  w: number,
  h: number,
  gap: number,
  paint: (x: number, y: number) => void
): void {
  const step = Math.max(gap, 1);
  const cols = Math.ceil(w / step) + 2;
  const rows = Math.ceil(h / step) + 2;
  const startX = -((cols - 1) * step) / 2;
  const startY = -((rows - 1) * step) / 2;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      paint(startX + i * step, startY + j * step);
    }
  }
}

function drawText(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: WatermarkSettings,
  sc: number
): void {
  const fontPx = s.fontSize * sc;
  const pad = s.padding * sc;
  ctx.font = `${s.fontWeight} ${fontPx}px ${FONT_STACK}`;
  const textW = ctx.measureText(s.text).width;
  const lineH = fontPx * 1.2;
  const boxW = textW + pad * 2;
  const boxH = lineH + pad * 2;

  ctx.save();
  ctx.globalAlpha = s.opacity;
  ctx.fillStyle = s.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (s.strokeWidth > 0) {
    ctx.strokeStyle = s.strokeColor;
    ctx.lineWidth = s.strokeWidth * sc;
    ctx.lineJoin = 'round';
  }
  const angle = (s.rotation * Math.PI) / 180;

  const paint = (x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    if (s.strokeWidth > 0) ctx.strokeText(s.text, 0, 0);
    ctx.fillText(s.text, 0, 0);
    ctx.restore();
  };

  if (s.tile) {
    drawTiled(w, h, s.tileGap * sc, paint);
  } else {
    const { cx, cy } = anchorCenter(w, h, s.position, boxW, boxH, s.marginX * sc, s.marginY * sc);
    paint(cx, cy);
  }
  ctx.restore();
}

function drawLogo(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: WatermarkSettings,
  logo: HTMLImageElement,
  sc: number
): void {
  const drawW = logo.width * s.logoScale * sc;
  const drawH = logo.height * s.logoScale * sc;

  ctx.save();
  ctx.globalAlpha = s.opacity;
  const angle = (s.rotation * Math.PI) / 180;
  const paint = (x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(logo, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  };

  if (s.tile) {
    drawTiled(w, h, s.tileGap * sc, paint);
  } else {
    const { cx, cy } = anchorCenter(w, h, s.position, drawW, drawH, s.marginX * sc, s.marginY * sc);
    paint(cx, cy);
  }
  ctx.restore();
}

/** 从 URL / DataURL 加载图片为 HTMLImageElement */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = src;
  });
}

/**
 * 预加载字体，确保 Canvas 绘制中文字体生效。
 * 返回 Promise；字体已加载时会立即 resolve。
 */
export function ensureFontsLoaded(): Promise<unknown> {
  return document.fonts?.ready ?? Promise.resolve();
}
