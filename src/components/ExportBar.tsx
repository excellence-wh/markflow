import { Button } from './ui';
import { useAppStore } from '../store/useAppStore';
import { platformPresets } from '../types';
import { processImage, buildOutputName, type ProcessResult } from '../utils/imageProcessor';
import { packZip, downloadBlob } from '../utils/zipPacker';

export default function ExportBar() {
  const images = useAppStore((s) => s.images);
  const watermark = useAppStore((s) => s.watermark);
  const exportSettings = useAppStore((s) => s.exportSettings);
  const updateExport = useAppStore((s) => s.updateExport);
  const presetKey = useAppStore((s) => s.presetKey);
  const setPreset = useAppStore((s) => s.setPreset);
  const processing = useAppStore((s) => s.processing);
  const progress = useAppStore((s) => s.progress);
  const setProcessing = useAppStore((s) => s.setProcessing);
  const setProgress = useAppStore((s) => s.setProgress);
  const selectImage = useAppStore((s) => s.selectImage);

  const preset = platformPresets.find((p) => p.key === presetKey) ?? platformPresets[0];

  const handleProcess = async () => {
    if (images.length === 0 || processing) return;
    const targets = images.filter((i) => i.status !== 'error');
    if (targets.length === 0) return;

    setProcessing(true);
    setProgress({ total: targets.length, done: 0, currentName: '' });

    const results: ProcessResult[] = [];
    const failed: string[] = [];

    for (let i = 0; i < targets.length; i++) {
      const item = targets[i];
      setProgress({ total: targets.length, done: i, currentName: item.name });
      selectImage(item.id);
      try {
        const r = await processImage(item, watermark, exportSettings, preset);
        results.push({ ...r, name: buildOutputName(r.name, exportSettings, i + 1) });
      } catch (e) {
        failed.push(item.name);
        console.error(e);
      }
      // 让 UI 有机会渲染进度
      await new Promise((r) => setTimeout(r, 0));
    }

    setProgress({ total: targets.length, done: targets.length, currentName: '' });

    if (results.length > 0) {
      const zip = await packZip(results);
      const stamp = new Date().toISOString().slice(0, 10);
      downloadBlob(zip, `markflow-水印-${stamp}.zip`);
    }

    setProcessing(false);
    setProgress(null);

    const failedMsg = failed.length ? `，${failed.length} 张失败（${failed.slice(0, 3).join('、')}…）` : '，全部成功';
    alert(`处理完成：已下载 ${results.length} 张图片${failedMsg}`);
  };

  const pct = progress && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="border-t border-slate-200 bg-white">
      <div className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center">
        {/* 平台预设 */}
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="shrink-0 text-xs text-slate-400">预设</span>
          {platformPresets.map((p) => (
            <button
              key={p.key}
              onClick={() => setPreset(p.key)}
              title={p.hint}
              className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                presetKey === p.key
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* 导出设置 / 处理按钮 */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={exportSettings.format}
            onChange={(e) => updateExport({ format: e.target.value as 'jpeg' | 'png' | 'webp' })}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="jpeg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>

          <select
            value={exportSettings.naming}
            onChange={(e) => updateExport({ naming: e.target.value as 'original' | 'prefix' | 'suffix' | 'sequence' })}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="original">原文件名</option>
            <option value="prefix">加前缀</option>
            <option value="suffix">加后缀</option>
            <option value="sequence">序号命名</option>
          </select>

          <Button
            onClick={handleProcess}
            disabled={processing || images.length === 0}
            className="min-w-[160px]"
          >
            {processing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                处理中 {pct}%
              </>
            ) : (
              <>批量处理（{images.length}）</>
            )}
          </Button>
        </div>
      </div>

      {processing && progress && (
        <div className="px-3 pb-3">
          <div className="mb-1 flex justify-between text-xs text-slate-400">
            <span className="truncate">{progress.currentName || '准备中…'}</span>
            <span>
              {progress.done}/{progress.total}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
