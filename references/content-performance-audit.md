# Content Selection and Performance Audit

Date: 2026-10-20. Local changes; not a published release.

## Findings and Changes

- The entrypoint previously loaded about 32 KB of instructions, mixed topic-only defaults with supplied articles, and required external inspiration research. The new entrypoint is about 7 KB; detailed workflows are retained as an on-demand reference. This reduces instruction volume, not a measured end-to-end runtime by the same percentage.
- Article structure, image roles, crop constraints and requested formats now precede styling. Shortlist relevant existing layouts; adapt or create an original project-local composition when hard requirements fail. This is an agent selection workflow, not an automatic exhaustive ranking engine.
- Update-check failures were not cached; cached successes could still trigger remote Git checks. Success and failure caches now suppress repeated requests, scoped to the manifest URL. Remote work has a 3-second budget; offline mode explicitly leaves remote status unknown. The observed DNS failure during this audit returned in about 0.23 seconds, so DNS alone does not explain prolonged authoring.
- Verification previously regenerated PPTX implicitly. It now verifies the existing file by default; `--export` requests regeneration explicitly and `--html-only` skips PPTX.
- The interactive decision script used callback-style invocation with Promise-based readline and shadowed the path resolver with a Promise resolver. Both are fixed; non-interactive invocation fails early with batch/quick guidance.

## Evidence

Ten Node tests pass, covering cache scope/expiry/failures, request deadline, synchronous network errors, offline reporting and verification argument modes. Skill frontmatter validation passes. An interactive PTY session completed all decisions and generated theme code successfully. Quick mode and syntax checks pass.

No browser rendering or PowerPoint/PDF target-application validation was performed for this change. Existing publication exporter work was left untouched. No content was deleted or published.

## Follow-up Implementation

Added an executable shortlist across ten explicitly scoped planning profiles. It validates source IDs, dimensions, reading direction and image treatment; returns up to three candidates with adaptation/rejection reasons, or requests original design when unsupported. It does not automatically compose a new layout, measure font fit or rank the entire visual catalogue.

Added a sequential command-stage profiler with deadlines, exit statuses, captured output, fail-fast behavior and report-overwrite protection. The first five-stage fixture run measured article selection at 61.5 ms, panorama selection at 48.8 ms, original fallback at 48.0 ms, offline update at 64.8 ms and regression tests at 326.0 ms (549.1 ms total). These include process startup and are not an end-to-end authoring benchmark.

The legacy verifier now shares one page/navigation for structure and text checks instead of two browser sessions, and closes the browser in a finally block. Mock lifecycle tests verify reuse/cleanup, not real browser compatibility. Twenty tests pass across matching, profiling, session lifecycle, update caching and verification modes. Full rendering/export/target-app timing remains outstanding.

## Next Measurement

Use the same source article and images for repeated runs, recording intake, reference reads, planning, asset preparation, authoring, format generation and QA separately. Compare content coverage, overflow and image crops alongside elapsed time. Remaining potential costs include image generation/download, network fonts, browser startup, format conversion and visual QA; they have not been isolated or benchmarked here.
