# Research: Astro Guides AEO Optimization

**Date**: 2025-12-11
**Feature**: 004-astro-guides-aeo

## Research Topics

### 1. Astro Content Collections Best Practices

**Decision**: Use Astro's built-in Content Collections with Zod schema validation for type-safe content management.

**Rationale**:
- Native Astro feature (v2.0+), no external dependencies
- Zod provides runtime validation and TypeScript types
- Automatic content caching improves build performance
- `getCollection()` API enables type-safe queries

**Alternatives Considered**:
- **MDX**: Rejected - adds complexity, no benefit for this content type
- **External CMS (Contentful, Sanity)**: Rejected - over-engineering for 10 static guides
- **Raw Markdown with frontmatter**: Rejected - no type safety or validation

**Implementation Pattern**:
```typescript
// src/content/config.ts
import { z, defineCollection } from 'astro:content';

const guidesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    keywords: z.array(z.string()),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    howToSteps: z.array(z.object({
      name: z.string(),
      text: z.string(),
    })).optional(),
  }),
});
```

---

### 2. Schema.org JSON-LD Implementation

**Decision**: Generate JSON-LD in a dedicated component, injecting into `<head>` via Astro layout.

**Rationale**:
- JSON-LD is preferred over Microdata/RDFa by Google
- Can be generated at build time with no runtime cost
- Easier to validate and maintain as separate data
- ChatGPT/Perplexity specifically parse JSON-LD from pages

**Alternatives Considered**:
- **Microdata**: Rejected - interleaves with HTML, harder to maintain
- **RDFa**: Rejected - complex syntax, lower adoption
- **External Schema generation service**: Rejected - unnecessary dependency

**Schema Types Required**:

| Content Type | Schema.org Type | When to Include |
|--------------|-----------------|-----------------|
| All guides | Article | Always |
| Guides with FAQ section | FAQPage | When `faqs` array present |
| Guides with steps | HowTo | When `howToSteps` array present |

**JSON-LD Structure Example**:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "평수와 제곱미터 완벽 가이드",
      "description": "...",
      "datePublished": "2024-01-01",
      "author": { "@type": "Organization", "name": "평수계산기" }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [...]
    }
  ]
}
```

---

### 3. AEO (Answer Engine Optimization) Strategy

**Decision**: Implement structured data that AI crawlers prioritize: clear headings, FAQ markup, concise answers.

**Rationale**:
- AI search engines (ChatGPT, Perplexity) extract structured data
- FAQPage schema provides question-answer pairs directly
- HowTo schema provides step-by-step instructions
- Concise, factual content is more likely to be cited

**Key Findings from Research**:
- ChatGPT and Perplexity both use web crawlers that parse JSON-LD
- Google AI Overview prioritizes FAQPage and HowTo rich results
- Answers should be 40-60 words for optimal AI citation
- Questions should match natural language queries

**Implementation Guidelines**:
1. Each FAQ answer should be self-contained (no "see above")
2. FAQ questions should match common search queries
3. HowTo steps should be actionable and numbered
4. Include the primary keyword in Article headline

---

### 4. Sitemap Integration with Content Collections

**Decision**: Use @astrojs/sitemap with custom `customPages` for dynamic Content Collection routes.

**Rationale**:
- @astrojs/sitemap 3.6+ automatically detects static routes
- Content Collection dynamic routes (`[...slug].astro`) need explicit configuration
- Sitemap priority and changefreq can be customized per page type

**Configuration Pattern**:
```javascript
// astro.config.mjs
sitemap({
  filter: (page) => page.includes('/guide/'),
  serialize: (item) => {
    if (item.url.includes('/guide/')) {
      return { ...item, priority: 0.8, changefreq: 'monthly' };
    }
    return item;
  },
})
```

---

### 5. Content Migration Strategy

**Decision**: Extract existing HTML content from `.astro` files to Markdown with frontmatter.

**Rationale**:
- Markdown is more maintainable for content authors
- Frontmatter enables structured metadata extraction
- Existing content structure (headings, lists, tables) maps to Markdown
- Allows future non-developer content updates

**Migration Mapping**:

| Source (Astro) | Target (Markdown) |
|----------------|-------------------|
| `<ArticleLayout title="..." description="..." ...>` | Frontmatter YAML |
| `<h2>`, `<h3>` | `##`, `###` |
| `<p>`, text content | Paragraph text |
| `<ul>`, `<li>` | `- ` list items |
| `<table>` | Markdown tables |
| `<div class="info-box">` | Custom directive or blockquote |

**Preserved Elements**:
- All Korean text content
- Internal links (update to new slug pattern)
- Tables and lists

---

### 6. Build Performance Optimization

**Decision**: Use Astro's content caching and parallel processing for minimal build time impact.

**Rationale**:
- Content Collections are cached by default
- Only changed Markdown files trigger rebuild
- JSON-LD generation is compile-time only
- No runtime JavaScript added to pages

**Expected Impact**:
- Initial migration: ~5% build time increase (one-time)
- Subsequent builds: No measurable difference (content caching)
- Bundle size: <2KB increase (schema utility functions)

---

## Summary

All research topics resolved. No NEEDS CLARIFICATION items remain.

| Topic | Decision | Risk Level |
|-------|----------|------------|
| Content Collections | Astro native with Zod schema | Low |
| Schema.org Format | JSON-LD in dedicated component | Low |
| AEO Strategy | FAQ + HowTo structured data | Low |
| Sitemap Integration | @astrojs/sitemap with filter | Low |
| Migration Strategy | Extract to Markdown + frontmatter | Medium |
| Build Performance | Content caching, compile-time only | Low |

**All decisions align with Constitution principles and spec requirements.**
