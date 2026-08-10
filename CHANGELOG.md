# Changelog

All notable changes to Folio should be recorded in this file.

## 1.0.9 - 2026-08-10

- Added a formal bleed/trim/safe/content line system to the Reference Layout preview sheet
- Added five required bleed modes: `no-bleed`, `soft-bleed`, `edge-bleed`, `full-bleed`, and `print-bleed`
- Added per-template recommended bleed modes and visible `bleed_mode` labels in `reference-layouts/previews/index.html`
- Updated `SKILL.md`, `SKILL.min.md`, `reference-layouts/taxonomy.md`, `reference-layouts/templates.md`, and `engines/layout-engine.md` so bleed behavior is part of the layout contract

## 1.0.8 - 2026-08-10

- Added `reference-layouts/catalog.md`, a full observed catalog of all 43 pins from the maintained Pinterest layout board
- Expanded the Reference Layout Library from 8 to 13 template families
- Added new template families: `layout-system-sheet`, `deck-contact-sheet`, `vertical-portfolio-stack`, `brand-guideline-board`, and `campaign-deliverables-board`
- Updated `previews/index.html` with the new full-template preview set
- Connected the full catalog to `SKILL.md`, `SKILL.min.md`, and `engines/layout-engine.md`

## 1.0.7 - 2026-08-10

- Added the initial Reference Layout Library under `reference-layouts/`
- Added `taxonomy.md` for classifying Pinterest/reference-board layouts into reusable structural types
- Added `templates.md` with 8 reusable portfolio wireframe families: hero opener, 2-column board, moodboard grid, caption rail gallery, split proof spread, strip narrative, dense presentation board, and controlled masonry gallery
- Added `previews/index.html`, a gray wireframe preview sheet for quickly reviewing the visual layout system in a browser
- Connected the template library to `SKILL.md`, `SKILL.min.md`, and `engines/layout-engine.md`

## 1.0.6 - 2026-08-10

- Added Reference Board Intake for the maintained Pinterest layout board: https://www.pinterest.com/jorgutyn/visualizationlayouts-%D0%BC%D0%B0%D0%BA%D0%B5%D1%82%D1%8B/layout/
- Added rules for extracting layout structure from external references: grid pattern, image hierarchy, spacing, alignment, whitespace, and page-type fit
- Clarified that external references must be translated into layout contracts and page planning, not copied as images, text, brand assets, or template details
- Added fallback guidance for Pinterest access, login, or incomplete loading cases

## 1.0.5 - 2026-08-09

- Added Architecture / Interior Portfolio QA Workflow covering manifest intake, layout contract, project page planning, ratio solving, global audit, visual regression reporting, and hard-stop conditions
- Made project/image manifest completion a required gate before portfolio layout work starts
- Added geometry verification requirements for figure bounding boxes, gaps, radii, footer safety, overflow, and HTML/PDF consistency
- Clarified that user-reported page issues must trigger whole-book scanning of the same problem class

## 1.0.4 - 2026-08-08

- Defaulted portfolio image guidance to square corners unless the user explicitly asks for rounded images
- Added image gap scale guidance: tight 12-14px, standard 16-18px, wide 24-32px
- Added cross-page project image-frame rules so opener and continuation pages align shared edges
- Added whole-deck audit guidance so one reported alignment issue triggers a scan across all project pages

## 1.0.3 - 2026-08-08

- Fixed `export-pdf.mjs` so the lightweight PDF output now paginates correctly as 16 pages
- Removed README and handoff references to screenshot assets that are not checked into this branch

## 1.0.2 - 2026-08-08

- Added explicit page-type guidance for portfolio and spatial proposal decks
- Added mixed-ratio image alignment rules so image groups must intentionally find edge or baseline alignment
- Clarified continuation-page requirements so follow-up pages always carry context

## 1.0.1 - 2026-06-30

- Update checks now show user-facing feature highlights before asking whether to upgrade
- Upgrade flow remains user-confirmed; no automatic silent update behavior
- Added `scripts/git-push-gh-auth.sh` for HTTPS GitHub push in non-interactive environments

## 1.0.0 - 2026-06-28

- Added cross-platform skill metadata and install guidance
- Added `SKILL.min.md` for prompt-only and low-context hosts
- Added `manifest.json` and `VERSION` as machine-readable release metadata
- Added update core scripts:
  - `scripts/check-update.mjs`
  - `scripts/self-update.mjs`
- Documented safe update behavior: check automatically where hosts allow it, otherwise fall back to first-use or manual upgrade
