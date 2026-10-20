# Content-to-layout selection

## Intake and Selection Receipt

For a supplied article, make a concise page plan before composition. Record source section/paragraph IDs, text role and approximate length, image IDs with dimensions and crop constraints, page job, reading direction, selected structure, why it fits, and required adaptations. Link every required source block to a page or continuation. This is a traceability record, not permission to summarize an article without asking.

Separate hard constraints (complete copy, no-crop image, language direction, page format, chronological order, comparison relationships, caption/credit) from preferences (style, whitespace, approximate picture share). Reject a candidate that violates a hard constraint before comparing its appearance. Word/character counts are planning signals, not evidence of actual font fit.

## Small Candidate Set

| Material / page job | Start with |
|---|---|
| Continuous article, text-led opening | `portrait-magazine-essay`, `editorial-opener` |
| Continuous body reading | `editorial-longform-feature` continuation; L12 for landscape reference reading |
| Section plus wide image | `editorial-image-break` |
| Narrative plus genuinely secondary modules | `editorial-modular-rail` |
| Dense facing-page investigation | `magazine-investigative-feature` |
| Image-first single-page article | `portrait-social-feature`, `portrait-image-led-a4` or `portrait-adaptive-article-3x4`, according to destination |
| Essential uncropped square lead image | `portrait-image-cover-pair`, with complete body continuation |
| Visual opening with short copy | `portfolio-opener-hero-rail`; L09-A/L09-B for a ratio-partition chapter |
| Evidence with supporting details | `interior-proof-1plus3` or L03; subject matter remains user-defined |
| Explained gallery / mixed ratios | `caption-rail-gallery`, `controlled-masonry-gallery` |
| Comparison / process / data | L02/L35, `strip-narrative-process`, or the relevant native semantic structure |

These are starting candidates, not an exhaustive machine ranking. Read only their specifications. Reuse the previous selection for unchanged continuation pages. Inspect actual images rather than inferring their subject or crop safety from filenames.

## When to Create an Original Layout

If no candidate preserves the article and assets at readable size, identify the reason (for example synchronized bilingual notes, unusual uncropped panorama, footnotes tied to illustrations, or a fixed publication format). Design the necessary hierarchy and regions directly. A changed color or caption position is an adaptation, not a new structural family.

Record a project-local ID and contract: canvas, trim/safe/content frames, columns and gutters OR explicit partition ratio, baseline/line-height intent, source-block mapping, image fit/focal point, caption and footer regions, overflow/continuation rule. Generate guides from that contract. Produce one difficult page and its stress case before applying it across the article.

Compare reuse/adapt/new honestly: name the winning reasons and rejected hard constraints, not an unsupported “best match” score. A new original composition is part of completing the brief; adding it to the reusable public library requires separate review and authorization.

## Executable Planning Shortlist

Run `node <SKILL_ROOT>/scripts/layout-selection.mjs BRIEF.json`. Examples are in `examples/content-selection/`. The brief describes one page job, not an entire article forcibly fitted onto one page. Supply:

- `job`: opening, reading, section, gallery, process or comparison.
- `direction`: horizontal-ltr, vertical-rl or vertical-lr.
- `canvas`: positive width/height in the same unit.
- `blocks`: unique source IDs and complete `text` strings.
- `images`: unique IDs, positive width/height and explicit `fit` (contain or crop).
- Optional `requiredFeatures`: hard requirements not covered by base geometry; these conservatively require original design until a reviewed profile supports them.
- Optional `allowContinuation`: true permits a cover-plus-body sequence.

The first ten planning profiles cover common structures only. Unsupported directions/features return `original-required`, which is a handoff to the authoring workflow, not a claim that Folio cannot design that material. Scores describe shortlist preference, not probability, aesthetic quality or measured text capacity. All candidates require actual rendering. Source IDs/counts are retained for later page mapping, not proof of delivered content coverage.

Use `node <SKILL_ROOT>/scripts/profile-stages.mjs PLAN.json NEW-REPORT.json` for explicit command-stage timing. The example plan measures selection, offline checking and unit tests only. For a real project, add authorized authoring/render/export/QA commands separately. Inspect commands before execution; output captures may contain private copy. Reports refuse overwriting an existing file. A successful command or an existing output does not establish visual quality, freshness or target-app compatibility.

## Final Acceptance

- All required paragraphs, images, captions and credits are accounted for without duplication or omission.
- Reading order and image-text relationships remain meaningful.
- Real text fits at intended final size; long headings/credits have an explicit overflow plan.
- Picture treatment respects complete-view versus crop requirements; frame and guide geometry agree.
- Each requested format is rendered and its editability/compatibility status is stated separately.
