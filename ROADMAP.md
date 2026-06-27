# Folio · 路线图

> 从 Layout Engine → Design Intelligence Engine
>
> **当前身份**：Presentation Design Intelligence Engine — 不只是布局生成器，而是能根据用户目标/受众/场景自动决策设计方案的智能引擎。

## 哲学

Folio 不是另一个 PPT 模板。它是一套从**设计决策到高保真输出**的完整系统。核心进化路径：

```
v0.x Layout Engine                  ↗ v1.x Design Intelligence Engine
  ┌──────────────┐                   ┌──────────────────────────────┐
  │ 杂志式排版     │  ────→           │  Design Decision Layer       │
  │ 16 种布局      │  输入+决策        │  ├── 视觉风格选择             │
  │ 8 主题色       │                  │  ├── 交互层级决策             │
  │ PPTX/PDF 导出  │                  │  ├── 字体/配色/动效引擎联动   │
  └──────────────┘                   │  ├── 布局自动组合             │
                                     │  └── 输出格式智能选择         │
                                     └──────────────────────────────┘
```

```
  设计流程                    源文件                    分发层                   终端
┌────────────┐          ┌──────────────┐      ┌──────────────────┐   ┌──────────────┐
│ IA 阶段     │          │              │      │  Native 引擎      │   │   PPTX       │
│ · 内容盘点  │──→       │  index.html  │─────→│  (全文字可编辑)   │──→│   Google Slides│
│ · 受众分析  │  Wireframe│  杂志式排版   │      │  Figma Plugin    │   │   Keynote    │
│ · 叙事弧    │  → Mockup│  语义化标记   │      │  IDML 生成器     │   │   Figma      │
│             │          │              │      │  PDF/打印        │   │   InDesign   │
└────────────┘          └──────────────┘      └──────────────────┘   └──────────────┘
```

---

## 设计工作流（核心方法论）

```
┌─────────────────────────────────────────────────────────────────────┐
│  Phase A: Information Architecture                                  │
│  · 内容盘点 (Content Inventory)                                      │
│  · 受众分析 (Audience Analysis)                                      │
│  · 叙事弧 (Narrative Arc: Hook → Core → Takeaway)                    │
│  · 产出: Deck Structure Document                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Phase B: Wireframing                                                │
│  · Lo-fi: 方块 + 占位符，5-10 分钟/页                                 │
│  · Mid-fi: Grid + 标注 + 内容层级，1-2 天                              │
│  · Hi-fi: 真实内容 + 精确间距 + 响应式，1-2 周                         │
│  · 产出: Verified Wireframe Set                                       │
├─────────────────────────────────────────────────────────────────────┤
│  Phase C: Mockup (高保真)                                            │
│  · HTML 实现（Folio 模板 + CSS 变量）                                  │
│  · 视觉验证（浏览器渲染 + 截图对比）                                    │
│  · 产出: index.html (最终 mockup)                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Phase D: Native Export                                              │
│  · 所有文字/色块/网格 → PptxGenJS 原生对象                            │
│  · 只有照片/插图用截图                                                │
│  · 产出: .pptx / .pdf / Google Slides / Keynote                      │
└─────────────────────────────────────────────────────────────────────┘
```

**参考文件**：
- `references/presentation-design.md` — 编辑设计模式与参考来源
- `references/information-architecture.md` — IA 五阶段流程（适配演示文稿）
- `references/wireframing.md` — Lo-fi → Mid-fi → Hi-fi 线框图方法

---

## Phase 0 · Design Intelligence 架构 ✓（已完成）

**目标**：从 Layout Engine（版式生成器）进化为 Design Intelligence Engine（设计决策 + 引擎联动）。

### 核心变更

```
User Prompt → Decision Engine → Visual Style → Engines → Output
```

### 已完成

- SKILL.md 重构：新增决策引擎、视觉风格库、交互模式库、知识库架构
- `engines/` 目录：7 个引擎能力定义（Layout / Typography / Color / Interaction / Animation / Visual Effects / Export）
- `SKILL.md`：108 行精简工作流（风格决策表 + 4 步流程 + 约束规则）
- `design/style-guide.md`：10 种视觉风格完整参数合并（替代原先 10 个独立文件）
- `design/principles.md`：设计原则合并（UX Laws / Gestalt / Information Design / Accessibility / 交互层级）
- 布局引擎/排版引擎/配色引擎/交互引擎/动效引擎/视觉特效引擎/导出引擎 — 完整定义

### 下一步：引擎→代码联动

- `engines/color-engine.md` → 自动生成 CSS 变量
- `engines/typography-engine.md` → 自动加载 Google Fonts
- `engines/visual-effects-engine.md` → CSS 特效代码片段
- `design/style-guide.md` 和 `design/principles.md` → CLI 提示交互

---

## Phase 0.5 · 基石 ✓（已完成）

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

## Phase 1 · Native PPTX 引擎 ✓（已完成）

**目标**：所有文字、色块、网格都是 PptxGenJS 原生对象，输出的 PPTX 完全可编辑。截图只用于照片/插图。

