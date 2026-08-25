import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';

const FEATURES = [
  {
    icon: '🖼️',
    title: '批量处理',
    desc: '一次上传 200 张，一键全部加水印，支持 JPG / PNG / WebP。',
  },
  {
    icon: '✏️',
    title: '文字水印',
    desc: '自定义字体、颜色、大小、透明度、旋转与描边，随心搭配。',
  },
  {
    icon: '🏷️',
    title: '图片水印',
    desc: '上传 Logo，支持透明底、缩放与透明度调节。',
  },
  {
    icon: '🧭',
    title: '灵活定位',
    desc: '九宫格快速定位、拖拽微调、平铺模式防盗图。',
  },
  {
    icon: '📱',
    title: '平台预设',
    desc: '小红书 / 淘宝 / 拼多多尺寸一键适配。',
  },
  {
    icon: '🔒',
    title: '隐私安全',
    desc: '纯前端处理，图片不上传服务器，你的数据只属于你。',
  },
];

const SCENARIOS = [
  {
    icon: '📕',
    title: '小红书博主',
    desc: '每次发笔记要给几十张图打水印防搬运，几秒全搞定。',
  },
  {
    icon: '🛍️',
    title: '电商卖家',
    desc: '商品图批量加水印防盗图，SKU 再多也不慌。',
  },
  {
    icon: '💬',
    title: '微商 / 代购',
    desc: '朋友圈图片批量加水印，品牌曝光又防盗图。',
  },
  {
    icon: '📷',
    title: '摄影师 / 设计师',
    desc: '作品图批量加版权水印，保护创作成果。',
  },
];

const STEPS = [
  { n: '01', title: '上传图片', desc: '拖拽或点击上传，一次最多 200 张' },
  { n: '02', title: '设置水印', desc: '选文字或 Logo，调样式、位置、透明度' },
  { n: '03', title: '批量导出', desc: '一键处理，自动打包 ZIP 下载' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar transparent />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 0%, rgba(59,98,246,0.35) 0%, transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 text-center sm:px-6 sm:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            纯前端 · 隐私安全 · 免费开源
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            上传百张图
            <span className="block bg-gradient-to-r from-brand-300 to-cyan-300 bg-clip-text text-transparent">
              三秒全打好水印
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
            印流 MarkFlow —— 专为电商卖家和小红书博主打造的批量水印神器。文字、Logo、
            九宫格定位、平铺防盗图，全部在浏览器本地完成。
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/tool"
              className="w-full rounded-2xl bg-brand-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-700 sm:w-auto"
            >
              立即免费使用
            </Link>
            <a
              href="#features"
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-lg font-medium text-slate-200 hover:bg-white/10 sm:w-auto"
            >
              了解更多
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-400">无需注册 · 无需上传 · 免费</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-bold">核心功能</h2>
        <p className="mt-3 text-center text-slate-400">简单三步，批量搞定</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-brand-500/50 hover:bg-white/10"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-3xl font-bold">三步搞定批量水印</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-600/15 text-xl font-black text-brand-300">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/tool"
              className="inline-flex rounded-2xl bg-brand-600 px-8 py-4 text-lg font-semibold text-white hover:bg-brand-700"
            >
              开始使用 →
            </Link>
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-bold">适用人群</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SCENARIOS.map((s) => (
            <div key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-3xl">{s.icon}</div>
              <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-24 text-center sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-600/20 to-cyan-500/10 p-10">
          <h2 className="text-2xl font-bold sm:text-3xl">现在就给图片加上水印</h2>
          <p className="mt-3 text-slate-400">无需注册，打开即用。图片全程在本地处理。</p>
          <Link
            to="/tool"
            className="mt-8 inline-flex rounded-2xl bg-brand-600 px-8 py-4 text-lg font-semibold text-white hover:bg-brand-700"
          >
            打开工具 →
          </Link>
        </div>
      </section>

      <Footer dark />
    </div>
  );
}
