# Reference Layout Templates

These templates are structural wireframes for Folio. They are designed to be reused without copying source reference imagery or template assets.

Default geometry assumptions:

- Page: 16:9 landscape
- Content frame: 12 columns
- Image radius: `0px`
- Portfolio image gap: `tight` = 12-14px unless noted
- Safe area: preserve footer, page number, and project label
- Every template must declare `bleed_mode` before final layout

The preview library records a primary ratio, example canvas, intended medium, and adaptation note for every layout. These are design starting points, not universal platform upload requirements. Verify the current destination's specifications at export time; do not treat a phone's physical screen size as the layout canvas.

For current HTML, PPTX, print PDF, Figma, and IDML coverage by layout family, see [capability-matrix.md](capability-matrix.md).

## Bleed Modes

| Mode | Meaning | Use When |
|------|---------|----------|
| `no-bleed` | All content stays inside the safe/content frame | Dense boards, text-heavy pages, contact sheets, system pages |
| `soft-bleed` | Image breaks the content frame slightly but does not touch the page edge | Galleries, proof spreads, mixed-ratio image pages that need more energy |
| `edge-bleed` | Image touches one or two trim edges while text remains safe | Project openers, campaign boards, strong visual transitions |
| `full-bleed` | Image fills the entire page; text is minimal and overlaid inside the safe line | Covers, chapter openers, immersive image-led pages |
| `print-bleed` | Image extends beyond trim for PDF/print, usually 3mm equivalent | Print-ready exports where edge-to-edge imagery must survive trimming |

Line system, from outside inward in the wireframe preview:

- Red dashed `BLEED LINE`: optional image extension outside the final trim; absent for no-bleed pages
- Black solid `TRIM LINE`: outer edge of the finished page
- Green dashed `SAFE LINE`: outer limit for live text, captions, page numbers, and footers
- Blue dotted `CONTENT FRAME`: preferred alignment area inside the safe line; content may use more of the safe area deliberately

When enlarging a wireframe for inspection, scale the complete fixed-ratio page and all of its guides and placeholders together. Do not enlarge only the page frame while leaving pixel-sized interior modules at their thumbnail dimensions. Changing the actual delivery canvas is a separate reflow decision: revise image crop, column count, copy length, and folio placement, then inspect the export at its intended reading size.

Required layout fields:

```text
bleed_mode: no-bleed / soft-bleed / edge-bleed / full-bleed / print-bleed
safe_margin: 64px or project contract value
content_frame: 12-column
image_frame: aligned to safe / content / edge / bleed
```

## Template Index

| Template | Family | Best For | Density | Recommended Bleed |
|----------|--------|----------|---------|-------------------|
| `portfolio-opener-hero-rail` | `hero-opener` | First page of a project | airy | `edge-bleed` |
| `case-study-2-column-board` | `2-column-board` | Concept + visual evidence | balanced | `no-bleed` |
| `moodboard-grid-3x2` | `moodboard-grid` | Materials, palette, atmosphere | balanced | `no-bleed` |
| `caption-rail-gallery` | `caption-rail-gallery` | Explained image sets | balanced | `soft-bleed` |
| `interior-proof-1plus3` | `split-proof-spread` | One main space + supporting details | balanced | `soft-bleed` |
| `strip-narrative-process` | `strip-narrative` | Sequence, walkthrough, process | compact | `no-bleed` |
| `dense-presentation-board` | `dense-presentation-board` | Expert review page | compact | `no-bleed` |
| `editorial-longform-feature` | `editorial-longform` | Continuous essays, studio viewpoints, and bilingual features | balanced | `no-bleed` |
| `portrait-social-feature` | `portrait-social-feature` | Single-page vertical social/editorial features | compact | `edge-bleed` image, safe text |
| `portrait-adaptive-article-3x4` | `portrait-adaptive-article-3x4` | Taller digital article with comparable copy reflowed to two columns | compact | edge image, safe text |
| `portrait-image-led-a4` | `portrait-image-led-a4` | Image-first print article with caption and running folio | compact | `no-bleed` |
| `portrait-image-cover-pair` | `portrait-image-cover-pair` | Uncropped square-image cover followed by the full article | balanced | edge image on cover, safe text on continuation |
| `portrait-magazine-essay` | `portrait-magazine-essay` | Title-led portrait magazine articles | compact | `no-bleed` |
| `magazine-investigative-feature` | `magazine-investigative-spread` | Dense magazine features with pull statements, evidence images, and facing-page rhythm | compact | `no-bleed` |
| `controlled-masonry-gallery` | `controlled-masonry-gallery` | Mixed image ratios with order | balanced | `soft-bleed` |
| `layout-system-sheet` | `layout-system-sheet` | Explaining layout grammar and available compositions | compact | `no-bleed` |
| `deck-contact-sheet` | `deck-contact-sheet` | Reviewing deck rhythm across many pages | compact | `no-bleed` |
| `vertical-portfolio-stack` | `vertical-portfolio-stack` | Tall case-study stacks and scrollable portfolio pages | balanced | `no-bleed` |
| `brand-guideline-board` | `brand-guideline-board` | Brand systems, typography, color, and usage rules | compact | `no-bleed` |
| `campaign-deliverables-board` | `campaign-deliverables-board` | Social/media/deliverables grouped by format | balanced | `edge-bleed` |

