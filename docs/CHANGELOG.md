# 更新日志 (Changelog)

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 规范，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2026-08-25

### 新增
- 批量图片上传：拖拽 / 点击选择，支持 JPG / PNG / WebP，单次最多 200 张，可删除单张、清空全部
- 文字水印：内容、字号（12-120）、颜色（取色器 + 色板）、透明度、旋转、描边、粗体
- 图片水印（Logo）：上传 PNG 透明底 Logo、缩放、透明度、旋转
- 水印位置：九宫格定位、水平/垂直边距、平铺防盗图模式
- 实时预览：原图 / 效果图切换，参数改动即时刷新
- 批量处理：逐张进度显示、失败不影响其他、ZIP 打包一键下载
- 平台尺寸预设：保持原图 / 小红书 3:4 / 小红书 1:1 / 淘宝主图 / 淘宝详情宽 / 拼多多主图
- 导出设置：JPG / PNG / WebP 格式，原文件名 / 加前缀 / 加后缀 / 序号命名
- 落地页：Hero、功能卡片、三步流程、使用场景、CTA
- 响应式适配 + PWA：可安装到手机 / 桌面，离线可用
- 隐私安全：纯前端处理，图片不上传服务器

### 技术
- React 18 + TypeScript + Vite
- Tailwind CSS v4（shadcn 风格）
- Zustand 状态管理
- Canvas API 水印渲染（统一单张预览与批量导出路径）
- JSZip 批量打包
- vite-plugin-pwa（manifest + Service Worker）

[1.0.0]: https://github.com/excellence-wh/markflow/releases/tag/v1.0.0
