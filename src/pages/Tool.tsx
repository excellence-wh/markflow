import { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageList from '../components/ImageList';
import PreviewCanvas from '../components/PreviewCanvas';
import WatermarkPanel from '../components/WatermarkPanel';
import ExportBar from '../components/ExportBar';
import { useAppStore } from '../store/useAppStore';

export default function Tool() {
  const images = useAppStore((s) => s.images);
  // 移动端底部切换：list / settings
  const [mobileTab, setMobileTab] = useState<'list' | 'settings'>('list');

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      {/* 顶栏 */}
      <header className="z-40 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-sm text-white">
            印
          </span>
          <span className="hidden sm:inline">印流 MarkFlow</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline">纯前端 · 图片不上传</span>
          <a
            href="https://github.com/excellence-wh/markflow"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg px-2 py-1 hover:bg-slate-100 hover:text-slate-600"
          >
            GitHub ★
          </a>
        </div>
      </header>

      {/* 主体：桌面三栏，移动端自适应 */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* 图片列表（桌面常驻；移动端作为抽屉） */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
          <ImageList />
        </aside>

        {/* 预览画布 */}
        <main className="relative flex min-h-0 flex-1 flex-col">
          <PreviewCanvas />
          {/* 移动端抽屉 */}
          <div className="lg:hidden">
            {images.length > 0 && (
              <div className="flex gap-2 border-t border-slate-200 bg-white p-2">
                <button
                  onClick={() => setMobileTab('list')}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium ${mobileTab === 'list' ? 'bg-brand-600 text-white' : 'text-slate-600'}`}
                >
                  图片列表（{images.length}）
                </button>
                <button
                  onClick={() => setMobileTab('settings')}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium ${mobileTab === 'settings' ? 'bg-brand-600 text-white' : 'text-slate-600'}`}
                >
                  水印设置
                </button>
              </div>
            )}
            {mobileTab === 'list' && images.length > 0 && (
              <div className="max-h-64 overflow-y-auto border-t border-slate-200 bg-white">
                <ImageList />
              </div>
            )}
            {mobileTab === 'settings' && (
              <div className="max-h-[50vh] overflow-y-auto border-t border-slate-200 bg-white">
                <WatermarkPanel />
              </div>
            )}
          </div>
        </main>

        {/* 水印设置（桌面常驻） */}
        <aside className="hidden w-[300px] shrink-0 overflow-y-auto border-l border-slate-200 bg-white lg:block">
          <WatermarkPanel />
        </aside>
      </div>

      {/* 底部导出 */}
      <div className="shrink-0">
        <ExportBar />
      </div>
    </div>
  );
}
