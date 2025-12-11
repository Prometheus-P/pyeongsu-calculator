# Implementation Plan: Astro Guides AEO Optimization

**Branch**: `004-astro-guides-aeo` | **Date**: 2025-12-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-astro-guides-aeo/spec.md`

## Summary

Migrate 10 existing guide pages from static `.astro` files to Astro Content Collections with Markdown-based content. Implement Schema.org structured data (Article, FAQPage, HowTo) in JSON-LD format for Answer Engine Optimization (AEO), enabling AI search engines like ChatGPT and Perplexity to cite the content as authoritative sources.

## Technical Context

**Language/Version**: TypeScript 5.5, Astro 4.16
**Primary Dependencies**: Astro Content Collections (built-in), Zod (built-in via Astro), @astrojs/sitemap 3.6
**Storage**: N/A (static site, content in Markdown files)
**Testing**: Vitest 2.0.5, Google Rich Results Test, Schema.org Validator
**Target Platform**: Web (Static HTML, SSG via Astro)
**Project Type**: Web application (Astro + React Islands)
**Performance Goals**: Build time <30% increase, Core Web Vitals maintained
**Constraints**: <5KB bundle increase for schema components, no runtime dependencies
**Scale/Scope**: 10 guide pages, ~120KB total content, FAQPage + Article + HowTo schemas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. User-Centric Design | ☑ Pass | Schema markup improves discoverability; no UI changes required |
| II. Progressive Enhancement | ☑ Pass | JSON-LD is in `<script>` tags, invisible to users; content works without JS |
| III. Performance First | ☑ Pass | Static generation, no runtime overhead; <5KB increase for schema components |
| IV. Code Quality | ☑ Pass | TypeScript schemas with Zod validation; ESLint/Prettier compliance |
| V. Maintainability | ☑ Pass | Markdown content separated from layout; schema generation centralized |

## Project Structure

### Documentation (this feature)

```text
specs/004-astro-guides-aeo/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── content/
│   ├── config.ts                    # NEW: Content Collections schema (Zod)
│   └── guides/                      # NEW: Guide Markdown files (migrated)
│       ├── pyeong-sqm-guide.md
│       ├── apartment-size-guide.md
│       ├── exclusive-vs-supply-area.md
│       ├── calculate-actual-area.md
│       ├── contract-area-check.md
│       ├── furniture-layout-by-size.md
│       ├── officetel-area-guide.md
│       ├── real-estate-terms.md
│       ├── studio-to-three-room.md
│       └── world-area-units.md
├── components/
│   └── seo/
│       ├── SchemaMarkup.astro       # MODIFY: Add Article/FAQ/HowTo schema
│       └── SEOHead.astro            # PRESERVE: Existing meta tags
├── layouts/
│   └── GuideLayout.astro            # NEW: Layout for Content Collection guides
├── pages/
│   └── guide/
│       ├── index.astro              # MODIFY: List from Content Collections
│       └── [...slug].astro          # NEW: Dynamic route for guides
└── utils/
    └── schema.ts                    # NEW: Schema generation utilities

tests/
└── (existing structure - schema validation via external tools)
```

**Structure Decision**: Web application with Content Collections. Migrate existing `/pages/guide/*.astro` files to `/content/guides/*.md` with frontmatter schema. Dynamic routing via `[...slug].astro` pattern.

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
