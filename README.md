<p align="center">
  <a href="#english">🇬🇧 English</a> · <a href="#chinese">🇨🇳 中文</a>
</p>

---

<a id="english"></a>

# Folio · Editorial Layout Skill

[![skills.sh](https://img.shields.io/badge/skills.sh-Jorgut/folio-8A2BE2?style=flat-square)](https://skills.sh/Jorgut/folio)
[![Install with npx](https://img.shields.io/badge/npx%20skills%20add-Jorgut%2Ffolio-000?style=flat-square)](https://github.com/Jorgut/folio)
![GitHub stars](https://img.shields.io/github/stars/Jorgut/folio?style=flat-square)
![License](https://img.shields.io/github/license/Jorgut/folio?style=flat-square)

Turn a brief into editorial presentations and portfolios. Start with HTML; refine or export to PPTX, PDF, Figma, or IDML.

### Editorial sample

These are **actual exports from the editable [PowerPoint adaptation](demos/distributed-studio/folio-editorial-sample.pptx)** of the [HTML editorial sample](demos/distributed-studio/index.html), not screenshots of the HTML page. Slides 1–5 show the five facing-page spreads with the presentation canvas margins cropped away. Slides 6–8 show the complete 16:9 layout studies.

![PPT export of Folio editorial opening spread, pages 01 and 02](assets/screenshots/editorial-sample/spread-01.png)

<details>
<summary>View the other four facing-page spreads</summary>

<table>
  <tr>
    <td width="50%"><img src="assets/screenshots/editorial-sample/spread-02.png" alt="PPT export: pages 03 and 04"></td>
    <td width="50%"><img src="assets/screenshots/editorial-sample/spread-03.png" alt="PPT export: pages 05 and 06"></td>
  </tr>
  <tr>
    <td><img src="assets/screenshots/editorial-sample/spread-04.png" alt="PPT export: pages 07 and 08"></td>
    <td><img src="assets/screenshots/editorial-sample/spread-05.png" alt="PPT export: pages 09 and 10"></td>
  </tr>
</table>

</details>

<details>
<summary>View the three 16:9 slide studies</summary>

<table>
  <tr>
    <td width="33%"><img src="assets/screenshots/editorial-sample/landscape-06.png" alt="PPT export: landscape opener"></td>
    <td width="33%"><img src="assets/screenshots/editorial-sample/landscape-07.png" alt="PPT export: landscape dense reading"></td>
    <td width="33%"><img src="assets/screenshots/editorial-sample/landscape-08.png" alt="PPT export: landscape image evidence"></td>
  </tr>
</table>

</details>

### Wireframe library

The catalogue below shows the current 29 wireframe layouts, exported from the [HTML preview](reference-layouts/previews/index.html) on 2026-10-08. Expand a family to inspect its pages directly in this README. These are structural previews with placeholder copy and imagery.

<details>
<summary>View the current wireframe catalogue</summary>

![Current Folio catalogue of 29 portrait, facing-page and presentation layouts](assets/screenshots/reference-layouts-current.png)

</details>

<details>
<summary>Essay / four-page reading sequence</summary>

![Four A4 essay page roles](assets/screenshots/reference-layouts-essay.png)

</details>

<details>
<summary>Longform / three structural variants</summary>

![Three A4 longform page structures](assets/screenshots/reference-layouts-longform.png)

</details>

<details>
<summary>Format adaptation / A4, 4:5 and 3:4 pages</summary>

![Portrait format adaptations and cover with continuation](assets/screenshots/reference-layouts-format-adaptation.png)

</details>

<details>
<summary>Magazine / facing-page editorial system</summary>

![Five magazine spread structures](assets/screenshots/reference-layouts-magazine.png)

</details>

<details>
<summary>Portfolio / 16:9, 4:3 and portrait boards</summary>

![Thirteen portfolio and presentation boards](assets/screenshots/reference-layouts-boards.png)

</details>

Rebuild these images with `node scripts/export-layout-catalogue.mjs` (or `FOLIO_BROWSER_CHANNEL=chrome node scripts/export-layout-catalogue.mjs` to use installed Chrome). The separate [Chinese and traditional Mongolian vertical-writing study](reference-layouts/experiments/vertical-writing/index.html) is an experimental browser preview; its [scope and verification notes](reference-layouts/experiments/vertical-writing/README.md) track export and language review still to be completed.

### Vertical Writing Variants

[Fourteen-page layout study](reference-layouts/experiments/vertical-writing/variants/index.html) · [Readable wireframes](reference-layouts/experiments/vertical-writing/variants/wireframe.html) · [Scope and reuse](reference-layouts/experiments/vertical-writing/variants/README.md)

Traditional Chinese and Mongolian each include a cover, pure-text page, four image/body layouts and a closing page. Chinese paragraph openings use two-character indentation. These remain experimental: Mongolian language review, native-editor acceptance and print production are pending.

<details>
<summary>View vertical-writing wireframes</summary>

![Fourteen vertical-writing wireframes](reference-layouts/experiments/vertical-writing/variants/wireframe-overview.png)

</details>

The [`editorial-longform-feature`](reference-layouts/templates.md#editorial-longform-feature) family includes three placeholder-based wireframes for article openers, image-led section breaks, and narrative pages with a modular side rail. Preview them in [`reference-layouts/previews/index.html`](reference-layouts/previews/index.html); type, color, and bilingual treatment remain project-specific.

The [`magazine-investigative-feature`](reference-layouts/templates.md#magazine-investigative-feature) family adds facing-page layouts for thesis-led openers, dense multi-column reading, and image-evidence spreads. Its preview uses Lorem Ipsum only to demonstrate text flow; replace filler with approved copy before delivery and keep live text clear of the center gutter.

Folio 1.0.16 also tightens the reference-layout preview system: bleed, trim, safe, and content-frame guides are distinct, and the wireframes are checked for text escaping the safe area or colliding with image placeholders, labels, and swatches. The [editorial design sample](demos/distributed-studio/index.html) shows those principles as a complete, ten-page magazine rather than a wireframe sheet. It uses Lorem Ipsum copy, three original generated editorial images spanning still life, textiles, and graphic design, plus locally bundled, credited architecture photography. Facing-page folios share one bottom baseline at the outer corners. The opening image fills the upper field, with its caption and folio in a separate white footer. [Open the full sample](demos/distributed-studio/index.html).

An appendix includes three standalone **16:9 landscape** adaptations of the existing magazine wireframes: [feature opener](demos/distributed-studio/index.html#landscape-opener), [dense reading](demos/distributed-studio/index.html#landscape-reading), and [image evidence](demos/distributed-studio/index.html#landscape-evidence). These are layout studies, not pages in the ten-page portrait magazine sequence.

The sample is an illustrative layout demo, not approved editorial content. The opening still life was generated for the demo; the credited photographs are used under the [Unsplash License](https://unsplash.com/license). Recognizable people, brands, and properties may require additional permissions for a specific use.

---

## Platform Compatibility

Folio is intentionally packaged so it can work across multiple agent ecosystems, not only one specific tool.

### Minimum contract

To be portable, a host only needs access to this folder and these files:

- `SKILL.md` — core instructions
- `SKILL.min.md` — minimal fallback instructions for low-context or prompt-only tools
- `README.md` — human-facing usage and installation guide
- `INSTALL.md` — platform-agnostic installation and troubleshooting guide
- `manifest.json` — machine-readable release metadata for update checks
- `VERSION` — local version number
- `CHANGELOG.md` — human-readable release notes
- `index.html` — base template
- `design/`, `engines/`, `scripts/`, `templates/` — supporting system files

### Installation by platform

| Platform | Recommended setup |
|----------|-------------------|
| **Claude Code** | Place the folder under `~/.claude/skills/folio/` |
| **OpenCode / OpenCode-compatible** | Place under `~/.config/opencode/skills/folio/` or your configured skills directory |
| **Codex / Codex-like agents** | Mount or copy the folder into the tool's skill / prompt workspace, and make sure `SKILL.md` is exposed as the entry file |
| **Any LLM without skill support** | Paste `SKILL.md` into system instructions / project instructions and keep the repo available as a local reference |

### Important compatibility notes

- `SKILL.md` now includes portable frontmatter metadata (`name`, `description`, `version`, `tags`, `compatible_with`) so skill loaders can identify it more reliably.
- Some tools do **not** support `<SKILL_ROOT>` automatically. In those environments, replace `<SKILL_ROOT>` with the absolute path to the `folio` folder.
- Some tools scan skills only on startup. If the skill does not appear immediately, restart the client or start a new session.
- If a platform cannot execute skills natively, Folio still works as a **promptable design system + export toolkit**.

### Update behavior

Folio's update system is designed in two layers:

- **Cross-platform core** inside the repo:
  - `manifest.json`
  - `VERSION`
  - `CHANGELOG.md`
  - `scripts/check-update.mjs`
  - `scripts/self-update.mjs`
- **Host trigger layer** supplied by the AI tool:
  - Codex can install the [explicit-invocation hook](INSTALL.md#codex-explicit-invocation-hook) to check when a prompt starts with `/folio` or `$folio`
  - Other hosts run the cached check at the start of each Folio task through `SKILL.md`
  - Hosts without script or network access should skip auto-checking and fall back to manual update

Folio does **not** assume every platform can auto-run scripts at load time.
The `SKILL.md` policy alone does not install a hook. Without the optional Codex hook, the agent must actually run `check-update.mjs` at the start of each Folio task; if it skips the command, no check occurred. An update check never installs an upgrade without user confirmation, and `self-update.mjs` refuses a dirty Git checkout.

When an update is found, Folio should show the **concrete maintained features** from the remote release metadata first, then ask the user whether they want to upgrade.

### Fallback prompt for generic AI tools

If your AI tool has no native skill mechanism, start with:

> "Use the attached Folio skill instructions and repo as a presentation engine. Create an 8-slide deck about [topic], keep it clean and modern, and export HTML first."

### Extra portability files

- `INSTALL.md` — installation matrix, troubleshooting, packaging checklist
- `SKILL.min.md` — small-footprint version for tools with weak or no native skill support
- `manifest.json` / `VERSION` / `CHANGELOG.md` — update metadata and release history

---

## Quick Start

If you do not know where to begin, copy this sentence into Claude:

> **"Use Folio to make an 8-slide presentation about [your topic]. Keep it clean and modern. Export HTML first."**

That is enough for a first run.

If the user already provided the **topic**, the AI should start drafting immediately instead of asking extra setup questions first.

### What happens next

The AI should guide you through only 3 decisions, and it does **not** need to ask all of them before starting the first draft:
1. **Topic** — What is the presentation about?
2. **Style** — Clean / editorial / bold / luxury / dark, or let Folio choose
3. **Output** — Start with **HTML**, then export PPTX / PDF / Figma / IDML if needed

### Easiest first project

Use this path if you want the least friction:

1. Ask for **8 slides**
2. Start with **HTML** output
3. Review the structure and wording
4. Only then export **PPTX** or **PDF** for editing / delivery

In short: **topic first, style second, export last**.

---

## When to Use Folio

| Scenario | Works well | Not for |
|----------|------------|---------|
| Portfolio / Project review | ✅ Magazine-grade layout, no design skills needed | |
| Product launch / Pitch deck | ✅ Fast turnaround, consistent quality | |
| Academic presentation | ✅ Clean, professional, PDF-ready | |
| Figma design → presentation | ✅ C2D high-fidelity import | |
| Content that changes often | ✅ Edit content without touching layout | |
| Highly custom animations | | ❌ Not a frontend framework |
| 50+ page documents | | ❌ Optimized for 6-20 slides |

---

## How It Works

```text
Your request
    ↓
Folio determines: platform → audience → style → interaction level
    ↓
Template selected → content filled → rendered
    ↓
┌─────────┬─────────┬─────────┬─────────┬────────┐
│ HTML    │ PPTX    │ PDF     │ Figma   │ IDML   │
│ Present │ Editable│ Print-  │ Editable│ InDesign│
│ directly│ text    │ ready   │ frames  │ native │
└─────────┴─────────┴─────────┴─────────┴────────┘
```

Output formats designed for further editing: PPTX, Figma, and IDML preserve editable text and structure so you can refine in your preferred tool.

---

## Output Formats

| Format | Description | Best for |
|--------|-------------|----------|
| **HTML** | Browser-ready presentation with keyboard nav & transitions | Quick sharing, online viewing |
| **PPTX** | Fully editable text in PowerPoint / Keynote / Google Slides | Client delivery, team editing |
| **PDF Print** | 3mm bleed + crop marks, print-shop ready | Catalogues, brochures, print |
| **Figma** | Pixel-perfect Frames, editable text and images | Design team handoff |
| **IDML** | InDesign native format, editable text with paragraph/character styles | Print publication, editorial layout |
| **InDesign PDF** | Lightweight PDF with selectable text, native PDF elements (not PNG overlay) | InDesign placement, light preview |

---

## Output Format Details

### InDesign / IDML

Folio supports two InDesign-friendly workflows:

**IDML (InDesign native format)**
```bash
node scripts/export-idml.mjs path/to/index.html
```
- Editable text frames with font/size/color/alignment preserved
- 16 slides auto-built as pages, correct page order
- Paragraph & character styles included
- External image references (`index_images/` folder stays alongside)

**InDesign PDF**
```bash
node scripts/export-indesign.mjs path/to/index.html
```
- Selectable text (not flattened)
- Native PDF image elements (not PNG rasterized)
- Small file size (~1.2MB)
- Can be placed into InDesign as a reference layer

### Wireframing

Before jumping into production, sketch out your slide structure with the **wireframe sheet** — a print-friendly A4 landscape template (16:9 ratio cards) for hand-drawing layout ideas.

Open `templates/wireframe-sheet.html` in your browser, then print or use it as a digital reference:

```
templates/wireframe-sheet.html
```

> Wireframe previews are generated from `templates/wireframe-sheet.html` during local use.

Each card represents a slide with:
- Title / subtitle area
- Content zone (text, image, or mixed)
- Page number
- Notes section

Use it to plan your deck structure before handing off to Folio for production.

---

## 10 Visual Styles

| Style | Vibe | Use case |
|-------|------|----------|
| **Minimal** | Less is more, Apple-like restraint | Product intro, personal site |
| **Editorial** | Magazine cover typography | Content brands, narrative decks |
| **Swiss** | Grid & order, International Typographic Style | Data presentation, corporate |
| **Architectural** | Space, large whitespace | Architecture portfolio, spatial design |
| **Brutalism** | Raw, bold, in-your-face | Creative work, experimental |
| **Glass** | Frosted glass, futuristic | Tech products, Vision Pro style |
| **Dark** | Dark background, luminous accents | Gaming, night mode, data dashboards |
| **Bento** | Ordered module grid | Dashboards, feature panels |
| **Luxury** | Refined, expensive feel | High-end brand, invitations |
| **Cyberpunk** | Neon, cyberpunk aesthetic | Music festival, creative events |

---

## FAQ

### Do I need to know how to code?

No. Just tell the AI what you want. Templates, rendering, and export are automatic.

### Can I edit the content after generation?

| Format | Editable? |
|--------|-----------|
| HTML | Yes — edit text and images directly |
| PPTX | Yes — any text in PowerPoint / Keynote |
| PDF Print | No (print-ready), but re-export anytime |
| Figma | Yes — all text and images in Frames |
| IDML | Yes — fully editable in InDesign with paragraph/character styles |
| InDesign PDF | Yes — selectable text, native PDF elements |

### What doesn't Folio do?

- Not for 50+ page documents (optimized for 6-20 slides)
- Not for complex custom animations
- Not a real-time collaborative editor

---

## For Developers

### Export Scripts

All export scripts live in `scripts/` and follow the `export-*.mjs` naming convention:

| Script | Command | Output |
|--------|---------|--------|
| **HTML** | `open path/to/index.html` | Browser preview with keyboard nav |
| **PPTX** | `node scripts/export-native-pptx.mjs path/to/index.html` | `index.pptx` — editable text |
| **PDF** | `node scripts/export-pdf.mjs path/to/index.html` | `index.pdf` — lightweight, selectable text |
| **PDF Print** | `node scripts/export-print-pdf.mjs path/to/index.html` | `index.print.pdf` — 3mm bleed + crop marks |
| **Figma** | `node scripts/export-figma.mjs path/to/index.html` | Clipboard or plugin JSON (see below) |
| **IDML** | `node scripts/export-idml.mjs path/to/index.html` | `index.idml` — InDesign native format |
| **InDesign PDF** | `node scripts/export-indesign.mjs path/to/index.html` | `index.indesign.pdf` — native PDF elements |
| **Verify** | `node scripts/export-verify.mjs path/to/index.html` | Output validation report |

### Utility Scripts

| Script | Purpose |
|--------|---------|
| `design-decision.mjs` | Interactive CLI for visual style selection |
| `generate-theme.mjs` | Theme code generator (engine → CSS) |
| `layout-mapping.mjs` | Layout mapping engine (PPTX/IDML position calculation) |
| `figma-clipboard.mjs` | Experimental fig-kiwi clipboard encoder |
| `git-push-gh-auth.sh` | Push current branch using `gh` token when plain HTTPS `git push` cannot prompt for credentials |

### Figma Export — Dual Mode

Folio provides two ways to export to Figma: **Code.to.Design** (cloud API, high fidelity) and **Local mode** (built-in Figma plugin, free).

| | Code.to.Design ☁️ | Local Mode 🖥️ |
|--|-------------------|----------------|
| Fidelity | High (server-side HTML/CSS parsing) | Moderate (coordinates + text nodes) |
| API Key | Required (free tier: 10 credits) | Not required |
| Cost | 1 credit/run (~$0.08/run) | Free |
| Workflow | Auto-writes to clipboard → Cmd+V in Figma | Generates JSON → Folio Importer plugin |
| Text | Fully editable | Editable (may need double-click to render) |
| Limitation | Google Fonts only (no system fonts); requires internet | CSS layout not fully preserved; text frames may overlap |

**Mode selection:**
```bash
# Auto (default): C2D if API key found, local otherwise
node scripts/export-figma.mjs path/to/index.html

# Force specific mode
node scripts/export-figma.mjs --mode c2d path/to/index.html
node scripts/export-figma.mjs --mode local path/to/index.html
```

**First run (no API key):** The script will prompt interactively — either open `https://code.to.design` to get a free key, or fall back to local mode.

```bash
# Set your C2D API key
export C2D_API_KEY="your_key"
# or persist in .env
echo 'C2D_API_KEY="your_key"' >> scripts/.env
```

**Local plugin setup (one-time):**
1. Figma menu → **Plugins** → **Development** → **Import plugin from manifest…**
2. Select `scripts/figma-plugin/manifest.json`
3. Run **Folio Importer** → pick the generated `index.figma.json`

### Project layout

```
folio/
├── index.html              ← Master template (16 layouts, 10 styles)
├── SKILL.md                ← AI instructions for agents
├── ROADMAP.md              ← Project roadmap
├── design/                 ← Design system
│   ├── principles.md       ← Design principles quick reference
│   ├── style-guide.md      ← 10 styles: fonts, colors, spacing, motion
│   └── knowledge-base/     ← Gestalt, UX Laws, Accessibility, Info Design
├── engines/                ← Decision engine rules
│   ├── layout-engine.md    ← 16 layout selection & combination rules
│   ├── typography-engine.md← Font system & pairing matrix
│   ├── color-engine.md     ← Color system & 8 theme palettes
│   ├── interaction-engine.md← L0-L4 interaction levels
│   ├── animation-engine.md ← Motion schemes & easing cheatsheet
│   ├── visual-effects-engine.md← Glass, Aurora, Noise, etc.
│   └── export-engine.md    ← Output format selection guide
├── scripts/                ← Export scripts + Figma plugin
│   ├── export-*.mjs        ← All exporters (see table above)
│   ├── figma-plugin/       ← Folio Importer for Figma
│   ├── design-decision.mjs ← Interactive style selector
│   ├── generate-theme.mjs  ← Theme code generator
│   ├── layout-mapping.mjs  ← Layout mapping engine
│   ├── figma-clipboard.mjs ← Experimental clipboard encoder
│   └── .env.example        ← C2D API key template
├── templates/
│   └── wireframe-sheet.html← Wireframe sketch template
├── references/             ← Design references
│   ├── checklist.md        ← Production checklist
│   ├── information-architecture.md
│   ├── presentation-design.md
│   └── wireframing.md
└── README.md               ← This file
```

### Dependencies

```bash
cd scripts
npm install
npx playwright install chromium
```

---

## License

MIT · Copyright (c) 2026 Jorgut

---

<a id="chinese"></a>

# Folio · 设计智能引擎

![GitHub stars](https://img.shields.io/github/stars/Jorgut/folio?style=flat-square)
![License](https://img.shields.io/github/license/Jorgut/folio?style=flat-square)

把主题和素材交给 Folio，先产出杂志式 HTML，再按需导出 PPTX、PDF、Figma 或 IDML。

## 视觉样刊

README 上方直接展示开篇跨页，并可在原页面展开其余四张**PPT 适配版双开页**与三张 **16:9 横版**；它们是实际导出图。[下载可编辑 PPT](demos/distributed-studio/folio-editorial-sample.pptx)、[十页占位样刊 HTML](demos/distributed-studio/index.html)和[线框库预览](reference-layouts/previews/index.html)均可访问。线框总览已更新为 2026-10-08 的 29 个当前版式，并提供五组可在 README 内展开的分类展示图。

1.0.16 进一步校准了参考版式预览：出血、裁切、安全区和内容框各自独立，并检查文字是否越过安全线，或与图片占位、标签、色板发生重叠。新增的[编辑设计样刊](demos/distributed-studio/index.html)把这些原则延伸为一组完整的十页杂志，不只是线框缩略图。正文使用 Lorem Ipsum 占位；设计静物、纺织材质和平面印刷三张图像专为样刊生成，建筑摄影在本地打包并署名。开篇图片铺满上方图片区，下方独立白色页脚容纳图注与页码；双开页页码共用基线、置于外侧底角。[打开完整样刊](demos/distributed-studio/index.html)。

样刊附录另有三张基于现有杂志 wireframe 的**16:9 横向成稿示例**：[专题开篇](demos/distributed-studio/index.html#landscape-opener)、[密排阅读](demos/distributed-studio/index.html#landscape-reading)、[图像证据](demos/distributed-studio/index.html#landscape-evidence)。它们是独立的版式研究，不属于前面十页竖版杂志的连续页。

这是用于展示版式能力的虚拟样刊，不代表已审核的正式内容。三张专题图片为生成图像；署名建筑摄影依据 [Unsplash License](https://unsplash.com/license) 使用。具体用途若涉及可识别的人物、品牌或物业，仍可能需要额外授权。

---

## 平台兼容性

Folio 的打包方式是尽量跨平台的，不绑定某一个 agent 工具。

### 最小兼容契约

只要宿主工具能访问这个目录和下面这些文件，Folio 就能工作：

- `SKILL.md` — 核心指令
- `SKILL.min.md` — 给低上下文 / 仅提示词工具使用的极简版本
- `README.md` — 给人看的说明和安装指引
- `INSTALL.md` — 平台无关的安装与排障说明
- `manifest.json` — 给脚本和宿主读取的版本元数据
- `VERSION` — 本地版本号
- `CHANGELOG.md` — 给人看的更新记录
- `index.html` — 基础模板
- `design/`、`engines/`、`scripts/`、`templates/` — 支撑系统文件

### 各平台建议安装方式

| 平台 | 推荐方式 |
|------|----------|
| **Claude Code** | 放到 `~/.claude/skills/folio/` |
| **OpenCode / OpenCode 兼容工具** | 放到 `~/.config/opencode/skills/folio/` 或你配置的 skills 目录 |
| **Codex / 类 Codex agent** | 把整个目录挂载或复制到它的 skill / prompt 工作区，并确保 `SKILL.md` 作为入口文件可见 |
| **不支持 skill 的通用 AI** | 把 `SKILL.md` 内容粘进 system instructions / project instructions，并让模型能访问这个仓库 |

### 兼容性注意事项

- `SKILL.md` 现在带有可移植的 frontmatter 元数据（`name`、`description`、`version`、`tags`、`compatible_with`），更利于被 skill loader 识别。
- 有些工具不会自动解析 `<SKILL_ROOT>`。这种情况下，请把它替换成 `folio` 目录的绝对路径。
- 有些工具只会在启动时扫描 skills。如果你装好后没立刻看到它，请重启客户端或新开会话。
- 如果某个平台根本不支持原生 skill，Folio 仍然可以作为 **可复制提示词 + 本地设计系统仓库** 来用。

### 更新机制

Folio 的更新系统分成两层：

- **仓库内的跨平台更新核心**：
  - `manifest.json`
  - `VERSION`
  - `CHANGELOG.md`
  - `scripts/check-update.mjs`
  - `scripts/self-update.mjs`
- **宿主工具负责的触发层**：
  - Codex 可以安装[显式调用 hook](INSTALL.md#codex-explicit-invocation-hook)，以 `/folio` 或 `$folio` 开头的消息会立即检查
  - 其他宿主按 `SKILL.md` 在每次 Folio 任务开始时执行缓存版检查
  - 没有脚本权限或网络权限的宿主：跳过自动检查，退化为手动更新

Folio **不会假设所有平台都能在加载 skill 时自动执行脚本**。
`SKILL.md` 中的规则本身不会安装 hook。不安装可选的 Codex hook 时，代理必须在每次 Folio 任务开始时真正运行 `check-update.mjs`；若未运行，就没有发生更新检查。检查不会自动升级；`self-update.mjs` 也会拒绝覆盖有未提交改动的 Git 工作区。

当发现新版本时，Folio 应先展示远端版本维护/新增了哪些具体功能，再把“是否升级”的决定交给用户。

### 给通用 AI 的兜底提示词

如果你的 AI 工具没有原生 skill 机制，可以这样开场：

> "Use the attached Folio skill instructions and repo as a presentation engine. Create an 8-slide deck about [topic], keep it clean and modern, and export HTML first."

### 额外的可移植文件

- `INSTALL.md` — 安装矩阵、排障说明、打包清单
- `SKILL.min.md` — 给原生 skill 支持较弱的平台准备的小体积版本
- `manifest.json` / `VERSION` / `CHANGELOG.md` — 更新元数据与版本记录

---

## 快速开始

如果你现在还不知道该怎么开口，直接把这句话复制给 Claude：

> **"用 Folio 做一个关于 [你的主题] 的 8 页演示，风格干净现代，先导出 HTML。"**

第一次使用，这一句就够了。

如果用户已经给了**主题**，AI 应直接开始起稿，不要先追加一串配置问题。

### 接下来 AI 只需要帮你确认 3 件事

AI 只需要帮你确认 3 件事，但**不需要在起稿前全部问完**：

1. **主题** — 你要讲什么？
2. **风格** — 干净 / 杂志感 / 大胆 / 高级 / 深色，或者直接让 Folio 代选
3. **输出** — 先出 **HTML**，确认结构后再导出 PPTX / PDF / Figma / IDML

### 最容易成功的第一条路径

如果你只想先做出第一版，不想一开始就做太多决定：

1. 先做 **8 页**
2. 先导出 **HTML**
3. 先看结构和文案顺不顺
4. 确认后再导出 **PPTX** 或 **PDF** 去编辑 / 交付

记住一条就行：**先定主题，再定风格，最后定导出格式。**

---

## 什么时候用 Folio

| 场景 | 适合 | 不适合 |
|------|------|--------|
| 作品集 / 项目汇报 | ✅ 杂志级排版，自带设计感 | |
| 产品发布会 / Pitch Deck | ✅ 快速出稿，无需设计团队 | |
| 学术汇报 / 论文展示 | ✅ 干净、专业、可输出 PDF | |
| Figma 设计稿转演示 | ✅ C2D 高保真还原 | |
| 需要反复修改内容 | ✅ 改内容不改排版 | |
| 高度定制动画 / 交互 | | ❌ 交互有限，非前端项目 |
| 超长文档（50+ 页） | | ❌ 专为 6-20 页设计 |

---

## 工作流

```text
你描述需求
    ↓
Folio 确定：平台 → 受众 → 风格 → 交互层级
    ↓
套用模板 → 填充内容 → 渲染
    ↓
┌─────────┬─────────┬─────────┬─────────┬────────┐
│ HTML    │ PPTX    │ PDF     │ Figma   │ IDML   │
│ 可直接  │ 可编辑   │ 出版级   │ 可编辑   │ InDesign│
│ 演示    │ 文字     │ 3mm出血 │ Frame   │ 原生格式│
└─────────┴─────────┴─────────┴─────────┴────────┘
```

PPTX、Figma、IDML 等格式保持文字和结构的可编辑性，导出后可在熟悉工具中进一步精修。

---

## 输出格式

| 格式 | 一句话 | 适合谁 |
|------|--------|--------|
| **HTML** | 浏览器打开就能演示，有快捷键和过渡动效 | 快速分享、线上展示 |
| **PPTX** | 文字完全可编辑，PowerPoint / Keynote / Google Slides 随便改 | 客户交付、团队协作 |
| **PDF 印刷** | 3mm 出血 + 裁切标记，直接发印刷厂 | 画册、手册、印刷品 |
| **Figma** | 像素级还原到 Frame，继续精修 | 设计团队接力 |
| **IDML** | InDesign 原生格式，文字/样式完整保留 | 出版印刷、编辑排版 |
| **InDesign PDF** | 轻量 PDF，文字可选，原生 PDF 元素（非 PNG 叠加） | InDesign 置入、轻量预览 |

---

## 输出格式详情

### InDesign / IDML

Folio 提供两种 InDesign 友好格式：

**IDML（首选，原生导入）**
```bash
node scripts/export-idml.mjs 项目路径/index.html
```
- 文字进独立文本框，完全可编辑
- 字体/字号/颜色/对齐保留
- 16 页自动建好，页码正确排序
- 支持段落样式和字符样式
- 图片为外部引用（`index_images/` 文件夹需保持同目录）

**InDesign PDF（备选，置入式）**
```bash
node scripts/export-indesign.mjs 项目路径/index.html
```
- 文字可选（非图片化）
- 图片为原生 PDF 元素（非 PNG 覆盖）
- 文件小（约 1.2MB）
- 可拖入 InDesign 作为参考层

### 线框图速写

在进入正式制作之前，先用 **线框图模板** 规划每页 slide 的结构。这是一个 A4 横版可打印页面，包含 16:9 比例的卡片，适合手绘草图或数字标注。

在浏览器打开即可使用：

```
templates/wireframe-sheet.html
```

> 线框图预览可直接打开 `templates/wireframe-sheet.html` 查看。

每张卡片包含：
- 标题 / 副标题区域
- 内容区（文字、图片、或混合）
- 页码
- 备注栏

先画线框图确定结构，再交给 Folio 制作成品。

---

## 10 种视觉风格

| 风格 | 一句话 | 适合 |
|------|--------|------|
| **Minimal** | 少即是多，Apple 式克制 | 产品介绍、个人网站 |
| **Editorial** | 杂志封面级排版 | 内容品牌、叙事型演示 |
| **Swiss** | 网格与秩序，瑞士国际主义 | 数据展示、企业报告 |
| **Architectural** | 空间感、大面积留白 | 建筑作品集、空间设计 |
| **Brutalism** | 粗犷、有冲击力 | 创意作品、实验性项目 |
| **Glass** | 毛玻璃层次、未来感 | 科技产品、Vision Pro 风格 |
| **Dark** | 暗底发光，强调视觉深度 | 游戏、夜间场景、数据大屏 |
| **Bento** | 井然有序的模块网格 | Dashboard、功能面板 |
| **Luxury** | 精致、昂贵感 | 高端品牌、邀请函 |
| **Cyberpunk** | 霓虹、赛博朋克 | 音乐节、创意活动 |

---

## 常见问题

### 我不会写代码，能用吗？

可以。你只需要跟 AI 说你要做什么。模板、渲染、导出都是自动的。

### 内容后期还能改吗？

| 格式 | 能不能改 |
|------|---------|
| HTML | 可以直接改文字和图片 |
| PPTX | PowerPoint / Keynote 里任意编辑文字 |
| PDF 印刷 | 印刷品，改不了（但可以重新导出） |
| Figma | Frame 里所有文字和图片都可编辑 |
| IDML | InDesign 里完全可编辑，带段落/字符样式 |
| InDesign PDF | 文字可选，原生 PDF 元素 |

### 不支持什么？

- 不支持 50+ 页的文档（排版引擎为 6-20 页优化）
- 不支持复杂自定义动画（不是前端框架）
- 不支持实时协作编辑（单次生成）

---

## 给开发者 / 高级使用者

### 导出脚本一览

所有导出脚本在 `scripts/` 目录下，命名规则 `export-*.mjs`：

| 脚本 | 命令 | 输出 |
|------|------|------|
| **HTML** | `open 项目路径/index.html` | 浏览器预览，键盘导航 |
| **PPTX** | `node scripts/export-native-pptx.mjs 项目路径/index.html` | `index.pptx` — 文字可编辑 |
| **PDF** | `node scripts/export-pdf.mjs 项目路径/index.html` | `index.pdf` — 轻量，文字可选 |
| **PDF 印刷** | `node scripts/export-print-pdf.mjs 项目路径/index.html` | `index.print.pdf` — 3mm 出血 + 裁切标记 |
| **Figma** | `node scripts/export-figma.mjs 项目路径/index.html` | 剪贴板粘贴 或 插件 JSON |
| **IDML** | `node scripts/export-idml.mjs 项目路径/index.html` | `index.idml` — InDesign 原生格式 |
| **InDesign PDF** | `node scripts/export-indesign.mjs 项目路径/index.html` | `index.indesign.pdf` — 原生 PDF 元素 |
| **验证** | `node scripts/export-verify.mjs 项目路径/index.html` | 输出质量验证报告 |

### 工具脚本

| 脚本 | 用途 |
|------|------|
| `design-decision.mjs` | 交互式风格选择 CLI |
| `generate-theme.mjs` | 主题代码生成器（引擎 → CSS） |
| `layout-mapping.mjs` | 布局映射引擎（PPTX/IDML 坐标计算） |
| `figma-clipboard.mjs` | 实验性 fig-kiwi 剪贴板编码器 |
| `git-push-gh-auth.sh` | 当普通 HTTPS `git push` 无法弹凭证时，用 `gh` token 推送当前分支 |

### Figma 导出（双模式）

Folio 提供两种 Figma 导出方式：**Code.to.Design**（云 API，高 fidelity）和 **本地模式**（内置 Figma 插件，免费）。

| | Code.to.Design ☁️ | 本地模式 🖥️ |
|--|-------------------|-------------|
| Fidelity | 高（服务端解析 HTML/CSS） | 一般（精确坐标 + 文字节点） |
| API Key | ✅ 需要（免费 10 credits） | ❌ 不需要 |
| 成本 | 1 credit / 次（约 $0.08/次） | 免费 |
| 操作 | 自动写入剪贴板 → Figma 粘贴 | 生成 JSON → Figma 插件导入 |
| 文字 | 完全可编辑 | 可编辑（可能需要双击渲染） |
| 限制 | 仅 Google Fonts；需联网 | CSS 排版不完全还原；文字框可能重叠 |

**模式选择：**
```bash
# 自动（默认）：有 API Key 用 C2D，否则本地
node scripts/export-figma.mjs 项目路径/index.html

# 强制指定模式
node scripts/export-figma.mjs --mode c2d 项目路径/index.html
node scripts/export-figma.mjs --mode local 项目路径/index.html
```

**首次运行（无 API Key）：** 脚本会进入交互引导 —— 打开 `https://code.to.design` 获取免费 key，或选择本地模式。

```bash
# 设置 C2D API Key
export C2D_API_KEY="你的key"
# 或写入 .env 文件
echo 'C2D_API_KEY="你的key"' >> scripts/.env
```

**本地插件安装（只需一次）：**
1. Figma 左上角菜单 → **Plugins** → **Development** → **Import plugin from manifest…**
2. 选择 `scripts/figma-plugin/manifest.json`
3. 运行 **Folio Importer** → 选择生成的 `index.figma.json`

### 项目结构

```
folio/
├── index.html              ← 主模板（16 种布局，10 种风格）
├── SKILL.md                ← AI 指引
├── ROADMAP.md              ← 项目路线图
├── design/                 ← 设计系统
│   ├── principles.md       ← 设计原则速查
│   ├── style-guide.md      ← 10 种风格：字体/配色/间距/动效
│   └── knowledge-base/     ← Gestalt / UX Laws / Accessibility / 信息设计
├── engines/                ← 决策引擎规则
│   ├── layout-engine.md    ← 16 种布局选择与组合规则
│   ├── typography-engine.md← 字体系统与配对矩阵
│   ├── color-engine.md     ← 配色系统与 8 主题色板
│   ├── interaction-engine.md← L0-L4 交互层级
│   ├── animation-engine.md ← 动效方案与缓动速查
│   ├── visual-effects-engine.md← 视觉特效（Glass/Aurora/Noise...）
│   └── export-engine.md    ← 输出格式选择指南
├── scripts/                ← 导出脚本 + Figma 插件
│   ├── export-*.mjs        ← 所有导出器（见上表）
│   ├── figma-plugin/       ← Folio Importer 插件
│   ├── design-decision.mjs ← 交互式风格选择 CLI
│   ├── generate-theme.mjs  ← 主题代码生成器
│   ├── layout-mapping.mjs  ← 布局映射引擎
│   ├── figma-clipboard.mjs ← 实验性剪贴板编码器
│   └── .env.example        ← C2D API Key 配置模板
├── templates/
│   └── wireframe-sheet.html← 线框图速写模板
├── references/             ← 设计参考资料
│   ├── checklist.md        ← 上流程检查清单
│   ├── information-architecture.md
│   ├── presentation-design.md
│   └── wireframing.md
└── README.md               ← 本文件
```

### 依赖安装

```bash
cd scripts
npm install
npx playwright install chromium
```

---

## 许可证

MIT · Copyright (c) 2026 Jorgut
