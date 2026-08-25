import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { drawWatermark, ensureFontsLoaded, loadImage } from '../utils/watermarkRenderer';

/**
 * 预览画布：在浏览器端 Canvas 上把水印实时绘制到所选图片。
 * 用一个与图片同分辨率的内存 Canvas 渲染，再缩放到容器显示，保证所见即所得。
 */
export default function PreviewCanvas() {
  const images = useAppStore((s) => s.images);
  const selectedId = useAppStore((s) => s.selectedId);
  const watermark = useAppStore((s) => s.watermark);
  const [showOriginal, setShowOriginal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const current = images.find((i) => i.id === selectedId) ?? null;

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // 在 await 后的闭包里这些引用仍保持非空
    const canvasEl = canvas;
    const ctxEl = ctx;

    async function render() {
      if (!current) {
        ctxEl.clearRect(0, 0, canvasEl.width, canvasEl.height);
        return;
      }
      const img = await loadImage(current.url);
      if (cancelled) return;
      canvasEl.width = img.naturalWidth || img.width;
      canvasEl.height = img.naturalHeight || img.height;
      ctxEl.drawImage(img, 0, 0);

      if (!showOriginal) {
        await ensureFontsLoaded();
        let logo: HTMLImageElement | null = null;
        if (watermark.type === 'image' && watermark.logoDataUrl) {
          try {
            logo = await loadImage(watermark.logoDataUrl);
          } catch {
            logo = null;
          }
        }
        if (cancelled) return;
        drawWatermark(ctxEl, canvasEl.width, canvasEl.height, watermark, logo);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [current, watermark, showOriginal]);

  return (
    <div className="relative flex h-full flex-col">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-2">
        {current ? (
          <p className="truncate text-sm text-slate-500">
            {current.name} · {current.width}×{current.height}
          </p>
        ) : (
          <p className="text-sm text-slate-400">请上传图片开始预览</p>
        )}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-xs">
          <button
            onClick={() => setShowOriginal(false)}
            className={`rounded-md px-3 py-1 ${!showOriginal ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            效果图
          </button>
          <button
            onClick={() => setShowOriginal(true)}
            className={`rounded-md px-3 py-1 ${showOriginal ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            原图
          </button>
        </div>
      </div>

      {/* 画布区 */}
      <div className="relative flex flex-1 items-center justify-center overflow-auto bg-slate-200/50 p-4">
        <canvas
          ref={canvasRef}
          className="max-h-full max-w-full rounded-lg object-contain shadow-sm"
        />
      </div>

      {!current && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center text-slate-400">
            <div className="text-5xl">🖼️</div>
            <p className="mt-3 text-sm">上传图片后，右侧设置水印，这里实时预览</p>
          </div>
        </div>
      )}
    </div>
  );
}
