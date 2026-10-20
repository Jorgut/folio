# Publication PDF Repair Status

Date: 2026-10-20. Experimental source-contract support; not blanket print-production approval.

## Published Scope

`scripts/publication-pages.mjs` describes individual pages, optional facing pairs, physical dimensions and explicit bleed. `scripts/export-print-pdf.mjs` detects the publication root in the loaded DOM, keeps the source base URL for relative assets, splits pairs into individual PDF pages, and writes trim/bleed boxes.

The root must declare `data-document-format="publication"`, `data-page-width-mm`, `data-page-height-mm` and `data-bleed-mm`. Its direct children are `.page` elements with IDs, or `.spread` elements with IDs containing exactly two `.page` children. Pages declare `data-bleed-mode="no-bleed"` or `"edge-bleed"`. Pair order is currently left then right in DOM order, not an automatic right-to-left book model. Other structures are not implicitly supported.

Missing/undecodable images or decode deadlines fail the export. The publication and slide rendering paths use their loaded page for asset validation rather than a separate image-download and HTML-relocation pass.

## Local Real-Render Evidence

An independent four-page English A4 fixture was run through the actual CLI using installed Google Chrome. Single-quoted, double-quoted and unquoted format attributes each produced four pages in order. PDF checks covered all extracted source blocks, folios, image objects, 210 x 297 mm trim, 216 x 303 mm media size, word bounds inside trim, and raster pixels at the top/outer bleed edges. Four rasterized pages were visually inspected. A missing-image input failed without generating a PDF.

Measured local CLI durations were approximately 1.82-2.64 seconds for this small fixture. This is not a full authoring speed benchmark, an all-layout pass, PDF/X validation, CMYK preflight, font-variant acceptance or a printer-approved delivery.

## IDML Remains On Hold

The IDML publication changes remain local and are not included in this publication PDF update. They do not establish a valid native package, independent text-story ownership, real facing-page spreads, image placement or InDesign compatibility. No publication matrix cell is promoted by this PDF repair. See [capability matrix](../reference-layouts/capability-matrix.md).

The independent shared-geometry two-layout pilot is a separate experiment. This PDF repair does not migrate its geometry into all Folio layouts or revise its HTML/PPTX/PDF deliverables.
