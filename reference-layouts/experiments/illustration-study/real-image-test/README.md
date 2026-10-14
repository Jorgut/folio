# Real-image layout test / 2026-10-13

Five composed pages test three independently sourced, non-AI images. The original wireframes and native files remain unchanged. Open index.html for the rendered gallery and sources.html for attribution links.

- Blue Flower: transparent-background photograph, CC0. The original uploader altered its color. Actual alpha channel verified (0..255). Deliberately reused on three pages to compare the same subject across layouts.
- Arum italicum: 1823 botanical plate attributed on Commons to Samuel Curtis. Public Domain Mark. Full-height 4:5 frame (576x720), proportional cover crop. Earlier contained version preserved in archive-before-full-height.
- Bird and Wisteria: Utagawa Hiroshige, ca. 1835, The Met, Public Domain. Full-height 6:5 frame (864x720), using source crop x=30..655, y=860..1380.8333 of the 685x1954 scan. Side paper borders are excluded without modifying the source asset. Footer remains in the text rail, not across the image.

Sources, dimensions, licenses, notes and SHA-256 checksums are in image-manifest.json. Original assets are preserved locally. The public release contains the checked five page PNGs and gallery, not the source scans, intermediate SVGs or local build scripts. The supplied reference illustration is not reused.

Five page PNGs individually reviewed. qa.py measures image-region nonblank pixels, text margins and sideways footer clearance. The document renderer ignored bitmap references nested inside SVG; render.mjs therefore places source bitmaps as separate image layers. HTML shows the checked page PNGs, not live editable text. Browser gallery behavior, native-format real-image exports, print resolution and publication are not validated by this test. This is a focused three-source test, not proof of all image cases.
