# Folio · 版式引擎

> Layout Engine。你给内容 + 风格，我给 deck。
> 不做设计咨询，只做高质量渲染。3 分钟出 deck。

## 工作流

### Step 1: 确定风格

除非用户明确指定，否则用决策表定：

| 场景 | 风格 | 主题 class |
|------|------|-----------|
| 商业/正式/科技 | Minimal | `default` / `mono` |
| 杂志/内容/学术 | Editorial | `default` / `sand` |
| 设计/艺术/文化 | Swiss | `mono` |
| 建筑/空间/作品集 | Architectural | `forest` |
| 大胆/反传统 | Brutalism | `sand` |
| 科技/现代/SaaS | Glass | `indigo` / `ocean` |
| 深色模式/科技 | Dark | `indigo` / `forest` |
| Dashboard/数据 | Bento | `mono` |
| 高端/品牌 | Luxury | `rose` |
| 创意/游戏 | Cyberpunk | `neon` |

完整风格参数 → `design/style-guide.md`

### Step 2: 拷贝模板

```bash
cp <SKILL_ROOT>/index.html 项目/index.html
mkdir -p 项目/images
```

在 `<body>` 上切换主题色（8 种预设）：

| class | 色感 | 适用风格 |
|-------|------|---------|
| `theme-default` | 墨水经典（暖白+古金） | Editorial, Minimal |
| `theme-indigo` | 靛蓝瓷（蓝灰） | Glass, Dark, 科技 |
| `theme-forest` | 森林墨（深绿） | Architectural, Dark |
| `theme-sand` | 沙丘（暖土） | Brutalism, Editorial |
| `theme-mono` | 单色（黑白灰） | Minimal, Swiss |
| `theme-neon` | 霓虹（暗底+荧光） | Cyberpunk |
| `theme-rose` | 玫瑰（暖粉+金） | Luxury |
| `theme-ocean` | 海洋（冷蓝） | Glass, Tech |

### Step 3: 填充内容

1. 读 `design/style-guide.md` → 按风格参数调字体/颜色/间距/特效
2. 读 `engines/layout-engine.md` → 选布局组合（16 种布局，不对称优先）
3. 粘 `<section data-layout="cover">`，改文案和图片路径
4. 图片放 `images/`，命名 `{页号}-{语义}.{ext}`

### Step 4: 导出

| 格式 | 命令 |
|------|------|
| PPTX（推荐，文字可编辑） | `node <SKILL_ROOT>/scripts/export-native-pptx.mjs index.html` |
| PDF 印刷 | `node <SKILL_ROOT>/scripts/export-print-pdf.mjs index.html` |
| **Figma**（文字可编辑，可导入 Figma） | `node <SKILL_ROOT>/scripts/export-figma.mjs index.html` |
| IDML（InDesign 原生导入） | `node <SKILL_ROOT>/scripts/export-idml.mjs index.html` |
| 验证 | `node <SKILL_ROOT>/scripts/export-verify.mjs index.html` |

### Figma 导入

1. `node scripts/export-figma.mjs index.html` → 生成 `index.figma.json`
2. Figma 中：Plugins → Development → Import plugin from manifest… → 选择 `figma-plugin/manifest.json`
3. 再次 Plugins → Folio Importer → 选择 `index.figma.json` → Import
4. 自动生成 16 页，每页一个 Frame + 文字图层 + 图片

> 首次使用需要注册插件（一次性）。后续只需步骤 1 + 3。

## 文件索引

| 你要什么 | 读这个 |
|---------|-------|
| 风格参数（字体/颜色/特效/禁忌） | `design/style-guide.md` |
| 布局规则（什么时候用什么布局） | `engines/layout-engine.md` |
| 排版规则（字体配对/字号层级） | `engines/typography-engine.md` |
| 配色方案（主题色板/决策规则） | `engines/color-engine.md` |
| 交互模式（按场景选，不要随机加） | `design/principles.md` → Interaction Levels |
| 动效方案（时长/曲线/序列） | `engines/animation-engine.md` |
| 视觉特效（Glass/Aurora/Noise/Glow） | `engines/visual-effects-engine.md` |
| 导出参数（PPTX/PDF/Figma 配置） | `engines/export-engine.md` |
| 设计原理（Gestalt / UX Laws） | `design/principles.md` |

## 约束（违反 = 重做）

- **8pt Grid** — 间距严格 `--sp-4`(32) / `--sp-5`(40) / `--sp-6`(48) / `--sp-7`(56) / `--sp-8`(64) / `--sp-9`(80)
- **12 Column Grid** — 内容区 12 列，子元素 `col-span-*`
- **不对称优先** — 别用 50/50，用 4/8、3/9、7/5
- **字号对比 ≥ 6:1** — 主标题 vs 正文
- **一个 deck 一套主题色** — 中途不换
- **连续 2 页相同布局后必须换布局**
- **导航层级 ≤ 3 层**（Hick's Law）
- **触控目标 ≥ 44px**（Fitts's Law）
- **不要随机加动效** — 从 `design/principles.md` 选合适的交互层级
- **封面 / 章节页 / 收束页** 必须用居中或大字布局
