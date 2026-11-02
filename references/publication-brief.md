# Publication Specifications Before Layout

## Ask Only What Is Missing

For a new publication, establish these fields before choosing a template or composing pages. Read supplied files and accepted project specifications first. Do not ask again for known values or turn a local correction into a new questionnaire.

| Field | Record |
|---|---|
| Destination | Magazine/book/document, presentation, or social image article; phone reading, screen presentation or print |
| Canvas | Exact width × height, mm/pt/px unit, orientation; single page or facing pages |
| Type roles | Title, subtitle, section heading, body, caption/credit; explicit size and pt/px unit, font family when required |
| Body grid | One, two or three columns, or another explicit count; gutters and margins |
| Delivery | Requested formats; complete-copy/continuation requirement and image crop restrictions |

Use one compact question for consequential gaps, such as: “这次主要用于手机发布还是印刷？页面用多大尺寸（mm 或 px），标题／副标题／小标题／正文分别多大（pt 或 px），正文采用几栏？已有要求我会保留，其余可以先给建议供您确认。” Do not make the user fill in technical values they have delegated: offer one concrete proposed brief instead.

If the user requests alternatives, label provisional briefs and show representative pages for comparison; do not present an unapproved choice as a confirmed specification. Existing-document edits inherit their accepted brief.

## Separate Size, Style and Destination

- “Magazine-like” describes composition, not dimensions. Magazines need not be A4, and a social image article need not inherit a print page.
- A4 portrait is 210 × 297 mm; landscape reverses it. Ask whether this is the intended trim size, not the size of a facing-page spread. Do not silently add bleed without a print requirement.
- For social images, confirm a pixel canvas or an aspect ratio plus pixel dimensions. A ratio alone does not define resolution. Treat any proposed social size as a project choice, not a verified platform requirement.
- An A4 design published as an image retains the A4 ratio unless the user requests a separate adaptation. Do not stretch it into a social ratio. If both destinations matter, agree separate outputs and check each.

## Units and Type Hierarchy

“20字号” or “14号” without a known unit is ambiguous. Confirm pt versus px; do not confuse numeric point sizes with named Chinese size labels such as 四号. Reuse an explicit unit already established for the project.

Keep physical and digital units explicit:

- 1 inch = 25.4 mm = 72 pt; CSS reference mapping is 96 px per inch.
- `cssPx = pt × 96 / 72`, `cssPx = mm × 96 / 25.4`.
- These are layout mappings, not monitor pixel-density or print-quality guarantees. A higher-resolution image export scales the complete page uniformly; it must not change type proportions or reflow the article.
- Native PPTX/PDF type uses points; preserve requested values after conversion rather than passing CSS pixel values through as points. Other authoring tools must declare their unit mapping. Never claim this reference automatically changes existing exporters.

Illustrative brief, only if the user confirms it: A4 portrait, title 20 pt, subtitle 18 pt, section heading 16 pt, body 14 pt, two body columns. The subtitle and heading assignments are examples, not inferred requirements from an unordered list of sizes. Margins, gutter, caption size and line height remain proposals until resolved or delegated. Do not make this the universal Folio default.

Do not impose a title/body multiplier or enlarge type because a template prefers a dramatic title. Use weight, spacing and grouping within the accepted hierarchy. If a fixed heading cannot fit, reflow, adapt the region or continue the content; request permission before changing the specified size or wording.

## Shared Geometry and Content Capacity

Record the accepted brief alongside the page plan, including where each value came from (user, existing document or accepted proposal). Derive content and guides from those same values. For equal-width body columns:

`columnWidth = (pageWidth - leftMargin - rightMargin - (columnCount - 1) × gutter) / columnCount`

All geometry operands must use the same unit; column count must be a positive integer and column width positive. Headings and pictures may span columns where the brief permits it, but may not silently change the requested body grid. Record column order and paragraph continuation, particularly for Chinese or Mongolian vertical composition.

Fixed type sizes plus fixed canvas and columns determine capacity; page count is the variable unless constrained. Never solve excess copy by silently shrinking type, changing columns, omitting text or clipping. Add continuation pages, or discuss the conflict if page count is also fixed.

The current `layout-selection.mjs` is only a planning shortlist: its canvas is unitless and it does not enforce font sizes, gutters or column count. Carry the complete publication brief into authoring and manually reject incompatible candidates; do not claim a positive shortlist result validates these constraints.

## Acceptance

1. Check actual output page dimensions, units and orientation against the brief, not just the preview frame.
2. Check every type role and body column count, margins/gutters, reading order and continuation. Review any missing-glyph substitutions and actual line breaks using the delivered fonts.
3. Render real content and inspect overlap, clipping, captions, crop and footer safety; verify separately for each requested format.
4. For phone publication, inspect a realistic fit-to-screen preview without zoom. A correct 14 pt A4 body may still be too small after the whole page is reduced to phone width. Show that conflict and propose more pages or a separate social adaptation; do not silently break the accepted brief.

These are authoring and QA requirements, not a claim that the web editor already has a specification wizard or that every exporter supports every canvas or writing mode.
