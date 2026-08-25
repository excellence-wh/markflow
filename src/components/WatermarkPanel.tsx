import { useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { PositionAnchor, WatermarkType } from '../types';
import { Button, ColorPicker, SectionTitle, Slider, TextInput, Toggle } from './ui';

const POSITIONS: { key: PositionAnchor; label: string; icon: string }[] = [
  { key: 'top-left', label: '左上', icon: '↖' },
  { key: 'top-center', label: '中上', icon: '↑' },
  { key: 'top-right', label: '右上', icon: '↗' },
  { key: 'middle-left', label: '左中', icon: '←' },
  { key: 'center', label: '居中', icon: '·' },
  { key: 'middle-right', label: '右中', icon: '→' },
  { key: 'bottom-left', label: '左下', icon: '↙' },
  { key: 'bottom-center', label: '中下', icon: '↓' },
  { key: 'bottom-right', label: '右下', icon: '↘' },
];

const FONT_SIZES = [16, 24, 32, 48, 64, 80, 100, 120];

export default function WatermarkPanel() {
  const wm = useAppStore((s) => s.watermark);
  const update = useAppStore((s) => s.updateWatermark);
  const setLogo = useAppStore((s) => s.setLogo);
  const reset = useAppStore((s) => s.resetWatermark);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const selectType = (t: WatermarkType) => {
    if (t === 'image' && !wm.logoDataUrl) {
      // 切到图片水印但还没 Logo，弹出文件选择
      logoInputRef.current?.click();
      return;
    }
    update({ type: t });
  };

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result as string);
      update({ type: 'image' });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const isText = wm.type === 'text';
  const isImage = wm.type === 'image';

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex items-center justify-between">
        <SectionTitle>水印设置</SectionTitle>
        <button onClick={reset} className="text-xs text-slate-400 hover:text-brand-600">
          重置
        </button>
      </div>

      {/* 类型切换 */}
      <div className="grid grid-cols-3 gap-2">
        {(
          [
            { v: 'text', label: '文字' },
            { v: 'image', label: '图片' },
            { v: 'none', label: '无水印' },
          ] as { v: WatermarkType; label: string }[]
        ).map((opt) => (
          <button
            key={opt.v}
            onClick={() => selectType(opt.v)}
            className={`rounded-xl border py-2 text-sm font-medium transition-colors ${
              wm.type === opt.v
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 文字水印 */}
      {isText && (
        <>
          <div>
            <SectionTitle>水印文字</SectionTitle>
            <TextInput
              value={wm.text}
              onChange={(e) => update({ text: e.target.value })}
              placeholder="输入水印文字…"
            />
          </div>

          <div>
            <SectionTitle>字号</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {FONT_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => update({ fontSize: s })}
                  className={`rounded-lg border px-3 py-1 text-sm transition-colors ${
                    wm.fontSize === s
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle>文字颜色</SectionTitle>
            <ColorPicker value={wm.textColor} onChange={(c) => update({ textColor: c })} />
          </div>

          <Slider
            label="透明度"
            value={Math.round(wm.opacity * 100)}
            min={0}
            max={100}
            onChange={(v) => update({ opacity: v / 100 })}
            suffix="%"
          />
          <Slider
            label="旋转"
            value={wm.rotation}
            min={-90}
            max={90}
            onChange={(v) => update({ rotation: v })}
            suffix="°"
          />
          <Slider
            label="描边"
            value={wm.strokeWidth}
            min={0}
            max={20}
            onChange={(v) => update({ strokeWidth: v })}
            suffix="px"
          />
          {wm.strokeWidth > 0 && (
            <div>
              <SectionTitle>描边颜色</SectionTitle>
              <ColorPicker value={wm.strokeColor} onChange={(c) => update({ strokeColor: c })} />
            </div>
          )}
          <Toggle label="粗体" checked={wm.fontWeight === 'bold'} onChange={(v) => update({ fontWeight: v ? 'bold' : 'normal' })} />
        </>
      )}

      {/* 图片水印 */}
      {isImage && (
        <>
          <div>
            <SectionTitle>Logo 图片</SectionTitle>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleLogoFile}
            />
            {wm.logoDataUrl ? (
              <div className="flex items-center gap-3">
                <img src={wm.logoDataUrl} alt="logo" className="h-14 w-14 rounded-lg border border-slate-200 bg-white object-contain p-1" />
                <Button variant="outline" onClick={() => logoInputRef.current?.click()}>
                  更换 Logo
                </Button>
                <Button variant="ghost" onClick={() => setLogo(null)}>
                  移除
                </Button>
              </div>
            ) : (
              <button
                onClick={() => logoInputRef.current?.click()}
                className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white py-4 text-sm text-slate-500 hover:border-brand-500 hover:text-brand-600"
              >
                ＋ 上传 Logo（PNG 透明底最佳）
              </button>
            )}
          </div>
          <Slider
            label="大小"
            value={Math.round(wm.logoScale * 100)}
            min={10}
            max={200}
            onChange={(v) => update({ logoScale: v / 100 })}
            suffix="%"
          />
          <Slider
            label="透明度"
            value={Math.round(wm.opacity * 100)}
            min={0}
            max={100}
            onChange={(v) => update({ opacity: v / 100 })}
            suffix="%"
          />
          <Slider
            label="旋转"
            value={wm.rotation}
            min={-90}
            max={90}
            onChange={(v) => update({ rotation: v })}
            suffix="°"
          />
        </>
      )}

      {wm.type !== 'none' && (
        <>
          <Toggle label="平铺模式（防盗图）" checked={wm.tile} onChange={(v) => update({ tile: v })} />
          {wm.tile && (
            <Slider
              label="平铺间距"
              value={wm.tileGap}
              min={40}
              max={400}
              onChange={(v) => update({ tileGap: v })}
              suffix="px"
            />
          )}
          {!wm.tile && (
            <>
              <div>
                <SectionTitle>位置（九宫格）</SectionTitle>
                <div className="grid grid-cols-3 gap-1.5">
                  {POSITIONS.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => update({ position: p.key })}
                      title={p.label}
                      className={`grid h-9 place-items-center rounded-lg border text-base transition-colors ${
                        wm.position === p.key
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {p.icon}
                    </button>
                  ))}
                </div>
              </div>
              <Slider
                label="水平边距"
                value={wm.marginX}
                min={0}
                max={200}
                onChange={(v) => update({ marginX: v })}
                suffix="px"
              />
              <Slider
                label="垂直边距"
                value={wm.marginY}
                min={0}
                max={200}
                onChange={(v) => update({ marginY: v })}
                suffix="px"
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
