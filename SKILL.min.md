---
name: folio-min
description: Compact content-led Folio workflow for editorial pages, portfolios and presentations.
metadata:
  version: "1.0.17"
---

# Folio / Compact Entrypoint

Use when prompt budget is limited. The normal entrypoint is SKILL.md.

1. Read supplied articles/copy and inspect images first. Identify complete-content requirements, page format, reading mode, language/direction, image roles, crop restrictions, credits and requested outputs. Do not force supplied material into eight slides. For a topic-only request without length constraints, eight is a provisional starting point only.
2. Define page jobs and map source blocks to pages. Compare a small relevant set of local layouts. Use `references/content-layout-selection.md` when available; do not load the whole catalogue or browse external inspiration by default.
3. Choose reuse, adaptation or original composition. Reject candidates violating hard constraints. When none fits, design a project-local original layout from the content, rather than removing paragraphs, stretching imagery or claiming an unsuitable nearest match is best. Do not automatically add project experiments to the public library.
4. Use one geometry source for content and guides: canvas, safe/content frames, gutter-aware columns or explicit image partition, captions, footer and overflow/continuation rules. Choose style afterward. Symmetric comparisons and repeated reading pages are legitimate; no mandatory asymmetry, centered title, layout rotation or title/body ratio.
5. Produce the formats the user requested. HTML is the default only when unspecified. Native PPTX/PDF need not wait for an HTML export. Use continuous paragraph frames for editable decks; picture fill alone can distort different-ratio replacements, so define a proportional crop workflow and test it in the target app.
6. Reuse accepted project assets and rules. Check changed pages and representative shared-layout regressions. Final delivery requires content coverage, geometry/text fit, real rendered crop/overlap/footer review and separate status for each format. Static checks are not browser/target-app acceptance. Do not hide overflow, silently delete content or endlessly shrink fonts.
7. Run `node <SKILL_ROOT>/scripts/check-update.mjs` once at task entry unless a hook already did. Success cache is 30 minutes; failure backoff is 5 minutes. Known offline: `--offline`, remote status unknown. Explicit retry: `--refresh`. No automatic upgrade.
8. Verify existing output without hidden regeneration: `export-verify.mjs INPUT --html-only`, or `--pptx EXISTING` for an existing PPTX. `--export` explicitly regenerates. Browser-dependent tools remain subject to host restrictions; do not retry or bypass unchanged policy failures.
9. Read only relevant detail: `reference-layouts/templates.md`, `engines/layout-engine.md`, `design/style-guide.md`, or the appropriate section in `references/authoring-workflows.md`. External reference boards are optional. Measure intake/matching/authoring/render/export/target-app stages when investigating slow generation; do not promise universal turnaround times.
10. Preserve source files, known limitations and previous deliverables. No publication, GitHub push, private upload or overwrite is implied by authoring.

Executable helpers: `scripts/layout-selection.mjs BRIEF.json` shortlists ten planning profiles (not guaranteed fit); `scripts/profile-stages.mjs PLAN.json NEW-REPORT.json` measures inspected, authorized command stages. Input examples and limitations: `references/content-layout-selection.md`.
