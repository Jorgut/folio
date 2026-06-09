# Folio · 杂志风 PPT Skill

> 由 Jorgut 创建 · 基于 MIT 协议开源

## 这个 Skill 做什么

生成**单文件 HTML** 的横向翻页 PPT，采用杂志编辑式排版设计，支持多种分发格式：

```
HTML (源文件) ─┬─ PPTX ───→ PowerPoint / Google Slides / Keynote
               ├─ PDF  ───→ 打印 / InDesign / 分享
               ├─ HTML ───→ 浏览器直接演示（可交互）
               └─ PNG  ───→ Figma / 设计稿导入
```

### 核心能力

1. **杂志级排版** — 不对称网格、图文重叠、全出血图、CSS 多列正文、大字号对比
2. **多格式导出** — PPTX（Native 全文字可编辑）、PDF（可导入 InDesign）
3. **12 种杂志布局** — 封面、不对称 split、overlap、full-bleed 引语、editorial 正文、数据大字报、图片画廊、收束页、时间线、左右跨页、并排对比、编号清单
4. **交互式演示** — 缩略图概览、全屏、URL Hash 定位、快捷键面板、进度条
5. **跨工具协作** — 输出格式兼容 Figma / Google Slides / Keynote / InDesign

## 设计工作流（核心方法论）

> 不要跳过 IA 和 wireframe 直接写 HTML。结构错了后面全白费。

```
IA (信息架构) → Lo-fi Wireframe → Mid-fi → Hi-fi → HTML Mockup → Native Export
```

### 完整流程

| 阶段 | 活动 | 产出 | 参考文件 |
|------|------|------|---------|
| **Phase A: IA** | 内容盘点、受众分析、叙事弧 | Deck Structure Document | `references/information-architecture.md` |
| **Phase B: Lo-fi** | 方块 + 占位符，5-10 分钟/页 | 手绘或简单数字草图 | `references/wireframing.md` |
| **Phase C: Mid-fi** | Grid + 标注 + 内容层级 | 标注完整的线框图 | `references/wireframing.md` |
| **Phase D: Hi-fi** | 真实内容 + 精确间距 | 开发交接文档 | `references/wireframing.md` |
| **Phase E: HTML** | 用 Folio 模板实现 | index.html (mockup) | 本文件 Step 2-4 |
| **Phase F: Export** | Native PPTX / PDF | .pptx / .pdf | 本文件 Step 4 |

### 快速开始

1. **IA 先行**：用 `references/information-architecture.md` 的模板做内容盘点
2. **Wireframe**：用 `templates/wireframe-sheet.html` 做线框图（打印或浏览器填写）
3. **实现**：按本文件 Step 2-4 填充 HTML
4. **导出**：用 `scripts/export-pptx.mjs` 或 `scripts/export-pdf.mjs`

### 参考文件

| 文件 | 内容 |
|------|------|
| `references/presentation-design.md` | 编辑设计模式、NYT Magazine、Stripe Press、Monocle 等参考 |
| `references/information-architecture.md` | IA 五阶段流程、内容盘点模板、叙事弧模型 |
| `references/wireframing.md` | Lo-fi/Mid-fi/Hi-fi 定义、线框图模板、验证检查清单 |
| `references/checklist.md` | P0-P3 质量检查清单 |
| `templates/wireframe-sheet.html` | 可打印的线框图纸（13 种布局 + 注释区）|
| `scripts/export-native-pptx.mjs` | Native PPTX 导出（全文字可编辑）|
| `scripts/layout-mapping.mjs` | 12 种布局映射引擎（PptxGenJS 原生 shape）|
| `scripts/export-verify.mjs` | 输出验证脚本（11 项检查）|

### 设计原则

> 违反其中任何一条，杂志感都会垮。

1. **不对称优于对称** — 不要 50/50 均分，用 4/8、3/9、7/5 制造视觉张力
2. **图文重叠创造层次** — 文字浮在图上是杂志的灵魂，不要把所有元素隔开
3. **全出血图呼吸感** — 图片突破安全区边界，让画面透气
4. **字号对比要极端** — 主标题与正文比例 ≥ 6:1，越大越细（display 用 300-400，正文用 400-500）
5. **留白是设计的一部分** — 不要填满每个角落，大片空白传递自信
6. **字体分工明确** — 标题衬线/正文非衬线/元数据等宽，三种字体互不侵占
7. **图片是第一公民** — 图片用标准比例（21:9 / 16:10 / 4:3 / 3:2），不要用原图奇葩比例
8. **一个 deck 一套主题色** — 不要中途换色，不要自定义 hex

