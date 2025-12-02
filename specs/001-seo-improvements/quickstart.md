# Quickstart: SEO Improvements

**Feature**: 001-seo-improvements
**Date**: 2025-12-02

## Prerequisites

- Node.js 18+ installed
- npm installed
- Project cloned and dependencies installed (`npm install`)

## Environment Setup

1. **Create environment file**:

```bash
cp .env.example .env
```

2. **Configure verification codes** (optional):

```bash
# .env
PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-code-here
PUBLIC_NAVER_SITE_VERIFICATION=your-naver-code-here
```

> Note: Leave empty or omit if you haven't registered with search consoles yet.

## Development

```bash
# Start development server
npm run dev

# Open http://localhost:4321 in browser
```

## Verification Steps

### 1. Check Meta Tags

Open browser DevTools (F12) → Elements tab → Inspect `<head>`:

```html
<!-- Expected meta tags -->
<title>평수 계산기 | 제곱미터를 평으로 변환</title>
<meta name="description" content="..." />
<meta property="og:title" content="..." />
<meta property="og:image" content="https://pyeongsu-calculator.kr/og-image.png" />
```

### 2. Check Structured Data

In DevTools Console, run:

```javascript
// List all JSON-LD schemas
document.querySelectorAll('script[type="application/ld+json"]')
  .forEach((s, i) => console.log(`Schema ${i}:`, JSON.parse(s.textContent)));
```

Expected schemas on homepage:
- WebApplication
- FAQPage
- HowTo

Expected schemas on guide pages:
- BlogPosting
- BreadcrumbList

### 3. Validate with External Tools

**Google Rich Results Test**:
1. Build the site: `npm run build`
2. Preview: `npm run preview`
3. Use ngrok or similar to expose localhost
4. Test at: https://search.google.com/test/rich-results

**Facebook Sharing Debugger**:
1. Deploy to staging/production
2. Test at: https://developers.facebook.com/tools/debug/

**Twitter Card Validator**:
1. Deploy to staging/production
2. Test at: https://cards-dev.twitter.com/validator

### 4. Run Tests

```bash
# Run E2E tests including SEO validation
npm run test:e2e

# Run specific SEO test (when implemented)
npx playwright test seo.spec.ts
```

## Validation Checklist

After implementation, verify:

- [x] Homepage has WebApplication, FAQPage, HowTo schemas (3 schemas verified)
- [x] Guide pages have BlogPosting, BreadcrumbList schemas (2 schemas verified)
- [x] All pages have og:image pointing to PNG file (https://pyeongsu-calculator.kr/og-image.png)
- [x] Verification codes appear when env vars are set (conditional rendering verified)
- [x] robots.txt is accessible at /robots.txt (User-agent, Allow, Sitemap)
- [x] sitemap-index.xml is accessible and lists all pages (16 pages)
- [ ] Lighthouse SEO score is 100/100 (requires deployment)
- [ ] No errors in Google Rich Results Test (requires deployment)

**Validation Date**: 2025-12-02
**E2E Test Results**: 70 SEO tests passed across 5 browsers (chromium, firefox, webkit, Mobile Chrome, Mobile Safari)

## Common Issues

### OG Image Not Showing

1. Verify `public/og-image.png` exists
2. Check file is valid PNG (not renamed SVG)
3. Clear social platform cache using their debug tools

### Cache Invalidation After OG Image Updates

Social platforms aggressively cache OG images. After updating `og-image.png`:

1. **Facebook**: Use [Sharing Debugger](https://developers.facebook.com/tools/debug/) → "Scrape Again"
2. **Twitter**: Use [Card Validator](https://cards-dev.twitter.com/validator) → re-validate URL
3. **KakaoTalk**: Clear chat cache or wait 24-48 hours for automatic refresh
4. **LinkedIn**: Use [Post Inspector](https://www.linkedin.com/post-inspector/) → refresh

> **Tip**: Consider versioning OG image URLs (e.g., `og-image.png?v=2`) to force cache bust.

### Verification Code Not Appearing

1. Ensure `.env` file exists in project root
2. Check variable name starts with `PUBLIC_`
3. Restart dev server after changing `.env`

### Schema Validation Errors

1. Check JSON-LD syntax in browser console
2. Ensure all required fields are present
3. Validate dates are ISO 8601 format

## Architecture Notes

### Server-Rendered Meta Tags (SSG Guarantee)

All SEO meta tags are **server-rendered at build time** by Astro's Static Site Generation (SSG):

- Meta tags are embedded directly in HTML files during `npm run build`
- No JavaScript execution required for search engines to read meta tags
- If JavaScript fails to load, all SEO functionality remains intact
- Schema.org JSON-LD blocks are static HTML, not dynamically injected

This architecture ensures:
- Search engine crawlers see all SEO content immediately
- Social platform scrapers can parse OG tags without JavaScript
- Core Web Vitals are not impacted by meta tag rendering

### noindex Behavior

Currently, all pages are indexed (`robots: index, follow`). If pages requiring noindex are added:
1. Add `noindex` prop to `SEOHead.astro` component
2. Pass `robots="noindex, follow"` for specific pages
3. Verify in robots.txt that private paths are blocked

## Next Steps

After completing this feature:

1. Submit sitemap to Google Search Console
2. Submit sitemap to Naver Search Advisor
3. Monitor indexing status over 2-4 weeks
4. Check for rich result appearances
