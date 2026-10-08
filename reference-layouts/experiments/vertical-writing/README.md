# Vertical Writing Study

Open [the four-page browser study](index.html). The experiment contains an opener and a continuation page for Chinese and traditional Mongolian. These pages are separate from the production layout catalogue.

## Layout Contract

Each page uses a fixed 794 x 1123 CSS-pixel A4 canvas. Preview resizing scales the complete canvas; it does not change the internal column width or copy. The dotted guide marks the content frame, 60 CSS pixels inside the page edge. The black outline is the page edge. No bleed is configured for this study.

Chinese uses `writing-mode: vertical-rl`: text runs down the page and columns progress right to left. Traditional Mongolian uses `vertical-lr`: columns progress left to right. This follows [W3C vertical-text guidance](https://www.w3.org/International/articles/vertical-text/) and [CSS Writing Modes Level 4](https://www.w3.org/TR/css-writing-modes-4/).

The Chinese copy is neutral test text, including brackets, punctuation, Latin letters and a two-digit `text-combine-upright` example. The Mongolian copy repeats the two short mixed-script examples from the W3C guidance to test shaping, Mongolian vowel separator U+180E, punctuation and Latin orientation. It is not a commissioned article or a language-reviewed translation. Do not remove Mongolian separators or split words into individually positioned glyphs.

Placeholder paragraphs fill the available column width using measured browser layout. Continuation pages reserve a separate image/note rail. Image assets are reused from the existing editorial demo with its original attribution and license; they are layout test imagery.

## Font

The bundled font is [Noto Sans Mongolian](https://github.com/notofonts/mongolian), obtained from the project's [official font distribution](https://notofonts.github.io/mongolian/). Its SIL Open Font License is included in [fonts/OFL.txt](fonts/OFL.txt). The HTML loads it locally with `@font-face`; no network request is required to view the study.

Font SHA-256: `839058b450a76096c6321ba3be2ad88e293386e0f24d189f540c2c5ce696fa38`.

Chinese uses the available system serif font (`Songti SC` on the tested Mac). Exact Chinese font metrics on other systems are not yet standardized.

## Verification / 2026-10-08

- Chrome desktop at 1600 x 1100 and mobile at 390 x 844: all four pages remain within their page edges, with no body-copy overflow or horizontal document scroll.
- Both continuations preserve their image rails; all four images load successfully.
- Mongolian local font loads successfully; each script uses its required column direction.
- Script filtering and content-guide toggle work. No JavaScript errors were observed.
- Four individual page screenshots and all four rendered PDF pages were visually reviewed. The experimental Chrome PDF contains four approximately A4 pages; Chromium rounds its paper dimensions slightly. The Mongolian and Chinese body fonts are embedded in this test PDF.

## Before Production Integration

Review Mongolian spelling, joining, variant forms and punctuation with a fluent reader. Check Chinese font and vertical punctuation in the chosen publication font. Verify both scripts in the target editor before claiming editable Figma or IDML support. InDesign native validation remains deferred until access is restored. Browser PDF output is only a test proof; printing specifications and editable-export acceptance have not been established for this experiment.