## `portrait-social-feature`

Page role: one composed 4:5 portrait feature for social feeds. Preserve the reference's four bands on the same page: full-width image, headline with side rail, three-column article, and cross-column closing statement. Its architecture subject, wording, photo, and visual identity are not part of the template.

The refined Figma reference (`24:43`) confirms the image-first hierarchy. In the reusable 4:5 wireframe, the preferred full-width image field is 16:9, so it occupies 45% of the page height; the headline/rail remains about 14%, the closing band about 10%, and the body takes the remaining space. This is a deliberate adaptation of the reference, not a claim that its original image frame was exactly 16:9. The earlier Figma node (`2:4`) is a separate title-led magazine structure, recorded as `portrait-magazine-essay`.

- Mark the preferred 16:9 image field with a dashed construction boundary. Also show 3:2, 4:3, and 1:1 as alternative source-image proportions; these are source options, not simultaneous overlapping crop guides in finished artwork.
- For a different source ratio, first test subject-preserving `cover` cropping in the fixed image field. Keep the article's information density and text size stable; a 3:2, 4:3, or square source is not a reason to progressively remove body copy. If the subject cannot be cropped, switch to a different page role rather than silently converting the article into a cover.
- Never use `contain` to create unintended side bars, and never stretch the photograph to force a ratio. Check the selected image's focal point after cropping.

- The lead image may touch the trim edge. Keep any overlaid metadata inside the safe area and contrast-check it against the actual crop; remove labels that do not aid navigation.
- Give the headline the strongest text weight. Integrate one accent phrase within its line flow; the narrow side rail contains only a short deck and secondary metadata.
- Keep the three body columns aligned on one top baseline. Place one pull quote inside the first column without letting it become another headline. Let the final statement span the lower width, with a small optional side note.
- Use a consistent horizontal text safe margin of at least 7% of the page width. The image alone may bleed; the headline, rail, body, quote, and conclusion may not.
- At actual phone display size, check Chinese/Latin glyph size, line length, column order, crop, and bottom clearance. If readable copy does not fit, edit the text or add a continuation page; do not silently shrink the type or turn this template into a different two-page composition.
- Gray guide lines and safety boundaries belong to the wireframe only. Keep a visible line in finished artwork only when it serves a specific navigation or expressive purpose.

### Vertical adaptation roles

Treat this family like responsive editorial composition: preserve the content hierarchy, but reflow it for the delivery page. These are distinct page formats, not four image-fit settings.

