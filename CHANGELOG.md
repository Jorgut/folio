# Changelog

All notable changes to Folio should be recorded in this file.

## 1.0.0 - 2026-06-28

- Added cross-platform skill metadata and install guidance
- Added `SKILL.min.md` for prompt-only and low-context hosts
- Added `manifest.json` and `VERSION` as machine-readable release metadata
- Added update core scripts:
  - `scripts/check-update.mjs`
  - `scripts/self-update.mjs`
- Documented safe update behavior: check automatically where hosts allow it, otherwise fall back to first-use or manual upgrade
