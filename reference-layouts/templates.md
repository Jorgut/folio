# Reference Layout Templates

These templates are structural wireframes for Folio. They are designed to be reused without copying source reference imagery or template assets.

Default geometry assumptions:

- Page: 16:9 landscape
- Content frame: 12 columns
- Image radius: `0px`
- Portfolio image gap: `tight` = 12-14px unless noted
- Safe area: preserve footer, page number, and project label
- Every template must declare `bleed_mode` before final layout

## Bleed Modes

| Mode | Meaning | Use When |
|------|---------|----------|
| `no-bleed` | All content stays inside the safe/content frame | Dense boards, text-heavy pages, contact sheets, system pages |
| `soft-bleed` | Image breaks the content frame slightly but does not touch the page edge | Galleries, proof spreads, mixed-ratio image pages that need more energy |
| `edge-bleed` | Image touches one or two trim edges while text remains safe | Project openers, campaign boards, strong visual transitions |
| `full-bleed` | Image fills the entire page; text is minimal and overlaid inside the safe line | Covers, chapter openers, immersive image-led pages |
| `print-bleed` | Image extends beyond trim for PDF/print, usually 3mm equivalent | Print-ready exports where edge-to-edge imagery must survive trimming |

Line system:

- `BLEED LINE`: optional image extension beyond final trim
- `TRIM LINE`: final page edge
- `SAFE LINE`: text, captions, page numbers, and footer safety boundary
- `CONTENT FRAME`: 12-column working frame for most content

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
| `controlled-masonry-gallery` | `controlled-masonry-gallery` | Mixed image ratios with order | balanced | `soft-bleed` |
| `layout-system-sheet` | `layout-system-sheet` | Explaining layout grammar and available compositions | compact | `no-bleed` |
| `deck-contact-sheet` | `deck-contact-sheet` | Reviewing deck rhythm across many pages | compact | `no-bleed` |
| `vertical-portfolio-stack` | `vertical-portfolio-stack` | Tall case-study stacks and scrollable portfolio pages | balanced | `no-bleed` |
| `brand-guideline-board` | `brand-guideline-board` | Brand systems, typography, color, and usage rules | compact | `no-bleed` |
| `campaign-deliverables-board` | `campaign-deliverables-board` | Social/media/deliverables grouped by format | balanced | `edge-bleed` |

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
