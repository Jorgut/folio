<p align="center">
  <a href="#english">🇬🇧 English</a> · <a href="#chinese">🇨🇳 中文</a>
</p>

---

<a id="english"></a>

# Folio · Design Intelligence Engine

![GitHub stars](https://img.shields.io/github/stars/Jorgut/folio?style=flat-square)
![License](https://img.shields.io/github/license/Jorgut/folio?style=flat-square)
![Skill](https://img.shields.io/badge/Skill-Design%20Intelligence%20Engine-111111?style=flat-square)
![HTML](https://img.shields.io/badge/HTML-Deck-0A7CFF?style=flat-square)
![PPTX](https://img.shields.io/badge/PPTX-Editable-2EA44F?style=flat-square)
![PDF](https://img.shields.io/badge/PDF-Print%20Ready-DC143C?style=flat-square)
![Figma](https://img.shields.io/badge/Figma-Pixel%20Perfect-A259FF?style=flat-square)
![Claude Code](https://img.shields.io/badge/Claude%20Code-Compatible-6B5B95?style=flat-square)
![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-222222?style=flat-square)
![Open Code](https://img.shields.io/badge/Open%20Code-Compatible-111111?style=flat-square)
![Codex](https://img.shields.io/badge/Codex-Compatible-222222?style=flat-square)

> Magazine-style presentation engine. Structured content → template-driven layout → multi-format export.

```text
You describe what you need → Folio determines style & structure → renders & exports → you get the deliverable
```

Single source, multiple outputs: **HTML Slides / PPTX / PDF / Figma**. No manual layout work.

---

## Quick Start

Open Claude (or any AI with this Skill loaded) and say:

> **"Use Folio to make a presentation about [your topic], export as HTML."**

The AI will walk through:
1. **Content** — How many slides? What goes on each page? Any images?
2. **Style** — Pick from 10 visual styles, or describe the feeling for a recommendation
3. **Output** — HTML / PPTX / PDF / Figma

That's it. You get your deck.

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
┌─────────┬─────────┬─────────┬─────────┐
│ HTML    │ PPTX    │ PDF     │ Figma   │
│ Present │ Editable│ Print-  │ C2D     │
│ directly│ text    │ ready   │ import  │
└─────────┴─────────┴─────────┴─────────┘
```

Every step is AI-guided. No config files to touch.

---

## Output Formats

| Format | Description | Best for |
|--------|-------------|----------|
| **HTML** | Browser-ready presentation with keyboard nav & transitions | Quick sharing, online viewing |
| **PPTX** | Fully editable text in PowerPoint / Keynote / Google Slides | Client delivery, team editing |
| **PDF Print** | 3mm bleed + crop marks, print-shop ready | Catalogues, brochures, print |
| **Figma** | Pixel-perfect Frames, editable text and images | Design team handoff |

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

### What doesn't Folio do?

- Not for 50+ page documents (optimized for 6-20 slides)
- Not for complex custom animations
- Not a real-time collaborative editor

---

## For Developers

### Direct CLI usage

```bash
cd scripts && npm install

# Preview
open path/to/project/index.html

# Export
node export-figma.mjs path/to/project/index.html
node export-native-pptx.mjs path/to/project/index.html
```

All export scripts: `scripts/export-*.mjs`

### Project layout

```
folio/
├── index.html          ← Master template (16 layouts)
├── SKILL.md            ← AI instructions
├── design/             ← Design system docs
├── engines/            ← Decision engine rules
├── scripts/            ← Export scripts + Figma plugin
└── references/         ← Design references
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
![Skill](https://img.shields.io/badge/Skill-%E8%AE%BE%E8%AE%A1%E6%99%BA%E8%83%BD%E5%BC%95%E6%93%8E-111111?style=flat-square)
![HTML](https://img.shields.io/badge/HTML-%E6%BC%94%E7%A4%BA-0A7CFF?style=flat-square)
![PPTX](https://img.shields.io/badge/PPTX-%E5%8F%AF%E7%BC%96%E8%BE%91-2EA44F?style=flat-square)
![PDF](https://img.shields.io/badge/PDF-%E5%8D%B0%E5%88%B7%E7%BA%A7-DC143C?style=flat-square)
![Figma](https://img.shields.io/badge/Figma-%E5%83%8F%E7%B4%A0%E7%BA%A7%E8%BF%98%E5%8E%9F-A259FF?style=flat-square)
![Claude Code](https://img.shields.io/badge/Claude%20Code-%E5%85%BC%E5%AE%B9-6B5B95?style=flat-square)
![OpenClaw](https://img.shields.io/badge/OpenClaw-%E5%85%BC%E5%AE%B9-222222?style=flat-square)
![Open Code](https://img.shields.io/badge/Open%20Code-%E5%85%BC%E5%AE%B9-111111?style=flat-square)
![Codex](https://img.shields.io/badge/Codex-%E5%85%BC%E5%AE%B9-222222?style=flat-square)

> 杂志级演示引擎。结构化内容 → 模板驱动排版 → 多格式导出。

```text
你说要做个什么 → Folio 确定风格和结构 → 渲染并导出 → 你拿到成品
```

一次输出：**HTML 演示 / PPTX / PDF / Figma**。不需要手动排版。

---

## 快速开始

打开 Claude（或任何接入此 Skill 的 AI），说：

> **"用 Folio 做一个关于 [你的主题] 的演示，导出 HTML。"**

AI 会依次确认：
1. **内容** — 几张 slide？每页写什么？有图吗？
2. **风格** — 从 10 套风格中选一个（或你描述感觉，AI 推荐）
3. **导出格式** — HTML / PPTX / PDF / Figma

然后你拿到成品。

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
┌─────────┬─────────┬─────────┬─────────┐
│ HTML    │ PPTX    │ PDF     │ Figma   │
│ 可直接  │ 文字可   │ 出版级   │ C2D 高  │
│ 演示    │ 编辑     │ 3mm出血 │ 保真导入 │
└─────────┴─────────┴─────────┴─────────┘
```

每个环节由 AI 引导，无需手动配置。

---

## 输出格式

| 格式 | 一句话 | 适合谁 |
|------|--------|--------|
| **HTML** | 浏览器打开就能演示，有快捷键和过渡动效 | 快速分享、线上展示 |
| **PPTX** | 文字完全可编辑，PowerPoint / Keynote / Google Slides 随便改 | 客户交付、团队协作 |
| **PDF 印刷** | 3mm 出血 + 裁切标记，直接发印刷厂 | 画册、手册、印刷品 |
| **Figma** | 像素级还原到 Frame，继续精修 | 设计团队接力 |

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

### 不支持什么？

- 不支持 50+ 页的文档（排版引擎为 6-20 页优化）
- 不支持复杂自定义动画（不是前端框架）
- 不支持实时协作编辑（单次生成）

---

## 给开发者 / 高级使用者

### 直接运行

```bash
cd scripts && npm install

# 预览
open 项目路径/index.html

# 导出
node export-figma.mjs 项目路径/index.html
node export-native-pptx.mjs 项目路径/index.html
```

所有导出脚本：`scripts/export-*.mjs`

### 项目结构

```
folio/
├── index.html          ← 主模板（16 种布局）
├── SKILL.md            ← AI 指引
├── design/             ← 设计系统文档
├── engines/            ← 决策引擎规则
├── scripts/            ← 导出脚本 + Figma 插件
└── references/         ← 设计参考
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
