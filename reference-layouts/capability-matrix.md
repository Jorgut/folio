# Layout Family and Export Capability Matrix

Status: audit baseline, 2026-10-07. This matrix describes the current reference wireframes and export scripts, not a guarantee that every template has been produced and visually verified in every application.

## Delivery tracks

| Track | Primary compositions | Editable handoff | Review / final output |
|-------|----------------------|------------------|-----------------------|
| Publication | Portrait articles, A4 pages, facing-page magazine features | IDML for InDesign | Figma for design review and digital adaptations; print-ready PDF after preflight |
| Presentation | Landscape slides, initially 16:9 and then 4:3 | PPTX for PowerPoint | Open the PPTX in Keynote and Google Slides for compatibility QA; PDF/HTML for fixed visual review |

The tracks share layout roles and content hierarchy, but not a single fixed canvas. A facing-page publication is assembled from individual left and right pages; it is not one wide slide. Keynote and Google Slides are compatibility targets for the PPTX handoff, not independent Folio exporters today. Do not claim cross-platform support until the same sample has been opened, inspected, and edited in each target application.

## Status key

| Code | Meaning |
|------|---------|
| `W` | HTML wireframe exists. This confirms a design reference, not a production export. |
| `U` | Export path exists, but family-specific geometry, text, image, and editability have not been verified. |
| `R` | Requires page-format reflow before this export path can represent the family faithfully. |
| `V` | Visual PDF export path exists for the 16:9 canvas; family-specific output still needs visual QA. PDF is not an editable-layout handoff. |
| `A` | Native, editable result verified for this family and format against the acceptance checks below. No cell has this status yet. |

## Current matrix

| Layout family | HTML | PPTX | Print PDF | Figma | IDML |
|---------------|------|------|-----------|-------|------|
| `hero-opener` | W | U | V | U | U |
| `2-column-board` | W | U | V | U | U |
| `moodboard-grid` | W | U | V | U | U |
| `caption-rail-gallery` | W | U | V | U | U |
| `split-proof-spread` | W | U | V | U | U |
| `strip-narrative` | W | U | V | U | U |
| `dense-presentation-board` | W | U | V | U | U |
| `controlled-masonry-gallery` | W | U | V | U | U |
| `layout-system-sheet` | W | U | V | U | U |
| `deck-contact-sheet` | W | U | V | U | U |
| `brand-guideline-board` | W | U | V | U | U |
| `campaign-deliverables-board` | W | U | V | U | U |
| `editorial-longform` | W | R | R | R | R |
| `portrait-magazine-essay` | W | R | R | R | R |
| `portrait-image-led-a4` | W | R | R | R | R |
| `portrait-social-feature` | W | R | R | R | R |
| `portrait-adaptive-article-3x4` | W | R | R | R | R |
| `portrait-image-cover-pair` | W | R | R | R | R |
| `magazine-investigative-spread` | W | R | R | R | R |
| `vertical-portfolio-stack` | W | R | R | R | R |

`R` is about the current exporter canvas, not an assertion that the destination application cannot handle portrait, facing-page, or tall documents. A redesigned 16:9 adaptation is possible, but it must be treated as a different composition and verified separately. The campaign row refers to its current landscape board; individual social deliverables need their own page-format checks.

## Evidence and limits

- The 20 family names and intended structures come from [taxonomy.md](taxonomy.md); examples and adaptation rules come from [templates.md](templates.md) and [previews/index.html](previews/index.html).
- [export-native-pptx.mjs](../scripts/export-native-pptx.mjs) defines a custom 1280 x 720 layout and extracts editable text and other elements from rendered HTML. This is an export mechanism, not per-family fidelity evidence.
- [export-print-pdf.mjs](../scripts/export-print-pdf.mjs) fixes trim at 1280 x 720 and adds 3 mm bleed. Its bleed setting does not make the current A4 or magazine-spread wireframes print-ready at their intended dimensions.
- [export-figma.mjs](../scripts/export-figma.mjs) and [export-idml.mjs](../scripts/export-idml.mjs) also use 1280 x 720 source geometry. The IDML exporter currently builds one page per spread from `.slide` elements. The editorial sample instead uses `.page` elements inside `.spread` containers, so changing width and height constants alone would not export that sample as a book. An IDML file opening successfully would not alone prove correct facing pages, print trim, or typography.
- [export-verify.mjs](../scripts/export-verify.mjs) checks generic slide structure and PPTX output. It does not establish visual or editable fidelity for every row above.

## Promotion to verified support

For each family-format cell, use a representative finished page at its intended canvas and reading size. Confirm: correct page count and dimensions; trim, bleed, safe area, and gutter; image crop and captions; text fit, reading order, and font substitution; recurring folios; and comparison with the approved HTML/reference image. For PPTX, Figma, and IDML, also open the result in the destination application and verify that text and image frames remain meaningfully editable. Record the test artifact and date before changing `U`, `R`, or `V` to `A`.

Highest-priority gaps are native portrait/A4 export, true facing-page and gutter handling, tall-page export, and family-specific regression screenshots across desktop and mobile HTML plus exported files. Add a new layout family only when an existing family cannot express the required structure; do not add near-duplicate templates to inflate coverage.

## Implementation checkpoints

1. Define one explicit page contract for each exportable document: trim width and height with units, page order, bleed, safe margins, and whether pages are paired for review. A facing pair remains two pages in the source and in IDML/PDF. Reject mixed dimensions in a single PPTX until a separate adaptation is defined.
2. Prove a single A4 article page through HTML -> IDML and print PDF with correct physical dimensions and editable text in InDesign. Do not use the existing fixed 16:9 slide exporter as a proxy.
3. Add a two-page facing fixture and verify left/right order, gutter, folios, bleed, and separate pages. Then extend to a short multi-page magazine sequence.
4. Keep the presentation track separate: verify a 16:9 PPTX in PowerPoint, Keynote, and Google Slides. Log font substitutions, line breaks, image crops, and editing behavior. Add 4:3 only after a distinct canvas test.
5. After visual and native-application QA, update the relevant matrix cells and publish the implementation separately from draft wireframes.
