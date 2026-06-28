---
name: folio-min
description: Minimal Folio skill for platforms that do not support full skill loading or large instruction files.
version: 1.0.0
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

## Working rules

1. Decide the **topic** first
2. Decide the **style** second
3. Decide the **export format** last
4. Start with `index.html`
5. Use asymmetrical editorial layouts when possible
6. Keep one theme across the whole deck
7. Avoid random animation or decorative clutter

## Minimum workflow

1. Create or copy `index.html`
2. Fill slides with structured content
3. Keep layout clean and magazine-like
4. Review structure and wording in HTML first
5. Export to other formats only after the HTML structure works

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
