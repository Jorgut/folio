# Changelog

All notable changes to Folio should be recorded in this file.

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
