# Folio · 路线图

> 从排版→设计→出版的全链路进化

## 哲学

Folio 不是另一个 PPT 模板。它是一套**杂志级排版引擎**，让内容在 HTML 里完成设计，再无损分发到任何目标格式。

```
      源文件              分发层                   终端
┌──────────────┐   ┌──────────────────┐   ┌──────────────┐
│              │   │  截图引擎 (保真)  │   │   PPTX       │
│  index.html  │───│  DOM 解析 (可编辑)│───│   Google Slides│
│  杂志式排版   │   │  Figma Plugin    │   │   Keynote    │
│  语义化标记   │   │  IDML 生成器     │   │   Figma      │
│              │   │  PDF/打印        │   │   InDesign   │
└──────────────┘   └──────────────────┘   └──────────────┘
```

---

## Phase 0 · 基石 ✓（已完成）

- 单 HTML 文件杂志模板
- 8 种布局 Pattern（cover / split / overlap / bleed-quote / editorial / stats / gallery / closing）
- 截图式 PPTX 导出（Playwright + PptxGenJS）
- 原生 PDF 导出（Playwright print engine，文字矢量可选中，32KB/8页）
- 交互式演示系统：缩略图概述（G）、全屏（F）、URL hash 导航、分享按钮、进度条、快捷键面板（?）、低功耗模式（B）
- 完整的自适应/响应式设计：3 断点 + 流体 clamp() 系统 + auto-layout grids
- 自适应特性：触屏优化、横屏手机、大屏增强（1600px+）、打印样式、弱动效适配
- 导航安全区系统（72px/64px padding 避免重叠）
- GitHub 开源（MIT）

---

## Phase 1 · 混合 PPTX 引擎（下一阶段）

**目标**：截图保布局 + DOM 解析保文字可编辑，让 Google Slides / Keynote 不仅能打开还能改。

### 1a · 文字层 DOM Reconstruct

对每个 slide，提取文字元素（标题、正文、引用）的位置、字号、颜色、字体，写入 PptxGenJS 的原生文本框。截图只做背景和图片层。

**难点**：浏览器渲染和 PPTX 渲染的度量不一致（行高、字距、fallback 字体），需要逐元素校准。

**可接受的质量标准**：85% 以上的文字位置偏差 ≤ 2px。

### 1b · 混合模式规则

| 内容类型 | 导出方式 |
|---------|---------|
| 纯文字 slide（editorial / cover / closing） | 全 DOM-reconstruct |
| 图文混合（split / stats） | 文字 DOM + 图片截图 |
| 图上有文字（overlay / bleed-quote） | 全截图（重叠关系太难解构） |

### 1c · 输出验证

- Google Slides 导入后文字可选、可编辑、可改字体
- Keynote 导入后文字可选中、可改颜色
- 对比截图和目标 PPTX 的像素级 diff ≤ 5%

---

## Phase 2 · Figma 生态

**目标**：设计师能在 Figma 里编辑 Folio 输出的内容，或把 Figma 设计稿直接变成 Folio HTML。

### 2a · HTML → Figma（Figma Plugin）

Figma Plugin 读取 Folio 的 HTML 结构，在 Figma 画布上重建图层：

```
index.html → 解析 DOM → 建 Figma 节点：
  ├── 全出血背景图 → Figma Rectangle + Image Fill
  ├── 文字层 → Figma Text 节点（保留字体/字号/颜色）
  ├── 网格布局 → Figma Auto Layout frame
  └── 图层顺序 → Figma 图层叠放顺序
```

**适用场景**：非设计师用 Folio 做初稿 → 设计师在 Figma 里精修 → 导出最终稿。

**技术要求**：Figma Plugin SDK + 自定义 DOM 解析器（约 2–4 周）。

### 2b · Figma → HTML（设计稿转 PPT）

反过来，Figma Plugin 读取选中 Frame 的样式，生成 Folio 兼容的 HTML：

