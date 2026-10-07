---
name: folio-min
description: Minimal Folio skill for platforms that do not support full skill loading or large instruction files.
version: 1.0.17
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

Before every Folio task, run `node <SKILL_ROOT>/scripts/check-update.mjs` as the first action (30-minute network cache). If it finds a newer version, show the release highlights and ask whether to update; never run `self-update.mjs` without confirmation. If the check cannot run, say so and continue. A skill file does not install a host hook by itself.

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
18. Folio layouts are domain-neutral: follow the user's brief for subject matter, imagery, and vocabulary; do not default to architecture because of the reference library. For any design field, choose 1-3 structural wireframes from `reference-layouts/taxonomy.md`, `reference-layouts/templates.md`, `reference-layouts/catalog.md`, and `reference-layouts/previews/index.html`.
19. Every page must declare a bleed mode before layout: `no-bleed`, `soft-bleed`, `edge-bleed`, `full-bleed`, or `print-bleed`; keep text, captions, footers, and page numbers inside the safe line unless there is a documented exception
20. Before delivery, run text layout QA on dense, table, bilingual, or long-deck slides: check clipping, overlap, shrink-to-fit, long CJK/Latin lines, footer safe area, and HTML/PPTX/PDF consistency
21. For continuous articles or studio viewpoints, consider the `editorial-longform-feature` portrait-page family: combine opener, image-break, and modular-rail variants; pair languages only when requested, preserve recurring folios, and shorten or split copy instead of shrinking body text. Across facing pages, align both page numbers on one shared bottom baseline at the outer bottom corners; keep page numbers out of running heads. See `reference-layouts/templates.md` and `reference-layouts/previews/index.html`.
22. For magazine-style investigative features, consider `magazine-investigative-feature`: combine thesis opener, dense multi-column reading, pull statements, and image-evidence spreads. Use Lorem Ipsum only to test placeholder text flow; use neutral placeholders for headlines, quotes, and captions, and replace all filler before delivery. Keep live text and folios out of the center gutter and inside the safe frame; verify dense columns at final reading size.
22a. Separate source-image ratio from page ratio. Use `portrait-social-feature` for a 4:5 image-led article with a fixed 16:9 image field: crop 3:2, 4:3, or square sources around the subject while preserving body copy. For a taller digital page, reflow comparable copy into `portrait-adaptive-article-3x4` (two columns). For an image-first print page, use `portrait-image-led-a4` (running head, image/caption, three columns, folio). If a square image must remain uncropped, use `portrait-image-cover-pair`: cover plus complete article continuation, not a gradually shortened article. Keep the title-led `portrait-magazine-essay` distinct. Lorem ipsum is for wireframe density only; verify final copy, crop, legibility, overflow, and footer safety at delivered size.
23. Before publishing changes to `reference-layouts/previews/index.html`, render at 1600/1000/700px; verify every module against safe/content boundaries, image-text overlap, pseudo-element labels, tiny nested cells, and text clipping. Inspect full-page and zoomed screenshots; automated geometry checks do not replace visual review.
24. Treat wireframe guides and gray rules as construction aids, not final artwork. Keep a visible line only when it serves a clear grouping, navigation, or expressive purpose. Give cross-column highlights their own span and typographic scale, not a cramped body-column slot.
25. Choose one image treatment per page: full bleed, edge bleed, or image plus a separate caption/folio footer. Fill intended bleed areas by cropping around the subject; do not leave accidental sidebars from `contain`. On facing pages align folios from one shared baseline. Label standalone landscape studies as an appendix, separate from the story's page sequence.
26. Review rendered desktop, narrow-screen, and print output page by page for crop, clipping, image-text overlap, footer alignment, and leftover guides. Static checks and AI-generated concept images do not prove the delivered layout. State explicitly when rendered QA was unavailable.

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
