---
name: folio
description: Magazine-style presentation skill that turns structured content into editable decks across HTML, PPTX, PDF, Figma, and IDML.
version: 1.0.0
tags:
  - presentation
  - slides
  - editorial
  - figma
  - pdf
  - pptx
compatible_with:
  - claude-code
  - opencode
  - codex
  - generic-llm
---

# Folio · 版式引擎

> Layout Engine。你给内容 + 风格，我给 deck。
> 不做设计咨询，只做高质量渲染。3 分钟出 deck。

## Cross-platform loading note

This skill is designed to degrade gracefully across different agent platforms.

- If the host supports **file-based skills**, load this folder as `folio` and use `SKILL.md` as the entrypoint.
- If the host does **not** support native skills, paste the relevant parts of `SKILL.md` into the system prompt / project instructions / custom GPT instructions.
- If the host does not resolve `<SKILL_ROOT>`, replace it with the absolute path to this folder before running export commands.

## Update check policy

Folio includes a cross-platform update core:

- `manifest.json` — machine-readable release metadata
- `VERSION` — human-readable local version
- `CHANGELOG.md` — release notes
- `scripts/check-update.mjs` — safe update check
- `scripts/self-update.mjs` — user-confirmed upgrade path

Trigger rules:

1. If the host supports **startup hooks** or **automated skill entry actions**, run:
   ```bash
   node <SKILL_ROOT>/scripts/check-update.mjs
   ```
   when Folio is loaded.
2. If the host does **not** support startup hooks, run the same check on **first use in the session**.
3. If script execution or network access is unavailable, **skip the check and continue normally**.
4. If an update is found, **inform the user and ask whether to run**:
   ```bash
   node <SKILL_ROOT>/scripts/self-update.mjs
   ```

Do not silently overwrite the local skill. Update checks may be automatic, but upgrades must remain user-confirmed.

## 不知道怎么开始时，直接这样做

先不要同时决定风格、主题色、导出格式和插件流程。

默认起手式：

1. 先做 **8 页 deck**
2. 风格先用 **Minimal** 或 **Editorial**
3. 输出先选 **HTML**
4. 确认结构后，再导出 **PPTX / PDF / Figma / IDML**

给 AI 的最小可用提示词：

> 用 Folio 做一个关于 `[主题]` 的 8 页演示，风格干净现代，先导出 HTML。

工作原则：**先把内容结构跑通，再做风格微调和多格式导出。**

## 工作流

### Step 1: 确定风格

如果用户没有明确要求，默认：
- 风格：`Minimal`
- 主题：`theme-default`
- 输出：`HTML`
- 页数：`8`

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
| **Figma**（双模式：C2D 云API / 本地插件） | `node <SKILL_ROOT>/scripts/export-figma.mjs index.html` |
| IDML（InDesign 原生导入） | `node <SKILL_ROOT>/scripts/export-idml.mjs index.html` |
| 验证 | `node <SKILL_ROOT>/scripts/export-verify.mjs index.html` |

### Figma 导出

**自动模式（推荐）：**
```bash
node scripts/export-figma.mjs index.html
```
→ 有 `C2D_API_KEY` 则用 Code.to.Design（高 fidelity，剪贴板粘贴）
→ 无 key 则用本地插件模式

**手动指定模式：**
```bash
node scripts/export-figma.mjs --mode c2d index.html    # 强制云 API
node scripts/export-figma.mjs --mode local index.html   # 强制本地插件
```

#### 本地插件模式（免费）
1. `node scripts/export-figma.mjs --mode local index.html` → 生成 `index.figma.json` + `figma-plugin/`
2. Figma 中：Plugins → Development → Import plugin from manifest… → 选择 `figma-plugin/manifest.json`
3. **Figma Design** 中运行：Plugins → Folio Importer → 选择 `index.figma.json` → Import
4. **Figma Slides** 中运行：打开 Slides 文件 → 同样运行 Folio Importer → 自动创建 Slide 节点（1920×1080）

#### Code.to.Design 模式（高 fidelity）
1. 配置环境变量：`export C2D_API_KEY="你的key"`
2. `node scripts/export-figma.mjs --mode c2d index.html`
3. 自动打开浏览器 Paste Helper → 复制到剪贴板 → Figma 粘贴

> 首次使用本地模式需要注册插件（一次性）。C2D 模式首次运行会自动引导获取 API Key。

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