| Role | Example page | Image policy | Text policy |
|------|--------------|--------------|-------------|
| `portrait-social-feature` | 4:5, 1080 × 1350 px | Keep a 16:9 full-width field; crop 16:9, 3:2, 4:3, or 1:1 sources around their focal point | Three-column article and closing statement remain on the page |
| `portrait-adaptive-article-3x4` | 3:4, 1080 × 1440 px | Re-evaluate the crop for the taller page | Reflow comparable copy into two columns; do not merely scale the 4:5 page |
| `portrait-image-led-a4` | A4, 210 × 297 mm | Place the image inside the print trim with an attached caption | Add running head and folio; use three columns only at legible print size |
| `portrait-image-cover-pair` | Two 4:5 pages | Display an uncropped 1:1 source across the first page | Treat page one as a cover and place the complete article on page two |

In wireframe previews, use Lorem ipsum to test column density and fill close to the footer without crossing the safe line. At final output size, replace it with the approved copy and verify every column for overflow and reading order. If copy cannot fit, revise the editorial scope or add a continuation page; do not hide overflow or reduce body type to preserve an arbitrary one-page count.

```text
┌──────────────────────────────────┐
│ FULL-WIDTH IMAGE / SMALL META    │
├──────────────────────────┬───────┤
│ HEADLINE + ACCENT PHRASE │ DECK  │
├───────────┬───────────┬──────────┤
│ BODY      │ BODY      │ BODY     │
│ PULL      │           │          │
│ BODY      │           │          │
├─────────────────────────┬────────┤
│ CLOSING STATEMENT       │ NOTE   │
└─────────────────────────┴────────┘
```

## `portrait-magazine-essay`

Page role: one title-led A4 portrait magazine page (210:297, example canvas 210 × 297 mm). This is distinct from the 4:5 `portrait-social-feature`, where the lead image comes first. Adapt the structure, not the linked Figma file's article text, photograph, credits, typefaces, or exact styling. A social adaptation requires reflow into readable pages, not a scaled-down A4 image.

- Fix the portrait trim, text safe margin, and footer baseline before fitting copy. `bleed_mode: no-bleed`; image, caption, headline, and footer all remain inside the safe line.
- Establish one text hierarchy: quiet running head; dominant headline with at most one accented word; subordinate translation/subtitle; tertiary byline and production credits.
- Let the wide image be the next major beat after the title. Its caption stays attached to the image, not between unrelated text blocks.
- Use three equal-width body columns only when the delivered reading size remains legible. Align their top edges and preserve continuous reading order. A modest drop cap may open the first column, but it must not interrupt the first lines.
- Place one pull quote after the body as a full-width conclusion, with optional translation and attribution below it. This is a distinct emphasis zone, not a fourth body column.
- Keep decorative hairlines out of the finished page unless they serve navigation or necessary grouping. The preview's safe/content guides are construction marks only.
- At actual page size, check headline wraps, translation balance, image crop, caption size, body line length, column overflow, quote height, and footer clearance. If the article does not fit legibly, continue on another page rather than shrinking the body.

```text
┌──────────────────────────────────┐
│ RUNNING HEAD / ISSUE       FOLIO │
│ KICKER                           │
│ LARGE HEADLINE + ACCENT          │
│ SUBTITLE / TRANSLATION           │
│ BYLINE  PHOTO CREDIT  LOCATION   │
│                                  │
│           WIDE IMAGE             │
│ CAPTION                          │
│                                  │
│ BODY       BODY       BODY       │
│ BODY       BODY       BODY       │
│                                  │
│ FULL-WIDTH PULL QUOTE            │
│ ATTRIBUTION                      │
│ RUNNING FOOTER             PAGE  │
└──────────────────────────────────┘
```

## `editorial-longform-feature`

Page role: a paced, multi-page article or editorial feature. This family is intended for continuous reading rather than a conventional widescreen pitch deck. Use portrait pages when the output is a document; adapt the same hierarchy to landscape only when the delivery format requires it.

Shared structure:

