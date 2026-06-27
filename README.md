> 🌏 **中文版: [README.zh-CN.md](./README.zh-CN.md)**

# Folio · Design Intelligence Engine

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
