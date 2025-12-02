# Implementation Plan: SEO Improvements

**Branch**: `001-seo-improvements` | **Date**: 2025-12-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-seo-improvements/spec.md`

## Summary

Enhance the existing SEO infrastructure to improve search engine visibility and social media sharing. The project already has substantial SEO implementation (meta tags, Open Graph, Twitter cards, structured data schemas, sitemap, robots.txt). This feature focuses on:

1. **Search Console Integration**: Replace placeholder verification codes with environment variable configuration
2. **OG Image Optimization**: Convert SVG OG image to PNG/JPG format for broader platform compatibility
3. **Guide Content Enhancement**: Add Article/BlogPosting schema and BreadcrumbList schema for guide pages
4. **Quality Assurance**: Validate all pages pass Rich Results Test and social sharing validators

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Astro 4.x, React 18, Tailwind CSS, @astrojs/sitemap
**Storage**: N/A (static site, no database)
**Testing**: Vitest (unit/component), Playwright (E2E)
**Target Platform**: Web browsers (static HTML deployment on Cloudflare Pages)
**Project Type**: Web application (Astro with React islands)
**Performance Goals**: Lighthouse SEO score 100/100, LCP < 2.5s, CLS < 0.1
**Constraints**: Static site generation, no server-side runtime
**Scale/Scope**: ~25 pages (1 calculator, 10+ guide articles, legal pages)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Compliance | Notes |
|-----------|-------------|------------|-------|
| I. User Experience First | Intuitive without documentation | ✅ PASS | SEO improvements are invisible to users; improves discoverability |
| II. Type Safety | TypeScript strict mode, explicit types | ✅ PASS | All new components will have typed props interfaces |
| III. Test Coverage | Tests for business logic and interactions | ✅ PASS | E2E tests will validate meta tags and structured data presence |
| IV. Accessibility | WCAG 2.1 AA, keyboard navigable | ✅ PASS | No accessibility impact; meta tags don't affect UI |
| V. Performance | LCP < 2.5s, CLS < 0.1, bundle monitoring | ✅ PASS | Static meta tags add minimal overhead; image optimization improves load |

**Gate Status**: ✅ PASSED - All principles satisfied, no violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-seo-improvements/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A for SEO - no API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── seo/
│       ├── SEOHead.astro          # Existing - update for env vars
│       ├── SchemaMarkup.astro     # Existing - add Article, BreadcrumbList
│       └── BreadcrumbSchema.astro # New - reusable breadcrumb component
├── layouts/
│   ├── BaseLayout.astro           # Existing - verify SEO component usage
│   └── ArticleLayout.astro        # Existing - add Article schema
├── pages/
│   ├── guide/                     # Existing - add breadcrumb and article schemas
│   └── robots.txt.ts              # Existing - verified working
└── env.d.ts                       # Existing - add env type declarations

public/
├── og-image.png                   # New - replace SVG with PNG
└── favicon.svg                    # Existing - no change

tests/
├── e2e/
│   └── seo.spec.ts                # New - E2E validation of meta tags
```

**Structure Decision**: Uses existing Astro static site structure. SEO components are centralized in `src/components/seo/`. No new directories needed except test file.

## Complexity Tracking

> No violations - this section is intentionally empty.
