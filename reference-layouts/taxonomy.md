# Reference Layout Taxonomy

This taxonomy turns visual references into reusable, domain-neutral Folio layout structures.

Use it across editorial and graphic design, brand identity, product/industrial design, fashion/textiles, architecture/interiors/spatial design, portfolios, research, campaigns, and presentation boards. The source library contains many spatial-design references, but that is a bias in the examples, not a limit on Folio's domain. Choose subject matter, imagery, and vocabulary from the user's brief; classify the reference by composition and information hierarchy. Do not copy its source image, wording, brand assets, or visual identity.

Keep two decisions separate: **domain** determines what the content is about and what counts as evidence; **layout family** determines how that content is organized. A feature opener, proof spread, gallery, or dense reading layout can serve many design fields.

## Source Board

Default maintained board:

`https://www.pinterest.com/jorgutyn/visualizationlayouts-%D0%BC%D0%B0%D0%BA%D0%B5%D1%82%D1%8B/layout/`

Observed board signals:

- Presentation grid systems
- Interior design presentation templates
- Mood boards and material boards
- Brand guideline boards
- Bento grid systems
- Layout system sheets
- Dense multi-page portfolio previews
- Deck contact sheets
- Vertical portfolio stacks
- Campaign deliverables boards

If the board cannot be accessed or only loads partially, ask for screenshots and classify from the screenshots.

## Classification Families

| Family | Use When | Structure Signal | Folio Use |
|--------|----------|------------------|-----------|
| `hero-opener` | Project needs a strong first impression | One dominant image with title/meta rail | Project opener |
| `2-column-board` | Image and explanation have equal importance | Left/right grid with clear text column | Case intro, concept page |
| `moodboard-grid` | Materials, references, colors, and atmosphere matter | Controlled collage with small labels | Concept, material palette |
| `caption-rail-gallery` | Images need explanation without heavy paragraphs | Image field plus side/top caption rail | Gallery, detail proof |
| `split-proof-spread` | Page must prove a design decision | One main proof image plus 2-4 support images | Proof spread |
| `strip-narrative` | Content is sequential | Horizontal or vertical strip of scenes | Process, walkthrough |
| `dense-presentation-board` | Reviewer needs many signals on one page | Many modules, tight grid, strict hierarchy | Expert review board |
| `editorial-longform` | A continuous article needs pacing across portrait pages | Running header, lead image, paired columns, numbered sections, recurring folio | Essays, studio perspectives, bilingual features |
| `portrait-social-feature` | A 4:5 article keeps its copy while adapting source-image crops | Fixed full-width lead image, headline with side deck, three-column body, full-width closing statement | Portrait digital essays and design commentary |
| `portrait-adaptive-article-3x4` | A taller digital page reflows comparable article content | Lead image, headline, two-column body, closing statement | Portrait articles requiring a 3:4 page |
| `portrait-image-led-a4` | A print article leads with visual evidence | Running head, headline, image/caption, three-column body, folio | Printed editorial features and journals |
| `portrait-image-cover-pair` | An uncropped square image needs a dedicated cover role | 1:1 full-width image cover followed by a two-column article page | Image-led stories whose source should not be cropped |
| `portrait-magazine-essay` | A portrait editorial page leads with a typographic thesis before visual evidence | Running head, bilingual headline, credit row, wide image/caption, three text columns, cross-column quote, folio | Design essays, interviews, cultural features |
| `magazine-investigative-spread` | A feature needs high-density reading across facing pages | Quiet thesis/image opener, narrow multi-column copy, asymmetrical statement/evidence spreads, recurring folios | Investigative features, culture and sustainability stories |
| `controlled-masonry-gallery` | Image ratios vary but must remain orderly | Mixed image sizes inside fixed outer frame | Portfolio gallery |
| `layout-system-sheet` | The reference explains many grid systems | Layout inventory, mini wireframes, numeric modules | Layout grammar reference |
| `deck-contact-sheet` | The reference shows many complete slides/pages | Multi-slide overview with repeated thumbnails | Rhythm and deck sequencing |
| `vertical-portfolio-stack` | The reference is a tall scrolling stack of project boards | Sequential boards in one vertical column | Project case study stack |
| `brand-guideline-board` | Brand identity and rules are the content | Typography, color, logo, components, usage blocks | Brand guideline deck |
| `campaign-deliverables-board` | Social/media/deliverables are grouped by output | Repeated deliverable frames with annotations | Marketing or launch assets |

## Classification Questions

Classify each reference by answering these questions:

1. What is the page job: opener, proof, gallery, detail, process, or review board?
2. Is there one dominant element, or are all modules equal?
3. Does text lead the page, support the images, or act as captions only?
4. Are images aligned by top edge, bottom edge, right edge, baseline, or center axis?
5. Does the layout use tight, standard, or wide spacing?
6. Is the composition column-based, strip-based, board-based, or masonry-based?
7. What bleed mode does it imply: `no-bleed`, `soft-bleed`, `edge-bleed`, `full-bleed`, or `print-bleed`?
8. Which line does the dominant image respect: content frame, safe line, trim line, or bleed line?
9. What must be preserved when adapting it to Folio?
10. What must not be copied: source imagery, text, brand assets, template details, or ornamental style?

## Translation Template

Use this record for each reference:

| Field | Value |
|-------|-------|
| reference_source | Board URL, screenshot path, or pin URL |
| family | One classification family |
| page_role | opener / proof spread / gallery board / detail atmosphere / process / review |
| grid_pattern | single hero / 2-column / 3-column / board / strip / controlled masonry |
| image_hierarchy | hero + support / equal modules / rhythm strip / text-led |
| text_role | title rail / side note / caption rail / dense annotation / minimal |
| spacing | tight / standard / wide |
| alignment_rule | shared top / shared bottom / shared right edge / baseline / axis |
| bleed_mode | no-bleed / soft-bleed / edge-bleed / full-bleed / print-bleed |
| boundary_rule | content frame / safe line / trim line / bleed line |
| folio_template | Matching template name from `templates.md` |
| adaptation_note | How to apply the structure without copying the source |

## Board Catalog

Use `catalog.md` before creating new templates. If a new reference matches an existing family, update the catalog rather than adding another near-duplicate template.

## Hard Rules

- Do not save or redistribute Pinterest images inside the repo.
- Do not copy template-specific imagery, copywriting, brand marks, or paid design assets.
- Do not treat Pinterest's outer masonry feed as the template. Classify the internal layout of each pin or screenshot.
- Every extracted layout must become a wireframe with explicit frame, gap, hierarchy, and alignment rules.
- Every extracted layout must name its bleed behavior and distinguish bleed line, trim line, safe line, and content frame.
- For long-form editorial references, record page sequence, text/image pacing, language pairing, and recurring navigation separately; bilingual copy and ornamental styling are optional choices, not family requirements.
- If a reference is visually interesting but structurally unclear, mark it as `inspiration-only` and do not turn it into a template.
