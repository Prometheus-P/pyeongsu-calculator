# Quickstart: Astro Guides AEO Optimization

**Feature**: 004-astro-guides-aeo
**Date**: 2025-12-11

## TL;DR

Migrate 10 guide pages to Astro Content Collections and add Schema.org JSON-LD for AEO optimization.

## Key Files

| File | Action | Purpose |
|------|--------|---------|
| `src/content/config.ts` | CREATE | Content Collection schema (Zod) |
| `src/content/guides/*.md` | CREATE | 10 migrated guide Markdown files |
| `src/pages/guide/[...slug].astro` | CREATE | Dynamic route for guides |
| `src/pages/guide/index.astro` | MODIFY | Query from Content Collections |
| `src/components/seo/SchemaMarkup.astro` | MODIFY | Add Article/FAQ/HowTo schemas |
| `src/layouts/GuideLayout.astro` | CREATE | Layout for Content Collection guides |
| `src/utils/schema.ts` | CREATE | Schema generation utilities |
| `src/pages/guide/*.astro` | DELETE | Remove 10 old static guide files |

## Implementation Pattern

### 1. Content Collection Schema

```typescript
// src/content/config.ts
import { z, defineCollection } from 'astro:content';

const guidesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(100).max(160),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    canonical: z.string().url(),
    keywords: z.array(z.string()).min(3).max(7),
    faqs: z.array(z.object({
      question: z.string().endsWith('?'),
      answer: z.string().min(30),
    })).optional(),
    howToSteps: z.array(z.object({
      name: z.string(),
      text: z.string(),
    })).min(2).optional(),
  }),
});

export const collections = { guides: guidesCollection };
```

### 2. Dynamic Route

```astro
---
// src/pages/guide/[...slug].astro
import { getCollection } from 'astro:content';
import GuideLayout from '../../layouts/GuideLayout.astro';

export async function getStaticPaths() {
  const guides = await getCollection('guides');
  return guides.map(guide => ({
    params: { slug: guide.slug },
    props: { guide },
  }));
}

const { guide } = Astro.props;
const { Content } = await guide.render();
---

<GuideLayout guide={guide}>
  <Content />
</GuideLayout>
```

### 3. Schema Generation

```typescript
// src/utils/schema.ts
export function generateArticleSchema(guide: Guide): object {
  return {
    "@type": "Article",
    "@id": `${guide.data.canonical}#article`,
    headline: guide.data.title,
    description: guide.data.description,
    datePublished: guide.data.publishDate.toISOString(),
    dateModified: guide.data.updatedDate?.toISOString(),
    author: {
      "@type": "Organization",
      name: "평수계산기",
      url: "https://pyeongsu-calculator.kr"
    },
    publisher: {
      "@type": "Organization",
      name: "평수계산기",
      logo: {
        "@type": "ImageObject",
        url: "https://pyeongsu-calculator.kr/logo.png"
      }
    }
  };
}

export function generateFAQSchema(faqs: FAQItem[]): object {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function generateHowToSchema(guide: Guide): object {
  return {
    "@type": "HowTo",
    name: guide.data.title,
    description: guide.data.description,
    step: guide.data.howToSteps?.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text
    }))
  };
}
```

### 4. JSON-LD Output in Layout

```astro
---
// src/layouts/GuideLayout.astro
import { generateArticleSchema, generateFAQSchema, generateHowToSchema } from '../utils/schema';

const { guide } = Astro.props;

const schemas = [generateArticleSchema(guide)];
if (guide.data.faqs?.length) {
  schemas.push(generateFAQSchema(guide.data.faqs));
}
if (guide.data.howToSteps?.length) {
  schemas.push(generateHowToSchema(guide));
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": schemas
};
---

<html>
<head>
  <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  <!-- other head content -->
</head>
<body>
  <slot />
</body>
</html>
```

## Validation Checklist

- [ ] Content Collection schema defined in `src/content/config.ts`
- [ ] All 10 guide Markdown files created with valid frontmatter
- [ ] Dynamic route `[...slug].astro` generates all guide pages
- [ ] JSON-LD appears in page source with Article schema
- [ ] FAQPage schema present when guide has FAQs
- [ ] HowTo schema present when guide has steps
- [ ] Google Rich Results Test passes for all guides
- [ ] sitemap.xml includes all guide URLs
- [ ] Build time is within 30% of baseline

## Quick Tests

```bash
# Build and check for errors
npm run build

# Preview and check a guide page source
npm run preview
# Open browser DevTools → View Page Source → Search for "application/ld+json"

# Validate schema (manual)
# 1. Copy JSON-LD from page source
# 2. Paste into https://validator.schema.org/
# 3. Verify no errors

# Validate rich results (manual)
# 1. Run preview: npm run preview
# 2. Use Google Rich Results Test with localhost URL
```

## Migration Steps (Per Guide)

1. **Extract frontmatter** from `<ArticleLayout>` props
2. **Convert HTML to Markdown** (headings, lists, tables)
3. **Identify FAQ content** in existing page → add to `faqs` array
4. **Identify step-by-step content** → add to `howToSteps` array
5. **Save as** `src/content/guides/{slug}.md`
6. **Delete** old `src/pages/guide/{slug}.astro`
7. **Verify** page renders correctly at `/guide/{slug}`

## Do NOT

- Delete the old guide files until new ones are verified
- Add runtime JavaScript for schema generation
- Hardcode schema data in layout (use utilities)
- Skip frontmatter validation (Zod will catch errors at build)
- Forget to update internal links to new URL pattern