## 交互式演示

模板内置完整的交互系统，在浏览器中直接打开即可使用：

| 操作 | 效果 |
|------|------|
| `→` `↓` `Space` | 下一页 |
| `←` `↑` | 上一页 |
| `G` | 缩略图概览 — 点击任意缩略图跳转 |
| `F` | 全屏切换 |
| `Escape` | 回到首页 / 关闭概览 |
| `B` | 低功耗模式（关闭动效） |
| `?` | 快捷键面板 |
| `⌘` 按钮 | 显示/隐藏导航箭头与页码 |
| URL Hash | `index.html#3` 直接打开第 3 页 |
| 顶部进度条 | 显示当前进度 |
| 滚轮 / 触屏滑动 | 翻页 |

## 布局体系

| # | 布局 | 用途 |
|---|------|------|
| 1 | **Cover** | 封面 — 居中或偏置大字 |
| 2 | **Split 4-8 / 3-9 / 7-5** | 不对称图文 split |
| 3 | **Overlap** | 全出血图 + 浮层文字面板 |
| 4 | **Bleed Quote** | 全出血图 + 大引语重叠 |
| 5 | **Editorial** | CSS 双栏正文 |
| 6 | **Stats** | 数据大字报 |
| 7 | **Gallery** | 图片画廊（auto-fill 自适应列数） |
| 8 | **Closing** | 收束页 |
| 9 | **Timeline** | 时间线 / 流程步骤 |
| 10 | **Spread** | 左右全出血跨页图文 |
| 11 | **Compare** | 并排对比（旧 vs 新 / A vs B）|
| 12 | **List** | 编号列表 / 原则清单 |

## 工作流

### Step 1 · 需求澄清
- 受众是谁？
- 多少页？（15 分钟 ≈ 10 页，30 分钟 ≈ 20 页）
- 有没有原始素材？
- 有无图片/截图需求？
- 输出目标：PPTX / PDF / 浏览器演示 / Figma 协作？
- 选主题色

### Step 2 · 拷贝模板
```bash
cp <SKILL_ROOT>/index.html 项目/ppt/index.html
mkdir -p 项目/ppt/images
```

### Step 3 · 填充内容
1. 从 `index.html` 里读 `<style>` 块确认类名已定义
2. 规划主题节奏（hero/dark/light 交替，不允许连续 3 页同主题）
3. 挑布局，粘 `<section>` 骨架，改文案和图片路径
4. 图片放到 `images/`，命名 `{页号}-{语义}.{ext}`

### Step 4 · 导出分发

#### 导出 PPTX（Native 全文字可编辑 — 推荐）
```bash
node <SKILL_ROOT>/scripts/export-native-pptx.mjs 项目/ppt/index.html
```
输出同目录 `.pptx`。所有文字/色块/网格线均为 PptxGenJS 原生对象，在 PowerPoint / Google Slides / Keynote 中完全可编辑、可改字体、可重新排版。仅照片/插图使用截图嵌入。

**12 种布局自动映射**：cover / split-4-8 / overlap-right / bleed-quote / editorial / stats / gallery / closing / timeline / spread / compare / list，外加智能 fallback。

#### 输出验证
```bash
node <SKILL_ROOT>/scripts/export-verify.mjs 项目/ppt/index.html
```
11 项全自动检查：slide 数量、layout 识别、console error、PPTX 结构、文字提取完整性、slide 逐页内容预览。

#### 导出 PDF（文字可选中，InDesign 可用）
```bash
node <SKILL_ROOT>/scripts/export-pdf.mjs 项目/ppt/index.html
```
输出同目录 `.pdf`。文字为矢量可选中，文件极小（8 页 ≈ 32KB）。

**在 InDesign 中使用**：`文件 → 置入` 选择 PDF → 每页为独立页面。
**直接打印**：PDF 预设 16:9 页面尺寸，可直接送印。

### Step 5 · 预览 + 迭代
```bash
open 项目/ppt/index.html
```
浏览器直接打开，支持快捷键交互。inline style 改字号/间距即可。改完后重新导出。

## 协作流程

### Figma 协作

**将 Folio 导入 Figma：**
1. 导出 PDF（`export-pdf.mjs`）
2. 在 Figma 中：菜单 → `File → Place Image / Import` → 选择 PDF
3. 每页自动拆分为独立 Frame，可直接编辑

