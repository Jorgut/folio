---
name: folio-min
description: Minimal Folio skill for platforms that do not support full skill loading or large instruction files.
version: 1.0.9
tags:
  - presentation
  - slides
  - minimal
compatible_with:
  - claude-code
  - opencode
  - codex
  - generic-llm
---

# Folio · Minimal Skill

Use this file when the host tool cannot load the full `SKILL.md` or when prompt budget is limited.

## Role

Folio is a magazine-style presentation engine.

Goal: turn structured content into a clean, editable deck, starting with HTML and optionally exporting to PPTX, PDF, Figma, or IDML.

## Default behavior

- Start with **8 slides** unless the user says otherwise
- Default style: **Minimal**
- Default theme: `theme-default`
- Default output: **HTML**
- Optimize for clarity first, polish second
- If the user already gave a **topic**, do not ask extra setup questions before starting the first draft

## Working rules

1. Decide the **topic** first
2. Decide the **style** second
3. Decide the **export format** last
4. Start with `index.html`
5. Use asymmetrical editorial layouts when possible
6. Keep one theme across the whole deck
7. Avoid random animation or decorative clutter
8. For portfolio or spatial decks, give each page a clear role: opener, proof spread, gallery board, detail page, or closing
9. When mixing tall and wide images on the same page, align them by top edge, bottom edge, or shared baseline before deciding the final crop
10. Default portfolio images to square corners (`border-radius: 0`) unless the user explicitly asks for rounded images
11. Keep image gaps intentional: tight 12-14px for portfolio image groups, 16-18px for normal layouts, 24-32px only for large editorial separation
12. When fixing one alignment issue, scan every project page for matching edge alignment, radius consistency, and gap consistency
13. For architecture/interior portfolios, do not start layout until project/image manifest, ratio classes, crop risks, and image ownership are known
14. Define a layout contract before designing pages: page size, margins, image frame, gap, radius, text-image distance, footer safe area, opener frame, continuation frame, and PDF safe area
15. Do geometry verification before delivery: figure left/right/top/bottom, gap, radius, overflow, footer safety, HTML/PDF consistency
16. Hard stop if image ownership is unknown, manifest counts do not match, project-page edges do not align, radius is inconsistent, or PDF and HTML diverge visually
17. For portfolio work, optionally use the maintained reference board `https://www.pinterest.com/jorgutyn/visualizationlayouts-%D0%BC%D0%B0%D0%BA%D0%B5%D1%82%D1%8B/layout/`; extract grid, hierarchy, gap, alignment, and whitespace patterns, but do not copy source imagery or template details
18. Before designing architecture/interior portfolios, check `reference-layouts/taxonomy.md`, `reference-layouts/templates.md`, `reference-layouts/catalog.md`, and `reference-layouts/previews/index.html`; choose 1-3 wireframe templates as structural starting points
19. Every page must declare a bleed mode before layout: `no-bleed`, `soft-bleed`, `edge-bleed`, `full-bleed`, or `print-bleed`; keep text, captions, footers, and page numbers inside the safe line unless there is a documented exception

## Minimum workflow

1. Create or copy `index.html`
2. Fill slides with structured content
3. Keep layout clean and magazine-like
4. Review structure and wording in HTML first
5. Export to other formats only after the HTML structure works
6. If only the topic is provided, draft first and ask follow-up questions later only if execution is blocked

## If file access is available

Use these repo files as references:

- `SKILL.md` → full operating manual
- `design/style-guide.md` → style choices
- `engines/layout-engine.md` → layout selection
- `templates/` → wireframe and planning aids

## If commands are available

Replace `<SKILL_ROOT>` with the real folder path if needed.

Examples:

```bash
cp <SKILL_ROOT>/index.html ./index.html
node <SKILL_ROOT>/scripts/export-native-pptx.mjs index.html
node <SKILL_ROOT>/scripts/export-print-pdf.mjs index.html
node <SKILL_ROOT>/scripts/export-figma.mjs index.html
```

## First prompt to use

> Use Folio to make an 8-slide presentation about [topic]. Keep it clean and modern. Export HTML first.
