import { Link, useLocation } from 'react-router-dom';

const GITHUB = 'https://github.com/excellence-wh/markflow';

export function Navbar({ transparent = false }: { transparent?: boolean }) {
  const location = useLocation();
  const onTool = location.pathname === '/tool';
  return (
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md ${
        transparent ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/80'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className={`flex items-center gap-2 text-lg font-bold ${transparent ? 'text-white' : 'text-slate-900'}`}>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-base text-white">印</span>
          印流 MarkFlow
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {!onTool && (
            <Link
              to="/tool"
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              免费使用
            </Link>
          )}
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              transparent ? 'text-slate-200 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            GitHub ★
          </a>
        </div>
      </nav>
    </header>
  );
}

export function Footer({ dark = false }: { dark?: boolean }) {
  return (
    <footer className={`border-t ${dark ? 'border-white/10 bg-slate-950 text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-sm text-white">印</span>
            印流 MarkFlow
          </div>
          <p className="text-sm">纯前端处理 · 图片不上传服务器 · 你的数据只属于你</p>
          <div className="flex items-center gap-4 text-sm">
            <a href={GITHUB} target="_blank" rel="noreferrer" className="hover:text-white">
              GitHub
            </a>
            <span>·</span>
            <a href="mailto:excellence.wh@outlook.com" className="hover:text-white">
              联系管理员
            </a>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} 印流 MarkFlow · MIT License · 电商 / 小红书博主批量水印工具
        </p>
      </div>
    </footer>
  );
}
