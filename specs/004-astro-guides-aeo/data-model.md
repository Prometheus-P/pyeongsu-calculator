# Data Model: Astro Guides AEO Optimization

**Date**: 2025-12-11
**Feature**: 004-astro-guides-aeo

## Overview

This feature uses Astro Content Collections with Zod schema validation for type-safe content management. All data is stored as Markdown files with YAML frontmatter, compiled to static HTML at build time.

## Entity Definitions

### 1. Guide

**Type**: Content Collection Entry
**Purpose**: A single educational guide about real estate area measurements

```typescript
interface Guide {
  // Frontmatter fields (YAML)
  title: string;              // Page title and Article headline
  description: string;        // Meta description and Article description
  publishDate: Date;          // Original publication date
  updatedDate?: Date;         // Last modification date (optional)
  keywords: string[];         // SEO keywords array
  canonical: string;          // Canonical URL
  faqs?: FAQItem[];           // Optional FAQ section
  howToSteps?: HowToStep[];   // Optional step-by-step instructions

  // Computed/derived
  slug: string;               // URL-safe identifier (from filename)
  body: string;               // Markdown content (compiled to HTML)
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Article headline, max 60 chars for SEO |
| `description` | string | Yes | Meta description, 150-160 chars |
| `publishDate` | Date | Yes | ISO 8601 format (YYYY-MM-DD) |
| `updatedDate` | Date | No | Only if content was modified |
| `keywords` | string[] | Yes | 3-7 keywords for SEO |
| `canonical` | string | Yes | Full canonical URL |
| `faqs` | FAQItem[] | No | Triggers FAQPage schema generation |
| `howToSteps` | HowToStep[] | No | Triggers HowTo schema generation |

---

### 2. FAQItem

**Type**: Nested object in Guide frontmatter
**Purpose**: A question-answer pair for FAQPage schema

```typescript
interface FAQItem {
  question: string;   // The question (should match natural search queries)
  answer: string;     // Concise answer (40-60 words recommended for AEO)
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question` | string | Yes | Natural language question |
| `answer` | string | Yes | Self-contained answer |

**Validation Rules**:
- Question must end with `?`
- Answer should be 30-100 words (warning if exceeded)
- Answer must not contain references like "see above"

---

### 3. HowToStep

**Type**: Nested object in Guide frontmatter
**Purpose**: A single step in a HowTo schema

```typescript
interface HowToStep {
  name: string;   // Step title (e.g., "Step 1: Calculate the area")
  text: string;   // Step description/instructions
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Short step title |
| `text` | string | Yes | Detailed step instructions |

**Validation Rules**:
- Steps are ordered by array position
- Each step should be actionable
- Minimum 2 steps if howToSteps is present

---

### 4. ArticleSchema (Output)

**Type**: JSON-LD output
**Purpose**: Schema.org Article markup for search engines

```typescript
interface ArticleSchema {
  "@type": "Article";
  "@id": string;              // Canonical URL with #article
  headline: string;           // Guide title
  description: string;        // Guide description
  datePublished: string;      // ISO 8601 date
  dateModified?: string;      // ISO 8601 date
  author: {
    "@type": "Organization";
    name: string;             // "평수계산기"
    url: string;              // Site URL
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
}
```

---

### 5. FAQPageSchema (Output)

**Type**: JSON-LD output
**Purpose**: Schema.org FAQPage markup for rich results

```typescript
interface FAQPageSchema {
  "@type": "FAQPage";
  "@id": string;              // Canonical URL with #faq
  mainEntity: Array<{
    "@type": "Question";
    name: string;             // The question
    acceptedAnswer: {
      "@type": "Answer";
      text: string;           // The answer
    };
  }>;
}
```

---

### 6. HowToSchema (Output)

**Type**: JSON-LD output
**Purpose**: Schema.org HowTo markup for step-by-step instructions

```typescript
interface HowToSchema {
  "@type": "HowTo";
  "@id": string;              // Canonical URL with #howto
  name: string;               // Guide title
  description: string;        // Guide description
  step: Array<{
    "@type": "HowToStep";
    position: number;         // 1-indexed step number
    name: string;             // Step title
    text: string;             // Step instructions
  }>;
}
```

---

## Relationships

```
┌─────────────────────────────────────────────────────────┐
│                    Guide (Markdown)                      │
│              src/content/guides/*.md                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontmatter (YAML)              Body (Markdown)         │
│  ├── title                       └── HTML content        │
│  ├── description                                         │
│  ├── publishDate                                         │
│  ├── keywords[]                                          │
│  ├── faqs[]  ─────────────────┐                         │
│  │   ├── question             │                         │
│  │   └── answer               │                         │
│  └── howToSteps[] ────────────┼─┐                       │
│      ├── name                 │ │                       │
│      └── text                 │ │                       │
│                               │ │                       │
└───────────────────────────────┼─┼───────────────────────┘
                                │ │
                                ▼ ▼
┌─────────────────────────────────────────────────────────┐
│              Generated JSON-LD (Build Time)              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  {                                                       │
│    "@context": "https://schema.org",                    │
│    "@graph": [                                          │
│      ArticleSchema (always),                            │
│      FAQPageSchema (if faqs present),                   │
│      HowToSchema (if howToSteps present)                │
│    ]                                                     │
│  }                                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Content Collection Schema (Zod)

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

---

## Migration Mapping

### Existing Guide Files → Content Collection

| Existing File | New Content File |
|---------------|------------------|
| `src/pages/guide/pyeong-sqm-guide.astro` | `src/content/guides/pyeong-sqm-guide.md` |
| `src/pages/guide/apartment-size-guide.astro` | `src/content/guides/apartment-size-guide.md` |
| `src/pages/guide/exclusive-vs-supply-area.astro` | `src/content/guides/exclusive-vs-supply-area.md` |
| `src/pages/guide/calculate-actual-area.astro` | `src/content/guides/calculate-actual-area.md` |
| `src/pages/guide/contract-area-check.astro` | `src/content/guides/contract-area-check.md` |
| `src/pages/guide/furniture-layout-by-size.astro` | `src/content/guides/furniture-layout-by-size.md` |
| `src/pages/guide/officetel-area-guide.astro` | `src/content/guides/officetel-area-guide.md` |
| `src/pages/guide/real-estate-terms.astro` | `src/content/guides/real-estate-terms.md` |
| `src/pages/guide/studio-to-three-room.astro` | `src/content/guides/studio-to-three-room.md` |
| `src/pages/guide/world-area-units.astro` | `src/content/guides/world-area-units.md` |

---

## Example Content File

```markdown
---
title: "평수와 제곱미터 완벽 가이드"
description: "평(坪)과 제곱미터(㎡)의 유래, 정확한 변환 공식, 실생활 활용 방법까지 상세히 알아봅니다."
publishDate: 2024-01-01
canonical: "https://pyeongsu-calculator.kr/guide/pyeong-sqm-guide"
keywords:
  - 평수 계산
  - 제곱미터 변환
  - 평 계산법
  - 1평 몇 제곱미터
  - 부동산 면적
faqs:
  - question: "1평은 몇 제곱미터인가요?"
    answer: "1평은 정확히 3.3058제곱미터(㎡)입니다. 일상에서는 3.3으로 간단히 계산하기도 합니다."
  - question: "왜 한국에서는 아직도 평을 사용하나요?"
    answer: "1961년 미터법 도입 이후에도 60년 이상 사용해온 습관과 직관적 이해 때문에 부동산 시장에서 여전히 널리 사용됩니다."
---

부동산을 검색하거나 집을 구할 때 "30평 아파트"라는 표현을 자주 접하게 됩니다...

## 평(坪)이란 무엇인가?

### 평의 역사적 기원

평(坪)은 동아시아에서 사용되던 전통적인 면적 단위입니다...
```
