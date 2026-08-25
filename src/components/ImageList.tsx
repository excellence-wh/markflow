import { useAppStore } from '../store/useAppStore';
import Uploader from './Uploader';
import { formatSize } from '../utils/zipPacker';

export default function ImageList() {
  const images = useAppStore((s) => s.images);
  const selectedId = useAppStore((s) => s.selectedId);
  const selectImage = useAppStore((s) => s.selectImage);
  const removeImage = useAppStore((s) => s.removeImage);
  const clearAll = useAppStore((s) => s.clearAll);

  const totalSize = images.reduce((a, b) => a + b.size, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <Uploader compact />
      </div>

      {images.length > 0 && (
        <div className="flex items-center justify-between px-3 pb-2 text-xs text-slate-400">
          <span>
            共 {images.length} 张 · {formatSize(totalSize)}
          </span>
          <button onClick={clearAll} className="text-rose-500 hover:text-rose-600">
            清空全部
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {images.length === 0 ? (
          <p className="px-2 pt-4 text-center text-xs text-slate-400">还没有图片，请先上传</p>
        ) : (
          <ul className="space-y-2">
            {images.map((img) => (
              <li
                key={img.id}
                onClick={() => selectImage(img.id)}
                className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-2 transition-colors ${
                  selectedId === img.id
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-slate-700">{img.name}</p>
                  <p className="text-xs text-slate-400">
                    {img.width}×{img.height} · {formatSize(img.size)}
                  </p>
                </div>
                {img.status === 'processing' && (
                  <span className="text-xs text-brand-500">处理中</span>
                )}
                {img.status === 'error' && (
                  <span className="text-xs text-rose-500" title={img.error}>
                    失败
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  title="删除"
                  className="grid h-6 w-6 place-items-center rounded-md text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
