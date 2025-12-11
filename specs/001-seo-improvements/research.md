# Research: SEO Improvements

**Feature**: 001-seo-improvements
**Date**: 2025-12-02
**Status**: Complete

## Research Topics

### 1. Environment Variable Configuration for Verification Codes

**Decision**: Use Astro's built-in environment variable system with `import.meta.env`

**Rationale**:
- Astro supports `PUBLIC_` prefixed environment variables that are exposed to client-side code
- Verification codes are not sensitive (they're visible in page source anyway)
- Build-time substitution ensures values are baked into static HTML
- Supports `.env`, `.env.local`, and deployment platform environment variables

**Alternatives Considered**:
- Runtime environment injection: Rejected - not compatible with static site generation
- Hardcoded values with gitignore: Rejected - complicates deployment across environments
- Configuration file: Rejected - adds unnecessary complexity for two values

**Implementation**:
```typescript
// src/env.d.ts
interface ImportMetaEnv {
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION: string;
  readonly PUBLIC_NAVER_SITE_VERIFICATION: string;
}

// .env.example
PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-code
PUBLIC_NAVER_SITE_VERIFICATION=your-naver-verification-code
```

### 2. OG Image Format and Dimensions

**Decision**: Create PNG image at 1200x630px with fallback handling

**Rationale**:
- PNG format is universally supported across all social platforms
- 1200x630px is the recommended Open Graph image size (1.91:1 aspect ratio)
- Facebook, Twitter, KakaoTalk, and LinkedIn all support this format
- SVG is not rendered by most social media crawlers

**Alternatives Considered**:
- Keep SVG with PNG fallback: Rejected - adds complexity, SVG rarely used as OG image
- JPG format: Viable alternative but PNG offers better quality for graphics/text
- WebP format: Rejected - not universally supported by all crawlers

**Implementation**:
- Create `public/og-image.png` at 1200x630px
- Update `SEOHead.astro` to reference PNG instead of SVG
- Keep SVG as favicon only

### 3. Article Schema for Guide Pages

**Decision**: Use BlogPosting schema with author, datePublished, dateModified

**Rationale**:
- BlogPosting is more appropriate than Article for guide content
- Google recognizes BlogPosting for potential rich results
- Schema.org recommends BlogPosting for informational/how-to content
- Supports breadcrumb integration via isPartOf

**Alternatives Considered**:
- Article schema: Viable but BlogPosting is more specific to guides
- TechArticle schema: Rejected - too narrow for general real estate guides
- WebPage schema: Rejected - less rich data opportunity

**Implementation**:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Article Title",
  "description": "Article description",
  "author": {
    "@type": "Organization",
    "name": "평수 계산기"
  },
  "publisher": {
    "@type": "Organization",
    "name": "평수 계산기",
    "url": "https://pyeongsu-calculator.kr"
  },
  "datePublished": "2025-01-01",
  "dateModified": "2025-01-15",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://pyeongsu-calculator.kr/guide/article-slug"
  }
}
```

### 4. BreadcrumbList Schema

**Decision**: Implement BreadcrumbList as reusable Astro component

**Rationale**:
- BreadcrumbList schema enables breadcrumb rich results in Google
- Improves site hierarchy understanding for search engines
- Helps users understand navigation context in search results
- Can be generated automatically from URL path

**Alternatives Considered**:
- Manual breadcrumb definition per page: Rejected - error-prone, hard to maintain
- Navigation menu as breadcrumb: Rejected - doesn't reflect actual hierarchy
- Third-party library: Rejected - overkill for simple static site structure

**Implementation**:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "홈",
      "item": "https://pyeongsu-calculator.kr"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "가이드",
      "item": "https://pyeongsu-calculator.kr/guide"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "평수 제곱미터 변환 가이드",
      "item": "https://pyeongsu-calculator.kr/guide/pyeong-sqm-guide"
    }
  ]
}
```

### 5. E2E Testing Strategy for SEO

**Decision**: Use Playwright to validate meta tags and structured data in built HTML

**Rationale**:
- Playwright can inspect rendered HTML including head elements
- Tests run against built site, ensuring static generation works correctly
- Can validate JSON-LD parsing without external tools
- Integrates with existing test infrastructure

**Alternatives Considered**:
- Unit tests for schema generation: Useful but doesn't validate final output
- Manual validation with Google tools: Time-consuming, not automated
- Lighthouse CI: Good for scores but not detailed schema validation

**Implementation**:
```typescript
test('homepage has correct meta tags', async ({ page }) => {
  await page.goto('/');

  // Check title
  await expect(page).toHaveTitle(/평수 계산기/);

  // Check OG tags
  const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
  expect(ogTitle).toBeTruthy();

  // Check structured data
  const jsonLd = await page.evaluate(() => {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    return Array.from(scripts).map(s => JSON.parse(s.textContent || '{}'));
  });
  expect(jsonLd.some(s => s['@type'] === 'WebApplication')).toBe(true);
});
```

## Summary of Decisions

| Topic | Decision | Key Rationale |
|-------|----------|---------------|
| Verification Codes | Astro `import.meta.env` with PUBLIC_ prefix | Build-time substitution, deployment flexibility |
| OG Image | PNG at 1200x630px | Universal platform support |
| Article Schema | BlogPosting with author/dates | Best fit for guide content, rich result potential |
| Breadcrumb Schema | Reusable Astro component | Maintainability, automatic hierarchy |
| Testing | Playwright E2E | Validates final built output |

## Dependencies Identified

- No new npm dependencies required
- Existing Astro environment system handles verification codes
- Existing Playwright setup handles E2E tests
- Image creation is a manual/design task (not code dependency)