### 核心原则

> 截图是最后手段，不是默认方案。

| 内容类型 | 导出方式 |
|---------|---------|
| 文字（标题/正文/引语/标注） | Native PptxGenJS text box |
| 色块/背景 | Native PptxGenJS shape |
| 网格/分割线 | Native PptxGenJS shape + line |
| 照片/插图 | 截图嵌入（唯一用截图的地方） |
| 图上有文字 | 文字 native + 背景图片截图 |

### 1a · 文字提取引擎 ✅

用 Playwright 的 `getComputedStyle()` + `getBoundingClientRect()` 获取**实际渲染值**，不解析 CSS clamp()。

```
浏览器渲染 → getComputedStyle() → px 值 → 转 pt → PptxGenJS text box
```

**验收获证**：12 页全文字可编辑 PPTX 导出通过验证。

### 1b · 布局映射引擎 ✅

12 种布局 mapper，将 CSS Grid/Flexbox 映射为 PptxGenJS 原生 shape（背景色块、分割线、时间线圆点、表格边框等）：

| 文件 | 说明 |
|------|------|
| `scripts/layout-mapping.mjs` | 688 行，12 mappers + fallback |
| 布局列表 | cover, split-4-8, overlap-right, bleed-quote, editorial, stats, gallery, closing, timeline, spread, compare, list |
| 集成方式 | `export-native-pptx.mjs` 中 `applyLayoutMapping()` 调用 |

### 1c · 输出验证 ✅

`scripts/export-verify.mjs` — 独立验证脚本，11 项全自动检查：

- HTML 结构：slide 数量、layout 识别、空内容检测、console error、导航完整性
- PPTX 输出：文件大小、slide XML 文件结构
- 文字提取：每页文字数量统计、slide 逐页内容预览

**验收获证**：12 slides, 3.1MB PPTX, 72 text boxes across 12 slides (avg 6/slide), 11/11 checks passed.

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

**新增出版级 PDF**（`export-print-pdf.mjs`）🎉：
- 3mm 出血 — 内容延伸至裁切边界外 3mm
- 裁切标记 — 四角 L 型注册线（0.5pt，cmyk 黑）
- TrimBox / BleedBox — pdf-lib 后处理，InDesign 自动识别
- 全出血图缩放 scale(1.04) 确保延伸到位
- 矢量文字完全保留（Playwright 渲染 + pdf-lib 嵌入）

**仍待增强**：
- ICC 色彩管理（CMYK）
- PDF/X-1a 标准
- 专色支持

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
| Phase 0.5 设计工作流（IA → wireframe → mockup） | ★★★★★ | 中 | 低 | **现在开始** |
| Phase 1a 文字提取引擎 | ★★★★ | 中 | 中 | **下一阶段** |
| Phase 1b 布局映射引擎 | ★★★★ | 中 | 中 | Phase 1a 之后 |
| Phase 2a Figma Plugin | ★★★★ | 中高 | 中 | 并行探索 |
| Phase 2b Figma → HTML | ★★★ | 高 | 高 | 后置 |
| Phase 3a IDML 导出 | ★★★ | 极高 | 极高 | 远期 |
| Phase 3b 出版 PDF | ★★★ | 低 | 低 | 可随时做 |
| Phase 4a Google API | ★★★★ | 中 | 中 | Phase 1 之后 |
| Phase 1c 输出验证 | ★★★★★ | 低 | 低 | Phase 1a 完成后 |

---

## 里程碑

- **v0.1** — 杂志布局模板 + PPTX 截图导出 ✓
- **v0.2** — 响应式/自适应设计 + 交互式演示 ✓
- **v0.3** — PDF 导出 + 协作工作流 ✓
- **v0.4** — 设计工作流框架（IA → lo-fi → mid-fi → hi-fi wireframe）✓
- **v0.5** — 模板大改：12 布局 / 8 主题 / WebGL + CSS 渐变 / 极端排版对比 ✓
- **v0.6** — Phase 1a Native PPTX 引擎（全文字可编辑）+ Phase 1b 布局映射引擎 ✓
- **v0.7** — Phase 1c 输出验证脚本 + 加伍磅真实项目验证 ✓
- **v0.8** — 出版级 PDF：3mm 出血 + 裁切标记 + TrimBox/BleedBox ✓
- **v0.9** — **Design Intelligence Engine**：决策引擎 + 视觉风格库 + 交互模式库 + 知识库 ✓
- **v1.0** — 引擎→代码联动（决策引擎 CLI / CSS 变量自动生成 / 字体自动加载）
- **v1.1** — Figma 导入 Plugin
- **v1.2** — AI Prompt → 自动决策→自动生成完整展示
- **v2.0** — Figma ↔ HTML 双向同步 / 出版级 PDF（CMYK/PDF-X）
- **v2.5** — IDML / InDesign 原生支持
- **v3.0** — 在线协同编辑 + 云端发布

---

*Folio 由 Jorgut 创建 · MIT 协议 · [github.com/Jorgut/folio-ppt](https://github.com/Jorgut/folio-ppt)*