**将 Figma 设计稿转为 Folio：**
1. 在 Figma 中选中 Frame → `Export → PNG`（或使用 Figma REST API 批量导出）
2. 将图片放入 `项目/ppt/images/`
3. 在 HTML 中引用图片路径，调整布局类名

### Google Slides / Keynote 协作

1. 导出 PPTX（`export-pptx.mjs`）
2. 上传至 Google Drive 或用 Keynote 打开
3. 可在其中添加动画、过渡效果、演讲者备注
4. 如果在 Google Slides 中修改后需同步回 HTML：截图对比 → 手动更新 HTML

### InDesign 出版

1. 导出 PDF（`export-pdf.mjs`）
2. InDesign 中 `文件 → 置入（Ctrl+D）` → 选择 PDF
3. 勾选 `显示导入选项` → 选择页面范围
4. 每页作为独立页面置入，可继续排版

## 主题色预设

| 主题 | 适用场景 |
|------|---------|
| 🖋 **墨水经典**（默认） | 通用、商业 |
| 🌊 **靛蓝瓷** | 科技、研究 |
| 🌿 **森林墨** | 自然、文化 |
| 🍂 **沙丘** | 艺术、创意 |

在 `<body>` 标签上切换 `class="theme-sand"` 为 `class="theme-indigo"` 或 `class="theme-forest"`。

## 技术依赖

- PptxGenJS（gitbrent）— PPTX 生成核心库
- Playwright（Microsoft）— Headless 浏览器截图 + PDF 生成

## 自适应设计体系

模板内置完整的自适应/响应式系统，无需额外配置：

### 流体缩放（CSS Clamp）

字号和间距使用 `clamp()` 函数，在任何窗口宽度下平滑过渡，不依赖媒体查询硬断点：

| 属性 | 公式 | 范围 |
|------|------|------|
| `--text-hero` | `clamp(2.5rem, min(9.4vw, 16.9vh), 7rem)` | 40–112px |
| `--text-display` | `clamp(1.5rem, min(5.6vw, 10.1vh), 4rem)` | 24–64px |
| `--text-title` | `clamp(1.125rem, min(3.2vw, 5.8vh), 2.5rem)` | 18–40px |
| `--safe-x` | `clamp(16px, 5vw, 80px)` | 16–80px |
| `--safe-y` | `clamp(12px, 4.44vh, 64px)` | 12–64px |
| `--sp-7` | `clamp(22px, 2.6vw, 40px)` | 22–40px |

间距系统（`--sp-1` 到 `--sp-12`）全部按视口宽度等比缩放。

### 布局断点

只在内容坍塌处打断，不按设备型号划分：

| 断点 | 行为 |
|------|------|
| **≥1024px** | 完整杂志布局，无变化 |
| **768–1023px**（平板） | Gallery 列数减少、overlay 面板缩小、editorial 字号微调 |
| **<768px**（手机） | 全部堆叠：split 单列、gallery 2 列无 hero、stats 单列、overlay 全宽透明浮层、editorial 单栏、bleed-quote 嵌入 grid 流式 |
| **<400px** | 安全区收缩至 12px |

### Auto-Layout 网格

Gallery 使用 `auto-fill` + `minmax()`，列数随容器宽度自动调整：

```css
.layout-gallery {
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-auto-flow: dense;
}
```

工具类：`.grid-auto-sm`（≥140px/列）、`.grid-auto-md`（≥200px/列）、`.grid-auto-lg`（≥280px/列）。

### 自适应（Adaptive）

针对设备能力自动调整：

| 规则 | 触发条件 | 效果 |
|------|---------|------|
| 触屏模式 | `hover: none` + `pointer: coarse` | 导航点放大至 14px，禁用无意义的 hover |
| 横屏手机 | `orientation: landscape` + `max-height: 500px` | 压缩垂直间距，slide 可滚动 |
| 大屏增强 | `min-width: 1600px` | 安全区加大，overlay 面板扩至 600px |
| 打印导出 | `print` | 隐藏导航，break-after: page，禁用动效 |
| 弱动效 | `prefers-reduced-motion: reduce` | 关闭所有过渡和动画 |

### 导航安全区

页脚固定导航不遮挡文字——所有内容容器底部预留 `72px`（手机端 `64px`）padding，确保文字和页码之间始终有间距。
