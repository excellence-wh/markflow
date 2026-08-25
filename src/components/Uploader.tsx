import { useRef, useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

export default function Uploader({
  compact,
  onDone,
}: {
  compact?: boolean;
  onDone?: () => void;
}) {
  const addFiles = useAppStore((s) => s.addFiles);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      if (files.length) {
        addFiles(files);
        onDone?.();
      }
    },
    [addFiles, onDone]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  if (compact) {
    return (
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white py-3 text-sm font-medium text-slate-500 transition-colors hover:border-brand-500 hover:text-brand-600"
        >
          ＋ 添加图片
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition-colors ${
        dragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-slate-50 hover:border-brand-400'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <div className="flex flex-col items-center gap-2">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-2xl text-white">
          ⬆
        </div>
        <p className="text-sm font-medium text-slate-700">
          拖拽图片到此处，或 <span className="text-brand-600">点击选择</span>
        </p>
        <p className="text-xs text-slate-400">支持 JPG / PNG / WebP · 单次最多 200 张</p>
      </div>
    </div>
  );
}
