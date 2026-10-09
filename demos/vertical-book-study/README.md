# Paper, Ink and Words

Eight-page contemporary Traditional Chinese editorial demo, with new AI-generated paper/book and ink/tool still-life illustrations. No old architecture imagery is reused. The writing is an original design essay, not a sourced history of printing.

- index.html: responsive 4:5 gallery.
- index.html?mode=slides: keyboard/button-controlled 16:9 HTML presentation.
- images/01.png through 08.png: social publishing order.
- social.pdf: eight-page 4:5 proof.
- slides.pdf: eight-page 16:9 presentation proof.

The main entry is a Chinese-only essay. The [independent Mongolian edition](mongolian/index.html) contains eight thematic draft pages using different images, with a [16:9 presentation](mongolian/index.html?mode=slides). Both editions have navigation links to each other. The Mongolian text is an unreviewed AI short adaptation, not a complete or certified translation; figure captions remain untranslated. The user accepted this as a demonstration, not a final publication. Visible production disclaimers were removed at user request, but the still-life assets remain AI-generated illustrative images, not documentary photographs. Disclose AI imagery in publishing metadata/caption when appropriate to the destination platform.

Sources: https://www.w3.org/International/articles/vertical-text/ and https://www.w3.org/TR/mlreq/ . Font: Noto Sans Mongolian, OFL license supplied in assets/OFL.txt.

## QA / 2026-10-09

Both aspect ratios pass browser checks for copy/title/content overflow and local image loading. Mobile gallery and presentation next-page control checked. Both delivered PDFs contain eight pages. Social cover/closing PNGs and the presentation cover PDF were visually sampled; full print/native-editor acceptance is not claimed. Chromium produced an extra blank trailing sheet for the social export; the delivered PDF explicitly selects content pages 1-8.

Chinese gallery order is right to left, with the left arrow advancing in presentation mode. Mongolian order is left to right, with the right arrow advancing. The verification script checks canvas alignment, navigation and overflow and regenerates PDFs and Mongolian page images. Run `node demos/vertical-book-study/verify-editions.cjs` from the Folio repository after installing its dependencies. Set `FOLIO_BROWSER_CHANNEL` if another supported browser channel is needed. Chinese page PNGs are preserved from the reviewed export; the script does not regenerate those.

## Storage

HTML, article drafts, fonts and assets are source inputs. PDF and page PNG files are review deliverables, retained deliberately. `verify-editions.cjs` is a reproducible process record, not disposable test clutter. Historical copies live outside the repository in the local archive. No source, unique asset or deliverable should be deleted solely because it is large.
