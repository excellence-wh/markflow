# 印流 MarkFlow 🌊

> 电商 / 小红书博主批量水印工具 — 上传百张图，三秒全打好水印

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/excellence-wh/markflow)
[![React](https://img.shields.io/badge/React-18-blue.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)]()
[![PWA](https://img.shields.io/badge/PWA-✓-green.svg)]()

**印流 MarkFlow** 是一款面向电商卖家、小红书博主、内容创作者的**批量图片水印工具**。一键为几十上百张图片添加自定义文字/图片水印，适配小红书、淘宝、拼多多等主流平台尺寸。

> 🚀 纯前端处理 —— 图片**全程在浏览器本地完成，不上传服务器**，隐私安全，零服务器成本。

---

## ✨ 特性

- ⚡ **批量处理**：一次上传 200 张，一键全部加水印
- ✏️ **文字水印**：自定义字体、颜色、字号、透明度、旋转、描边
- 🏷️ **图片水印**：上传 Logo，支持透明底、缩放、透明度
- 🧭 **灵活定位**：九宫格快速定位 + 边距微调 + 平铺防盗图
- 📐 **平台预设**：小红书 / 淘宝 / 拼多多尺寸一键适配
- 🔒 **隐私安全**：纯前端处理，图片不上传服务器
- 📦 **批量导出**：自动打包 ZIP，支持 JPG / PNG / WebP
- 📱 **PWA 可安装**：可安装到手机 / 桌面，离线可用

## 🚀 快速开始

### Web 版

```bash
# 克隆项目
git clone https://github.com/excellence-wh/markflow.git
cd markflow

# 安装依赖（推荐 pnpm）
pnpm install

# 启动开发服务器
pnpm dev
# → http://localhost:5174

# 构建生产版本
pnpm build

# 本地预览生产构建
pnpm preview
```

> 说明：本仓库使用 pnpm。首次 `pnpm install` 若提示 esbuild 构建被忽略，请在 `pnpm-workspace.yaml` 中保留 `allowBuilds: esbuild: true` 后重新安装。

### 📱 手机端（Expo React Native + Skia）

```bash
cd mobile

# 安装依赖（Expo 手机端独立用 npm）
npm install

# 启动（已装 Expo Go）
npm start

# 或直接跑 Android 原生（需 development build，Skia 原生依赖）
npx expo run:android   # 需要 expo-dev-client 开发构建
```

> 手机端使用 `@shopify/react-native-skia`（RN 里的 Canvas 等价物）做像素级水印渲染，需要 **development build**（`expo run:android` / EAS），Expo Go 无法运行 Skia。图片从相册多选 → 本地渲染水印 → 保存回相册，全程不上传。

## 🧰 技术栈

| 类别 | Web | 手机端 (mobile/) |
|-----|-----|-----|
| 框架 | React 18 + TypeScript | Expo 57 + React Native + TS |
| 构建 | Vite | Metro |
| UI | Tailwind CSS v4 | React Native 原生组件 |
| 图片处理 | Canvas API | @shopify/react-native-skia |
| 批量打包 | JSZip | expo-media-library 存相册 |
| 状态管理 | Zustand | Zustand |
| PWA | vite-plugin-pwa | - |
| 路由 | React Router | 底部 Tab（原生） |

## 📁 项目结构

```
markflow/
├── public/                  # Web 静态资源 + PWA 图标
├── mobile/                  # 📱 Expo React Native 手机端
│   ├── src/
│   │   ├── components/      # 预览 / UI 组件
│   │   ├── screens/         # Home / 设置 页
│   │   ├── watermark/       # Skia 水印渲染（geometry + renderer）
│   │   ├── lib/             # 相册选择 / 保存 / 批量处理
│   │   └── store/           # Zustand 状态
│   ├── App.tsx              # 底部 Tab 导航
│   └── app.json             # Expo 配置（权限 / dev-client）
├── scripts/                 # 工具脚本（图标生成等）
├── src/                     # Web 源码
│   ├── components/          # React 组件（Uploader/Preview/WatermarkPanel/ImageList/ExportBar）
│   ├── utils/               # Canvas 水印处理（imageProcessor/zipPacker/watermarkRenderer）
│   ├── store/               # Zustand 状态管理
│   ├── pages/               # 页面（Landing / Tool）
│   └── styles/              # 全局样式
├── docs/                    # 文档（PRD / roadmap / CHANGELOG）
├── LICENSE                  # MIT
└── package.json
```

## 📚 文档

- [产品需求文档 (PRD)](./docs/PRD.md)
- [开发路线图](./docs/roadmap.md)
- [更新日志](./docs/CHANGELOG.md)

## 💼 商业化

本项目核心功能开源免费（MIT），高级功能提供 Pro 订阅版：

- **个人学习使用**：免费
- **商业用途授权**：联系 [excellence.wh@outlook.com](mailto:excellence.wh@outlook.com)
- **源码购买 / 私有化部署**：联系 [excellence.wh@outlook.com](mailto:excellence.wh@outlook.com)

详见 [商业化说明](#)（规划中）。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](./LICENSE)
