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

### Publication sample QA hold (2026-10-07, local unpublished work)

- The `distributed-studio` fixture contains five facing-page compositions, exported as ten sequential **single A4 pages** in one print PDF. These are not ten independent layout variants or ten finished articles.
- The local PDF trial passed the structural checks for page count, A4 trim (210 x 297 mm), and 3 mm bleed. On 2026-10-07, the four reading pages (03, 06, 07, 09) received more Lorem Ipsum copy and larger body type; their exported PDF pages were visually checked for density and clipping. This does not promote the publication rows above: the text is still placeholder copy, not approved editorial content, and the sampled images are approximately 129-215 ppi. Final editorial and image preflight remain open. Do not call this print-ready.
- All ten pages were then visually reviewed in the exported PDF. Page 05's caption was moved directly below its image and the image enlarged; page order, folios, and visible text showed no new clipping or overlap. Every PDF page has the same A4 TrimBox and 3 mm BleedBox, and sampled outer-edge pixels on image pages contain image content. This closes the sample's structural and visual-layout check, but not final print preflight: approved copy, image-resolution targets, color/press requirements, and a physical proof remain outstanding.
- The local IDML trial did not pass even a blank A4 document-open check in InDesign. Native editability, facing-page order, margins/gutter, and typography are therefore unverified. The user currently has no InDesign access for final application QA; defer that QA until access is restored. No purchase is required to continue PDF/editorial checks in the meantime.
- Comparison with an InDesign-exported local specimen confirms that the current generated package lacks the native document root and standard package entries (`mimetype`, `META-INF/container.xml`, resource references). It cannot be promoted by changing canvas constants or passing ZIP/XML syntax checks. Keep the IDML exporter work local until a package can be opened and edited in the target application.
- The user confirmed that there is no approved article copy and no printer specification yet. Lorem Ipsum remains deliberate test copy, and no generic ppi/CMYK/PDF preset should be represented as a printer-approved requirement. The current images' effective 129-215 ppi is a resolution warning for full-page print, not a verified rejection against a named printer's specification.
- Resume in order: replace placeholder text with approved copy and recheck fit; inspect all ten exported pages and image/bleed quality; repair the IDML package and re-run structural tests; then open, inspect, and edit the result in InDesign when available. Only after these checks should the relevant matrix cells be promoted or the local exporter work published.

## Promotion to verified support

For each family-format cell, use a representative finished page at its intended canvas and reading size. Confirm: correct page count and dimensions; trim, bleed, safe area, and gutter; image crop and captions; text fit, reading order, and font substitution; recurring folios; and comparison with the approved HTML/reference image. For PPTX, Figma, and IDML, also open the result in the destination application and verify that text and image frames remain meaningfully editable. Record the test artifact and date before changing `U`, `R`, or `V` to `A`.

Highest-priority gaps are native portrait/A4 export, true facing-page and gutter handling, tall-page export, and family-specific regression screenshots across desktop and mobile HTML plus exported files. Add a new layout family only when an existing family cannot express the required structure; do not add near-duplicate templates to inflate coverage.

## Implementation checkpoints

1. Define one explicit page contract for each exportable document: trim width and height with units, page order, bleed, safe margins, and whether pages are paired for review. A facing pair remains two pages in the source and in IDML/PDF. Reject mixed dimensions in a single PPTX until a separate adaptation is defined.
2. Prove a single A4 article page through HTML -> IDML and print PDF with correct physical dimensions and editable text in InDesign. Do not use the existing fixed 16:9 slide exporter as a proxy.
3. Add a two-page facing fixture and verify left/right order, gutter, folios, bleed, and separate pages. Then extend to a short multi-page magazine sequence.
4. Keep the presentation track separate: verify a 16:9 PPTX in PowerPoint, Keynote, and Google Slides. Log font substitutions, line breaks, image crops, and editing behavior. Add 4:3 only after a distinct canvas test.
5. After visual and native-application QA, update the relevant matrix cells and publish the implementation separately from draft wireframes.