- Repeat a small running header and a quiet footer/folio across the article.
- Use a stable portrait content frame and align recurring title, image, and text edges to it.
- Give each page one clear reading job; vary the page composition while preserving navigation and typography roles.
- Pair translations by semantic module when bilingual content is requested. Translation is optional; never duplicate text solely to fill a column.
- Treat images as pacing devices between text sections. Keep image crops and captions subordinate to the article's argument.
- Keep the visual skin (typeface, color, rules, ornaments) independent from the structural template.
- Gray guide lines, safe/content-frame outlines, and alignment marks are construction aids, not default final artwork. Carry a line into the finished layout only when it has a necessary grouping, navigation, or expressive role; never preserve a guide merely because it appeared in the wireframe.

## `magazine-investigative-feature`

Page role: a print-inspired feature sequence with dense body copy, emphatic editorial statements, and documentary imagery. Use landscape spreads to plan facing pages, but keep each page's content inside its own safe/content frame. The reference direction is structural only; do not copy its wording, imagery, logos, exact page compositions, or visual identity.

Shared structure:

- Assemble a sequence from independent facing-page roles with stable outer margins, gutter clearance, running folios, and a recurring issue/section marker. A facing-page pair is a layout unit, not a mandatory place in the article.
- On every spread, align the left- and right-page folios to one shared bottom baseline. Place page numbers at the outer bottom corners, with the same bottom offset; keep them outside the center gutter. Running heads carry publication/section labels, not a second copy of the page number.
- In HTML previews, position paired folios from the spread container's shared footer row; separate page content boxes can have different heights. Confirm the rendered page-number baselines match before delivery.
- Use narrow columns only when the final reading size supports comfortable line length and leading; three columns is a starting point, not a mandate.
- Alternate dense reading pages with image-led pauses, evidence images, and short statements that span one or more columns.
- Use a strong accent for pull statements sparingly; the statement should summarize or quote approved content, never be invented as filler.
- Keep page numbers and all live text clear of the center gutter and inside the safe line.
- Use real approved copy for final layout. In wireframes and layout explorations, use Lorem Ipsum paragraphs to test column flow; mark headlines, quotes, and image captions with neutral placeholders.

Special compositions are `magazine-feature-opener`, `magazine-spacious-opener`, and `magazine-statement-evidence`. Reusable reading and evidence roles are `magazine-dense-reading` and `magazine-image-evidence`; repeat them when the story needs more pages. The preview folios `L` and `R` only identify the left and right pages. Assign actual consecutive folios when assembling a publication, not in the reusable templates. For example, pages 02-03 can use a spacious opener, 04-05 and 06-07 can both use dense reading, 08-09 can use statement/evidence, and 10-11 can use image evidence. This sequence is illustrative, not required.

### Variant A: `magazine-feature-opener`

Use as the opening spread: one page establishes the thesis and byline, while the facing page introduces the first major image or evidence.

```text
┌────────────────────────┬────────────────────────┐
│ RUNNING HEAD           │ ISSUE / FOLIO          │
│                        │                        │
│ LARGE THESIS           │                        │
│ BYLINE / SHORT DECK    │      LEAD IMAGE        │
│                        │      CAPTION           │
│ INTRO COPY             │                        │
└────────────────────────┴────────────────────────┘
```

### Variant B: `magazine-dense-reading`

Use for the main argument and reporting. Balance two or three narrow text columns with a single oversized pull statement that interrupts, rather than fragments, the reading flow.

```text
┌────────────────────────┬────────────────────────┐
│ HEAD / FOLIO            │ HEAD / FOLIO           │
│ LOREM COLUMN │ LOREM    │ LOREM │ LOREM │ LOREM │
│ LOREM COLUMN │ COLUMN   │ LOREM │ COLUMN│ COLUMN│
│            PULL STATEMENT ACROSS COLUMNS         │
│ LOREM COLUMN │ LOREM    │ LOREM │ LOREM │ LOREM │
└────────────────────────┴────────────────────────┘
```

### Variant C: `magazine-image-evidence`

Use when an image or documented artifact should carry evidence. Let the image occupy a clear field while copy wraps in separate, deliberately bounded columns; never overlay dense text on the image.