```
Figma Frame → 提取样式 → 渲染为 Folio slide
  ├── Auto Layout → CSS Grid / Flexbox
  ├── Text 节点 → 对应 display-hero / lead / body 类
  ├── Image Fill → 导出图片链接
  └── 颜色/间距 → 映射到 CSS 变量
```

**适用场景**：设计师先出视觉稿 → 一键转成可演示的 HTML PPT → 再导出 PPTX。

**技术要求**：同上 Plugin + 样式映射表（约 3–5 周）。

---

## Phase 3 · 出版排版（InDesign 生态）

**目标**：直接导出为 InDesign IDML，满足专业出版需求。

### 3a · IDML 导出引擎

IDML 是基于 XML 的开放格式，本质是 InDesign 的源文件格式。需要：

```
slide 结构 → IDML 文档映射：
  ├── Master Spread → slide 页面模板
  ├── Text Frame → 文字框（带样式映射）
  ├── Rectangle / Image → 图片框（带链接）
  ├── Layer → 图层叠放顺序
  └── Character / Paragraph Styles → 段落/字符样式
```

**复杂度极高**：IDML 规范 ≈ 500+ 页，涉及文本绕排、基线网格、分栏等 InDesign 特有概念。建议基于开源 IDML 生成库（如有）或自行编写简化版生成器。

**替代方案**：走 PDF 桥接（HTML → PDF → InDesign 置入），文字不可编辑但排版完全保真，实现成本接近零。

### 3b · 出版级 PDF ⚡（基础版已完成）

**当前状态**：Playwright 原生 PDF 导出已实现（`export-pdf.mjs`），文字矢量可选中，每页 16:9，支持直接导入 InDesign。

**需增强**：
- 裁切标记（crop marks）
- 出血 3mm
- ICC 色彩管理（CMYK）
- PDF/X-1a 标准

适用于直接送印。

---

## Phase 4 · 协同与云端

**目标**：多人实时编辑 + 云端分发。

### 4a · Google Slides API 集成

- 直接通过 API 写 Slide，跳过 PPTX 中间格式
- 实时同步：修改 HTML → 更新 Google Slides

### 4b · 版本管理

- Slide 级别的 git diff（基于 semantic HTML diff）
- 多人协作编辑一个 HTML（CRDT / Yjs）

### 4c · 发布平台

- 一键部署为网页（Vercel / Netlify）
- 自动生成分享链接
- 密码保护 / 公开两种模式

---

## 优先级矩阵

| 方向 | 用户价值 | 实现成本 | 技术风险 | 推荐 |
|------|---------|---------|---------|------|
| Phase 1a DOM-reconstruct | ★★★★ | 中 | 中 | **下一阶段** |
| Phase 2a Figma Plugin | ★★★★ | 中高 | 中 | 并行探索 |
| Phase 2b Figma → HTML | ★★★ | 高 | 高 | 后置 |
| Phase 3a IDML 导出 | ★★★ | 极高 | 极高 | 远期 |
| Phase 3b 出版 PDF | ★★★ | 低 | 低 | 可随时做 |
| Phase 4a Google API | ★★★★ | 中 | 中 | Phase 1 之后 |
| Phase 1c 输出验证 | ★★★★★ | 低 | 低 | **现在开始** |

---

## 里程碑

- **v0.1** — 杂志布局模板 + PPTX 截图导出 ✓
- **v0.2** — 响应式/自适应设计 + 交互式演示 ✓
- **v0.3** — PDF 导出 + 协作工作流 ✓
- **v0.4** — PPTX 文字可编辑（混合模式）
- **v0.5** — Figma 导入 Plugin 可用
- **v0.6** — 出版级 PDF（裁切标记 / CMYK / PDF/X-1a）
- **v1.0** — Figma ↔ HTML 双向同步
- **v2.0** — IDML / InDesign 原生支持
- **v3.0** — 在线协同编辑 + 云端发布

---

*Folio 由 Jorgut 创建 · MIT 协议 · [github.com/Jorgut/folio](https://github.com/Jorgut/folio)*
