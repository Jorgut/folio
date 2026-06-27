# Folio · 版式引擎

> 由 Jorgut 创建 · MIT 协议开源

**Layout Engine。** 你给内容 + 风格，Folio 给 deck。不做设计咨询，只做高质量渲染。

```
内容 + 风格 → 拷贝模板 → 填充 → 导出 (HTML / PPTX / PDF)
```

---

## 文件结构

```
folio/
├── SKILL.md                      ← 入口：4 步工作流 + 决策表
├── index.html                    ← 主模板（16 种布局 + 交互系统）
├── design/
│   ├── style-guide.md            ← 10 种风格完整参数
│   ├── principles.md             ← 设计原则速查 + 交互层级
│   └── knowledge-base/           ← 教学：Gestalt / UX Laws / Accessibility / 信息设计
├── engines/
│   ├── layout-engine.md          ← 16 种布局选择与组合规则
│   ├── typography-engine.md      ← 字体系统与配对矩阵
│   ├── color-engine.md           ← 配色系统与 8 主题色板
│   ├── interaction-engine.md     ← L0-L4 交互层级
│   ├── animation-engine.md       ← 动效方案与缓动速查
│   ├── visual-effects-engine.md  ← 视觉特效（Glass/Aurora/Noise...）
│   └── export-engine.md          ← 输出格式选择
├── scripts/
│   ├── generate-theme.mjs        ← 主题代码生成器
│   ├── export-native-pptx.mjs    ← Native PPTX 导出
│   ├── export-print-pdf.mjs      ← 出版级 PDF 导出
│   ├── export-pdf.mjs            ← 基础 PDF 导出
│   ├── export-verify.mjs         ← 输出验证
│   ├── layout-mapping.mjs        ← 布局映射引擎
│   └── design-decision.mjs       ← 交互式风格选择 CLI
├── references/                   ← 设计参考文件
└── templates/                    ← 线框图模板
```

## 核心特性

| 特性 | 状态 |
|------|------|
| 杂志级排版（16 种布局，不对称优先） | ✅ 稳定 |
| 8pt Grid + 12 Column 设计系统 | ✅ 稳定 |
| 交互式演示（快捷键、概览、全屏、低功耗） | ✅ 稳定 |
| 10 种视觉风格（Minimal/Editorial/Swiss/Glass...） | ✅ v0.9 |
| Native PPTX 导出（全文字可编辑） | ✅ 稳定 |
| 出版级 PDF（3mm 出血 + 裁切标记） | ✅ 稳定 |
| 响应式/自适应设计（mobile/tablet/desktop） | ✅ 稳定 |
| 主题色切换（8 套预设） | ✅ 稳定 |

## 快速开始（4 步）

```bash
# 1. 拷贝模板到项目
cp index.html 我的项目/ppt.html
mkdir -p 我的项目/images

# 2. 在 <body> 上选主题
# <body class="theme-indigo">  — 科技感
# <body class="theme-sand">    — 暖色调
# <body class="theme-mono">    — 极简单色
# 完整 8 套主题在 SKILL.md / 风格参数在 design/style-guide.md

# 3. 浏览器预览
open 我的项目/ppt.html

# 4. 导出 PPTX（安装依赖后）
cd scripts && npm install && npx playwright install chromium
node export-native-pptx.mjs 我的项目/ppt.html

# 验证输出
node export-verify.mjs 我的项目/ppt.html
```

## 设计工作流

```
确定风格 → 拷贝模板 → 填充内容 → 导出分发
```

SKILL.md 有完整的 4 步流程 + 风格决策表 + 约束规则。

## 10 种视觉风格

| 风格 | 语感 | 参考 | 主题 |
|------|------|------|------|
| **Minimal** | 少即是多 | Apple | `default` / `mono` |
| **Editorial** | 印刷杂志搬上屏幕 | NYT Magazine | `default` / `sand` |
| **Swiss** | 网格与秩序 | 瑞士国际主义 | `mono` |
| **Architectural** | 空间与结构 | Tadao Ando | `forest` |
| **Brutalism** | 粗犀牛排版 | 反设计运动 | `sand` |
| **Glass** | 未来感透明层次 | Apple Vision Pro | `indigo` / `ocean` |
| **Dark** | 暗底发光 | GitHub Dark | `indigo` |
| **Bento** | 井然有序的网格 | Dashboard | `mono` |
| **Luxury** | 昂贵感 | 高端品牌 | `rose` |
| **Cyberpunk** | 霓虹夜色 | 赛博朋克 | `neon` |

完整参数（字体/颜色/间距/动效/特效/布局/禁忌）→ `design/style-guide.md`

## 交互式演示

| 快捷键 | 功能 |
|--------|------|
| `→` `↓` `Space` | 下一页 |
| `←` `↑` | 上一页 |
| `G` | 缩略图概览 |
| `F` | 全屏切换 |
| `Escape` | 回到首页 / 关闭概览 |
| `B` | 低功耗模式 |
| `?` | 快捷键面板 |

## 依赖

- [PptxGenJS](https://github.com/gitbrent/PptxGenJS) — PPTX 生成
- [Playwright](https://playwright.dev) — 浏览器渲染 + 截图 + PDF

## 协作

| 目标工具 | 导出方式 | 说明 |
|---------|---------|------|
| **PowerPoint** | PPTX | 直接打开，文字可编辑 |
| **Google Slides** | PPTX → 上传 | 上传到 Drive |
| **Keynote** | PPTX → 打开 | 双击即可 |
| **Figma** | PDF → 导入 | 菜单 Import → PDF |
| **InDesign** | PDF → 置入 | 文件 → 置入 → PDF |

## 许可证

MIT License · Copyright (c) 2026 Jorgut
