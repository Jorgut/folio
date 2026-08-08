# Changelog

All notable changes to Folio should be recorded in this file.

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