```text
┌────────────────────────┬────────────────────────┐
│ LOREM COLUMN │ IMAGE   │ IMAGE FIELD │ LOREM    │
│ LOREM COLUMN │ FIELD   │ CAPTION     │ COLUMN   │
│ PULL STATEMENT / CAPTION│ LOREM COLUMN           │
│ LOREM COLUMN            │ LOREM COLUMN           │
└────────────────────────┴────────────────────────┘
```

### Variant D: `magazine-spacious-opener`

Use when the opening argument needs a deliberate pause. Center a short thesis and byline on the left page, place a brief introduction lower on that page, and give the facing image most of the right page. Keep both folios on the shared bottom baseline; this is not a license to leave required article copy out.

```text
┌────────────────────────┬────────────────────────┐
│                        │                        │
│     THESIS / BYLINE    │                        │
│                        │       LEAD IMAGE       │
│                        │                        │
│          SHORT INTRO   │       IMAGE CREDIT     │
│ FOLIO                  │                  FOLIO │
└────────────────────────┴────────────────────────┘
```

### Variant E: `magazine-statement-evidence`

Use for an emphatic editorial claim supported by reporting. Give the pull statement a large left-page field while a narrow copy column continues beside it; place one supporting image below that copy. On the facing page, pair the continuing article with a separate image-and-caption field. Preserve the asymmetric rhythm without overlaying text on imagery or reproducing the reference magazine's wording, photos, or masthead.

```text
┌────────────────────────┬────────────────────────┐
│ PULL       │ REPORTING  │ REPORTING │ IMAGE      │
│ STATEMENT  │ COLUMN     │ COLUMN    │ CAPTION    │
│            │            │           │            │
│            │ IMAGE      │           │            │
│ FOLIO                  │                  FOLIO │
└────────────────────────┴────────────────────────┘
```

### Variant A: `editorial-opener`

Use for the first page of an essay, studio point of view, or feature.

Wireframe:

```text
┌──────────────────────────────┐
│ RUNNING HEADER          ISSUE│
├──────────────────────────────┤
│ HEADLINE / DECK               │
│ Optional translated subtitle │
├──────────────────────────────┤
│                              │
│          LEAD IMAGE           │
│                              │
├──────────────────┬───────────┤
│ EDITORIAL LEAD    │ SECTION 1 │
│ Main argument     │ Support   │
│ Translation       │ Translation│
├──────────────────┴───────────┤
│ RUNNING FOOTER          FOLIO │
└──────────────────────────────┘
```

Rules:

- Keep the headline to a deliberate, readable block; do not let oversized type consume the space needed by the lead image and first paragraph.
- Let the lead image span the content frame unless the story benefits from a clear text rail.
- Use the lower columns for distinct roles (editorial lead and supporting section), not two arbitrary halves of the same copy.

### Variant B: `editorial-image-break`

Use inside a long article when a new case, place, or argument benefits from a visual pause.

Wireframe:

```text
┌──────────────────────────────┐
│ RUNNING HEADER          ISSUE│
├──────────────────────────────┤
│ 02 │ SECTION TITLE           │
│    │ Optional translated deck│
├──────────────────┬───────────┤
│ INTRO / LANGUAGE A│ LANGUAGE B│
│ Short paragraph   │ Short para│
├──────────────────┴───────────┤
│                              │
│          WIDE IMAGE           │
│                              │
├──────────────────────────────┤
│ Caption / location / source  │
├──────────────────┬───────────┤
│ Key thought      │ Follow-on │
│ or pull quote    │ paragraph │
├──────────────────┴───────────┤
│ RUNNING FOOTER          FOLIO │
└──────────────────────────────┘
```

Rules:

- Keep the intro concise enough to let the image create a real pause.
- The caption must identify or contextualize the image; do not repeat the headline.
- The lower module may become a pull quote, short continuation, or source note according to the page's job.

### Variant C: `editorial-modular-rail`

Use for later pages that combine a continuous argument with practical criteria, partner profiles, regions, or project types.

Wireframe:

```text
┌──────────────────────────────┐
│ RUNNING HEADER          ISSUE│
├──────────────────────────────┤
│ 03 │ SECTION TITLE           │
│    │ Optional translated deck│
├────────────────────┬─────────┤
│ MAIN NARRATIVE     │ 04 MODULE│
│ Body / translation │ Short item│
│                    ├─────────┤
│ Pull quote /       │ 05 MODULE│
│ continuation       │ Short item│
│                    ├─────────┤
│                    │ 06 MODULE│
│                    │ Short item│
├────────────────────┴─────────┤
│ RUNNING FOOTER          FOLIO │
└──────────────────────────────┘
```

Rules:

- The main column carries the argument; the rail carries scannable, independently titled modules.
- Limit the rail to a few concise modules. If each module needs full paragraphs, move it to its own page or use `editorial-image-break`.
- Use dividers only to clarify module boundaries; spacing and alignment should do most of the organizing.
- Do not shrink body text to make every planned module fit. Shorten copy, remove a module, or add a page.

Across all variants, define the document page size and safe margins before adapting the frame. Reflow to one column on narrow screens while preserving the reading order: header, title, primary content, secondary modules, footer. Run the text-fit checks in `SKILL.md` for every language independently.

## `portfolio-opener-hero-rail`

Page role: project opener.

Wireframe:

- Left 7-8 columns: dominant hero image
- Right 4-5 columns: project title, location, year, type, short design thesis
- Optional 1 small support image under the text rail
- Align hero top with title block top
- Align hero bottom with metadata block or support image bottom

Rules:

- Use `wide` text-image gap, but keep image-internal gap tight
- Do not add more than 2 support images
- Right rail must not become a generic paragraph block

## `case-study-2-column-board`

Page role: concept explanation or project context.

Wireframe:

- Left 5 columns: text, small diagram, key idea, or material callouts
- Right 7 columns: image stack or 2-up image grid
- Shared top and bottom across both columns
- Captions stay inside each column, not floating outside the frame

Rules:

- Use when explanation and imagery carry similar weight
- Avoid 50/50 if one side clearly dominates; switch to 4/8 or 5/7
- Keep all images aligned to the same right boundary across project pages

## `moodboard-grid-3x2`

Page role: material board, concept board, palette page.

Wireframe:

- 3 columns x 2 rows image grid
- One module can span 2 rows as the hero material or atmosphere image
- Small labels attach to modules with a fixed caption gap
- Palette chips or material notes sit in a narrow rail

Rules:

- Use tight image gap: 12-14px
- Keep all module corners square unless a deck-wide radius is explicitly chosen
- Do not make the board a random collage; every module must snap to the grid

## `caption-rail-gallery`

Page role: image gallery with readable interpretation.

Wireframe:

- Main image field: 8-9 columns
- Caption rail: 3-4 columns or a top/bottom horizontal rail
- 2-5 images inside the main field
- Captions map to images by order, number, or position

Rules:

- The rail explains why the images matter
- Captions must align to image edges or baseline
- Avoid long paragraphs; use short labels, decisions, or evidence notes

## `interior-proof-1plus3`

Page role: proof spread for one design decision.

Wireframe:

- Main image: 7-8 columns, full height or near full height
- Three support images: stacked or 2-over-1 in the remaining columns
- Text note: small top or bottom rail, not a competing block
- Main and support groups share top and bottom edges where possible

Rules:

- Use when one image is clearly the strongest proof
- Support images must explain material, light, circulation, scale, or detail
- If support images have mixed ratios, crop them to a shared module height unless crop risk is high

## `strip-narrative-process`

Page role: sequence, process, walkthrough, before/after, or phase story.

Wireframe:

- Horizontal strip of 4-6 frames, or vertical strip of 3-5 frames
- One title or thesis block anchors the strip
- Each frame has a short label or step number
- Strip aligns to a single baseline or shared center axis

Rules:

- Use compact density
- Keep each frame visually comparable
- Do not mix unrelated image ratios unless each frame still snaps to the strip

## `dense-presentation-board`

Page role: expert review, board presentation, or information-rich overview.

Wireframe:

