import type { ReactNode, InputHTMLAttributes } from 'react';

/** 主按钮（蓝色填充） */
export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled,
  className = '',
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const styles: Record<string, string> = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    ghost: 'text-slate-600 hover:bg-slate-100',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 bg-white',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
  };
  return (
    <button type={type} className={`${base} ${styles[variant]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

/** 设置面板小节标题 */
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
      {children}
    </h3>
  );
}

/** 带标签和数值的滑动条 */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  suffix = '',
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-medium text-slate-800">
          {format ? format(value) : `${value}${suffix}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

/** 标准输入框 */
export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${props.className ?? ''}`}
    />
  );
}

/** 开关 */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-1">
      <span className="text-sm text-slate-600">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-slate-300'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
        />
      </button>
    </label>
  );
}

/** 常用色板 */
export const PALETTE = [
  '#ffffff',
  '#000000',
  '#ef4444',
  '#f97316',
  '#facc15',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
];

/** 颜色选择（取色器 + 色板） */
export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} title="取色器" />
      {PALETTE.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          title={c}
          className={`h-6 w-6 rounded-md border ${value.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-brand-500 ring-offset-1' : 'border-slate-300'}`}
          style={{ background: c }}
        />
      ))}
    </div>
  );
}