- 12-column board with 6-10 modules
- One dominant module sets the hierarchy
- Secondary modules hold image proof, diagrams, data, or notes
- Margins, internal gutters, and footer safe area are locked

Rules:

- Use only when the audience can handle compact density
- Every module needs a role; remove decorative filler
- Use stronger hierarchy than a normal moodboard, otherwise it becomes visual noise

## `controlled-masonry-gallery`

Page role: mixed-ratio portfolio gallery.

Wireframe:

- Fixed outer image frame
- Internal masonry cells snap to a row/column system
- Mixed heights are allowed only inside the fixed frame
- At least one shared vertical boundary and one shared horizontal boundary remain visible

Rules:

- Do not let image natural sizes decide the page
- Keep project-level left/right boundaries consistent across pages
- If the layout starts to look accidental, switch to `moodboard-grid-3x2` or `interior-proof-1plus3`

## `layout-system-sheet`

Page role: explain the layout grammar itself.

Wireframe:

- Dense grid of miniature layout diagrams
- One text rail names the system: columns, rows, modular, mosaic, or variants
- Mini layouts align to a strict matrix
- Optional dark/light examples can occupy the top or side band

Rules:

- Use for internal planning pages, design-system documentation, or GitHub visual guidance
- Every mini layout must be simplified; do not include real project imagery
- Keep labels short and consistent

## `deck-contact-sheet`

Page role: show deck rhythm across many pages.

Wireframe:

- 8-20 small slide thumbnails in a regular grid
- Group by section or page type
- Use small labels only when they clarify rhythm
- One edge of the contact sheet must align to the deck frame

Rules:

- Use for reviewing variety, pacing, and repeated layout families
- Do not treat contact-sheet thumbnails as final presentation pages
- Useful for spotting repeated compositions before final export

## `vertical-portfolio-stack`

Page role: tall portfolio case-study sequence.

Wireframe:

- Vertical stack of 3-6 horizontal boards
- Each board has its own mini layout but shares a common outer width
- Optional section number rail on the left or top
- Bottom area can hold palette chips, metadata, or a closing note

Rules:

- Use for scrollable web portfolio pages or a condensed case-study overview
- Keep every board aligned to the same left and right boundary
- Do not mix unrelated projects in one stack unless it is explicitly a portfolio index

## `brand-guideline-board`

Page role: brand identity system or visual rules.

Wireframe:

- Typography module
- Color palette module
- Logo or mark usage module
- Application/mockup modules
- Rules or notes rail

Rules:

- Use compact density
- Keep text and rules legible; avoid turning brand guidelines into decorative collage
- Separate identity rules from project imagery

## `campaign-deliverables-board`

Page role: grouped launch, social, or deliverables overview.

Wireframe:

- Repeated deliverable frames with consistent size
- One column or rail for campaign notes
- Strong numbering or section labels
- Final row can summarize outputs, formats, or next steps

Rules:

- Use when the content is about outputs, not spatial atmosphere
- Keep deliverable frames aligned even when imagery differs
- If the deliverables become too many, switch to `deck-contact-sheet`

## Selection Guide

| User Need | Start With |
|-----------|------------|
| "Make this project feel premium" | `portfolio-opener-hero-rail` |
| "Explain the concept clearly" | `case-study-2-column-board` |
| "Show material and atmosphere" | `moodboard-grid-3x2` |
| "Add explanation to these images" | `caption-rail-gallery` |
| "Prove this design decision" | `interior-proof-1plus3` |
| "Show process or sequence" | `strip-narrative-process` |
| "Fit many things for a jury/client review" | `dense-presentation-board` |
| "Use many mixed-ratio images without chaos" | `controlled-masonry-gallery` |
| "Document the layout system itself" | `layout-system-sheet` |
| "Review the whole deck rhythm" | `deck-contact-sheet` |
| "Show a vertical case-study sequence" | `vertical-portfolio-stack` |
| "Make brand guideline pages" | `brand-guideline-board` |
| "Group social or campaign deliverables" | `campaign-deliverables-board` |
