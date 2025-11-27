# 평수 계산기 SEO 최적화 기술 스택 설계서

> 기존 Vite + React 프로젝트를 SEO 최적화 스택으로 마이그레이션

---

## 핵심 결론

**Astro 5 + React Islands + Cloudflare Pages** 조합이 최적입니다.

| 평가 기준 | Astro + React | Next.js 14 | 현재 (Vite) |
|----------|---------------|------------|-------------|
| **CWV Pass Rate** | 41% | 27-31% | N/A (CSR) |
| **JS 번들** | 0KB (기본) | 350KB+ | 150KB+ |
| **Naver 크롤링** | ✅ 완벽 | ✅ SSG 시 | ⚠️ CSR 제한 |
| **기존 코드 재사용** | ✅ 90%+ | ✅ 80% | 현재 |
| **빌드 속도** | ~5초 | ~30초 | ~3초 |
| **Cloudflare 호환** | ✅ 네이티브 | ⚠️ 설정 필요 | ✅ |

---

## 1. 기술 스택 선정

### 1.1 프레임워크: Astro 5.x

**선정 이유:**
```
Content relevance (0.47) > Domain authority (0.21)
→ 콘텐츠 중심 사이트에 최적화된 프레임워크 필요
```

| 특성 | 설명 | SEO 영향 |
|------|------|----------|
| **Islands Architecture** | 인터랙티브 컴포넌트만 hydrate | LCP 개선 |
| **0 JS by default** | HTML만 전송, JS 선택적 | CWV 최적 |
| **React 통합** | 기존 컴포넌트 재사용 | 마이그레이션 용이 |
| **Content Collections** | 타입 안전 콘텐츠 관리 | 확장성 |
| **SSG 기본** | 빌드 시 HTML 생성 | Naver 완벽 지원 |

### 1.2 UI 프레임워크: React 18

**선정 이유:**
- 기존 Calculator.tsx, ReferenceTable.tsx 재사용
- 테스트 코드 (Vitest, Playwright) 유지
- TypeScript 타입 정의 재사용

### 1.3 스타일링: Tailwind CSS 3.4

**선정 이유:**
- 기존 스타일 100% 호환
- Astro 네이티브 지원
- 빌드 시 purge → 최소 CSS

### 1.4 호스팅: Cloudflare Pages

**선정 이유:**
- **무제한 대역폭** (바이럴 트래픽 대응)
- 330+ 글로벌 PoP
- 무료 SSL, 무료 도메인 연결
- 월 $0

### 1.5 콘텐츠 관리: MDX + Content Collections

**선정 이유:**
- FAQ, 가이드 등 마크다운으로 관리
- 스키마 검증 (Zod)
- Git 기반 버전 관리

---

## 2. 프로젝트 구조

```
pyeongsu-calculator-astro/
├── src/
│   ├── components/
│   │   ├── calculator/
│   │   │   ├── Calculator.tsx          # [기존] Islands로 hydrate
│   │   │   ├── ReferenceTable.tsx      # [기존] Islands로 hydrate
│   │   │   └── QuickButtons.tsx        # 빠른 선택 버튼
│   │   ├── seo/
│   │   │   ├── SchemaMarkup.astro      # JSON-LD 스키마
│   │   │   └── SEOHead.astro           # 메타태그 관리
│   │   ├── ads/
│   │   │   └── AdContainer.astro       # 광고 슬롯 (CLS 방지)
│   │   └── ui/
│   │       ├── Header.astro
│   │       ├── Footer.astro
│   │       └── FAQ.astro
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro            # 공통 레이아웃
│   │   └── CalculatorLayout.astro      # 계산기 페이지용
│   │
│   ├── pages/
│   │   ├── index.astro                 # 메인 계산기 페이지
│   │   ├── guide/
│   │   │   ├── pyeong-sqm.astro        # 평/제곱미터 가이드
│   │   │   └── area-types.astro        # 전용/공급면적 가이드
│   │   ├── faq.astro                   # FAQ 페이지
│   │   ├── sitemap.xml.ts              # 동적 사이트맵
│   │   └── robots.txt.ts               # robots.txt
│   │
│   ├── content/
│   │   ├── config.ts                   # Content Collections 설정
│   │   └── faq/
│   │       ├── basic.md                # 기본 FAQ
│   │       ├── legal.md                # 법률 관련 FAQ
│   │       └── practical.md            # 실무 FAQ
│   │
│   ├── utils/
│   │   └── converter.ts                # [기존] 변환 함수
│   │
│   ├── constants/
│   │   └── conversion.ts               # [기존] 상수
│   │
│   └── styles/
│       └── global.css                  # Tailwind 설정
│
├── public/
│   ├── favicon.svg
│   ├── og-image.png                    # Open Graph 이미지
│   └── manifest.json                   # PWA (Phase 2)
│
├── tests/
│   ├── unit/                           # [기존] Vitest 테스트
│   │   └── converter.test.ts
│   └── e2e/                            # [기존] Playwright 테스트
│       └── calculator.spec.ts
│
├── astro.config.mjs
├── tailwind.config.js                  # [기존] 재사용
├── playwright.config.ts                # [기존] 재사용
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. 핵심 설계 패턴

### 3.1 Islands Architecture

```
┌─────────────────────────────────────────────────────────┐
│  페이지 (index.astro) - Static HTML, 0 JS              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Header.astro (정적)                              │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Calculator.tsx 🏝️ client:visible               │   │
│  │ (React Island - 화면에 보일 때만 hydrate)        │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ AdContainer.astro (정적 HTML, 고정 높이)         │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ReferenceTable.tsx 🏝️ client:visible           │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ SEO Content Section (정적 - 1,800+ 단어)         │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ FAQ.astro (정적)                                 │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Footer.astro (정적)                              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

JS 로딩: Calculator + ReferenceTable만 (~20KB)
나머지: 순수 HTML (0 JS)
```

### 3.2 Hydration 전략

| 컴포넌트 | Hydration 방식 | 이유 |
|----------|---------------|------|
| Calculator | `client:visible` | 화면에 보일 때 로드 |
| ReferenceTable | `client:visible` | 스크롤 시 로드 |
| Header | 없음 (정적) | 인터랙션 불필요 |
| Footer | 없음 (정적) | 인터랙션 불필요 |
| FAQ | 없음 (정적) | CSS로 토글 가능 |

### 3.3 스키마 마크업 전략

```astro
---
// src/components/seo/SchemaMarkup.astro
interface Props {
  type: 'calculator' | 'faq' | 'howto';
  data?: any;
}

const { type, data } = Astro.props;

const schemas = {
  calculator: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "평수 계산기",
    "description": "제곱미터(㎡)와 평을 실시간으로 변환하는 웹 계산기",
    "url": "https://pyeongsu-calculator.kr",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    },
    "featureList": [
      "실시간 평/제곱미터 변환",
      "양방향 계산",
      "빠른 평형 선택",
      "모바일 최적화"
    ]
  },
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data?.map((item: any) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    })) || []
  },
  howto: {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "평수 계산기 사용 방법",
    "description": "제곱미터와 평을 변환하는 방법",
    "totalTime": "PT1M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "면적 입력",
        "text": "제곱미터 또는 평 입력란에 숫자를 입력합니다."
      },
      {
        "@type": "HowToStep",
        "name": "자동 변환 확인",
        "text": "입력과 동시에 반대쪽 필드에 변환 결과가 표시됩니다."
      },
      {
        "@type": "HowToStep",
        "name": "빠른 선택 활용",
        "text": "일반적인 평형은 빠른 선택 버튼으로 바로 계산할 수 있습니다."
      }
    ]
  }
};
---
<script 
  type="application/ld+json" 
  set:html={JSON.stringify(schemas[type])} 
/>
```

### 3.4 광고 컨테이너 (CLS 방지)

```astro
---
// src/components/ads/AdContainer.astro
interface Props {
  slot: string;
  position: 'top' | 'middle' | 'bottom';
  className?: string;
}

const { slot, position, className = '' } = Astro.props;

// 광고 크기별 최소 높이 설정 (CLS 방지)
const heights: Record<string, string> = {
  top: 'min-h-[90px] md:min-h-[90px]',       // Leaderboard 728x90
  middle: 'min-h-[250px] md:min-h-[250px]',  // Medium Rectangle 300x250
  bottom: 'min-h-[100px] md:min-h-[90px]'    // Mobile Banner / Leaderboard
};
---
<div 
  class:list={[
    'ad-container',
    'bg-gray-100 border border-gray-200 rounded-lg',
    'flex items-center justify-center',
    'my-6',
    heights[position],
    className
  ]}
  data-ad-slot={slot}
  data-ad-position={position}
>
  <!-- AdSense 스크립트는 레이아웃에서 한 번만 로드 -->
  <ins 
    class="adsbygoogle"
    style="display:block"
    data-ad-client="ca-pub-XXXXXXXXXXXXXX"
    data-ad-slot={slot}
    data-ad-format="auto"
    data-full-width-responsive="true"
  />
</div>

<style>
  .ad-container {
    /* 광고 없을 때 표시할 플레이스홀더 */
    &:empty::before {
      content: '광고';
      color: #9ca3af;
      font-size: 0.875rem;
    }
  }
</style>
```

---

## 4. SEO 최적화 설정

### 4.1 Astro 설정

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pyeongsu-calculator.kr',
  
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // 커스텀 base 사용
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  
  output: 'static', // SSG 모드
  
  build: {
    inlineStylesheets: 'auto', // 작은 CSS는 인라인
    format: 'file', // /page.html 형식
  },
  
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            // React는 별도 청크로 분리
            react: ['react', 'react-dom'],
          },
        },
      },
    },
  },
  
  // 이미지 최적화
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
```

### 4.2 메타태그 컴포넌트

```astro
---
// src/components/seo/SEOHead.astro
interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

const { 
  title, 
  description,
  canonical = Astro.url.href,
  ogImage = '/og-image.png',
  noindex = false
} = Astro.props;

// Naver 최적화: title 40자, description 80자
const truncatedTitle = title.length > 40 ? title.slice(0, 37) + '...' : title;
const truncatedDesc = description.length > 80 ? description.slice(0, 77) + '...' : description;
const fullOgImage = new URL(ogImage, Astro.site).href;
---

<!-- Primary Meta Tags -->
<title>{truncatedTitle}</title>
<meta name="title" content={truncatedTitle} />
<meta name="description" content={truncatedDesc} />
<link rel="canonical" href={canonical} />

<!-- Robots -->
<meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

<!-- Search Console Verification -->
<meta name="naver-site-verification" content="YOUR_NAVER_VERIFICATION_CODE" />
<meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content={canonical} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={fullOgImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="ko_KR" />
<meta property="og:site_name" content="평수계산기" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content={canonical} />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={fullOgImage} />

<!-- Additional SEO -->
<meta name="author" content="평수계산기" />
<meta name="generator" content={Astro.generator} />
<meta name="format-detection" content="telephone=no" />

<!-- Last Modified -->
<meta name="last-modified" content={new Date().toISOString().split('T')[0]} />

<!-- Theme Color -->
<meta name="theme-color" content="#3b82f6" />
```

### 4.3 Content Collections 설정

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

// FAQ 컬렉션
const faqCollection = defineCollection({
  type: 'content',
  schema: z.object({
    question: z.string(),
    category: z.enum(['basic', 'legal', 'practical', 'advanced']),
    order: z.number(),
    sources: z.array(z.object({
      name: z.string(),
      url: z.string().url().optional(),
    })).optional(),
    relatedFaqs: z.array(z.string()).optional(),
  }),
});

// 가이드 컬렉션
const guideCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updateDate: z.date().optional(),
    author: z.string().default('평수계산기'),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  faq: faqCollection,
  guide: guideCollection,
};
```

### 4.4 사이트맵 생성

```typescript
// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const faqs = await getCollection('faq');
  const guides = await getCollection('guide');
  
  const pages = [
    { url: '', priority: 1.0, changefreq: 'weekly' },
    { url: 'faq', priority: 0.8, changefreq: 'monthly' },
    ...guides.map(guide => ({
      url: `guide/${guide.slug}`,
      priority: 0.7,
      changefreq: 'monthly' as const,
    })),
  ];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${new URL(page.url, site).href}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
```

---

## 5. 기존 코드 마이그레이션

### 5.1 컴포넌트 마이그레이션

#### Calculator.tsx 수정사항

```typescript
// src/components/calculator/Calculator.tsx
// 변경: Astro에서 props 전달 방식 조정

import { useState, useEffect } from 'react';
import {
  convertSqmToPyeong,
  convertPyeongToSqm,
  formatNumber,
  isValidInput,
} from '../../utils/converter';

interface CalculatorProps {
  initialPyeong?: number | null;
  onValueChange?: (pyeong: number | null, sqm: number | null) => void;
}

export default function Calculator({ 
  initialPyeong,
  onValueChange 
}: CalculatorProps) {
  // ... 기존 로직 유지
  
  // Astro에서 이벤트 전달을 위한 콜백 추가
  useEffect(() => {
    if (onValueChange && pyeong) {
      onValueChange(
        parseFloat(pyeong) || null,
        parseFloat(sqm) || null
      );
    }
  }, [pyeong, sqm, onValueChange]);

  // 나머지 코드 동일...
}
```

#### ReferenceTable.tsx 수정사항

```typescript
// src/components/calculator/ReferenceTable.tsx
// 변경 없음 - 그대로 사용 가능
```

### 5.2 유틸리티 함수 (변경 없음)

```typescript
// src/utils/converter.ts
// 기존 코드 그대로 복사
```

### 5.3 상수 (변경 없음)

```typescript
// src/constants/conversion.ts
// 기존 코드 그대로 복사
```

---

## 6. 메인 페이지 구현

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Calculator from '../components/calculator/Calculator.tsx';
import ReferenceTable from '../components/calculator/ReferenceTable.tsx';
import AdContainer from '../components/ads/AdContainer.astro';
import SchemaMarkup from '../components/seo/SchemaMarkup.astro';
import FAQ from '../components/ui/FAQ.astro';
import { getCollection } from 'astro:content';

// FAQ 데이터 로드
const allFaqs = await getCollection('faq');
const sortedFaqs = allFaqs.sort((a, b) => a.data.order - b.data.order);

// 스키마용 FAQ 데이터 변환
const faqSchemaData = sortedFaqs.map(faq => ({
  question: faq.data.question,
  answer: faq.body // MDX 내용
}));

const pageTitle = "평수 계산기 - 제곱미터 평 변환 (2024 최신)";
const pageDescription = "부동산 평수를 ㎡로 즉시 변환. 10평~40평 참고표, 전용면적 계산법, 공식 출처 제공.";
---

<BaseLayout title={pageTitle} description={pageDescription}>
  <!-- 스키마 마크업 -->
  <SchemaMarkup type="calculator" slot="head" />
  <SchemaMarkup type="faq" data={faqSchemaData} slot="head" />
  <SchemaMarkup type="howto" slot="head" />

  <main>
    <!-- Hero Section + Calculator -->
    <section class="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-8">
      <div class="container mx-auto px-4 flex flex-col items-center gap-6">
        <!-- 메인 계산기 (React Island) -->
        <Calculator client:visible />
        
        <!-- 참고 테이블 (React Island) -->
        <ReferenceTable client:visible />
      </div>
    </section>

    <!-- 광고 슬롯 1 -->
    <AdContainer slot="1234567890" position="middle" />

    <!-- SEO 콘텐츠: 평과 제곱미터 관계 -->
    <section class="bg-white py-12">
      <div class="container mx-auto px-4 max-w-4xl">
        <article class="prose prose-lg prose-blue max-w-none">
          <h2>평과 제곱미터의 관계</h2>
          
          <p>
            대한민국에서 부동산 면적을 표시할 때 <strong>평(坪)</strong>과 
            <strong>제곱미터(㎡)</strong> 두 가지 단위가 혼용됩니다. 
            2007년 「계량에 관한 법률」 개정으로 법정 단위에서 '평'이 제외되었지만, 
            실생활에서는 여전히 평 단위가 널리 사용되고 있습니다.
          </p>

          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
            <h3 class="text-blue-800 mt-0">📜 법적 근거</h3>
            <p class="mb-0">
              <strong>계량에 관한 법률 시행령 [별표 2]</strong>에 따르면,<br/>
              <code>1평 = 3.3058㎡</code> (정확히 400/121 ≈ 3.305785...)
            </p>
            <p class="text-sm text-gray-600 mb-0">
              출처: 국가법령정보센터, 대통령령 제18293호
            </p>
          </div>

          <h3>변환 공식 및 계산 방법</h3>
          
          <h4>방법 1: 제곱미터 → 평</h4>
          <p>
            제곱미터 값에 <code>0.3025</code>를 곱합니다.<br/>
            예: 85㎡ × 0.3025 = <strong>25.71평</strong>
          </p>

          <h4>방법 2: 평 → 제곱미터</h4>
          <p>
            평 값에 <code>3.3058</code>을 곱합니다.<br/>
            예: 30평 × 3.3058 = <strong>99.17㎡</strong>
          </p>

          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
            <p class="font-medium text-yellow-800 mb-2">💡 정확도 팁</p>
            <p class="text-sm text-yellow-700 mb-0">
              부동산 거래 시에는 소수점 둘째 자리까지 표기하는 것이 일반적입니다.
              이 계산기는 정부 공식 변환계수를 사용하여 정확한 결과를 제공합니다.
            </p>
          </div>

          <h2>아파트 평형별 실제 크기</h2>

          <div class="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
            <p class="font-medium text-green-800 mb-2">📊 한국 아파트 시장 통계</p>
            <ul class="text-sm text-green-700 mb-0">
              <li>평균 공급면적: 84.5㎡ (약 25.6평) - 국토교통부, 2023년</li>
              <li>20평대(66~99㎡): 전체의 35%</li>
              <li>30평대(99~132㎡): 전체의 28%</li>
            </ul>
          </div>

          <table class="w-full">
            <thead>
              <tr>
                <th>평형</th>
                <th>공급면적</th>
                <th>전용면적(약)</th>
                <th>주거 형태</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>10평</td><td>33.06㎡</td><td>23.1㎡</td><td>원룸</td></tr>
              <tr><td>15평</td><td>49.59㎡</td><td>34.7㎡</td><td>투룸</td></tr>
              <tr><td>20평</td><td>66.12㎡</td><td>46.3㎡</td><td>소형 아파트</td></tr>
              <tr class="bg-blue-50"><td><strong>25평</strong></td><td><strong>82.64㎡</strong></td><td><strong>57.9㎡</strong></td><td><strong>중소형 아파트</strong></td></tr>
              <tr><td>30평</td><td>99.17㎡</td><td>69.4㎡</td><td>중형 아파트</td></tr>
              <tr><td>35평</td><td>115.70㎡</td><td>81.0㎡</td><td>중대형 아파트</td></tr>
              <tr><td>40평</td><td>132.23㎡</td><td>92.6㎡</td><td>대형 아파트</td></tr>
            </tbody>
          </table>
          <p class="text-sm text-gray-500">※ 전용면적은 전용률 70% 가정</p>

          <h2>전용면적과 공급면적의 차이</h2>

          <div class="grid md:grid-cols-2 gap-4 my-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="text-blue-800 mt-0">전용면적</h4>
              <p class="text-sm mb-2">실제 거주 공간</p>
              <ul class="text-sm text-blue-700 mb-0">
                <li>방, 거실, 주방</li>
                <li>욕실, 현관</li>
                <li>발코니 제외</li>
              </ul>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="text-orange-800 mt-0">공급면적</h4>
              <p class="text-sm mb-2">분양 기준 면적</p>
              <ul class="text-sm text-orange-700 mb-0">
                <li>전용면적 포함</li>
                <li>계단, 복도 지분</li>
                <li>주민공동시설 지분</li>
              </ul>
            </div>
          </div>

          <div class="bg-red-50 border-l-4 border-red-500 p-4 my-6">
            <h4 class="text-red-800 mt-0">⚖️ 법률 규정</h4>
            <ul class="text-sm text-red-700 mb-0">
              <li><strong>주택법 시행령 제10조</strong>: 공급면적 = 전용면적 + 공용면적</li>
              <li><strong>공동주택 분양가격 산정 규칙 제2조</strong>: 분양가는 공급면적 기준</li>
            </ul>
          </div>

          <h3>전용률 계산법</h3>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
            <p class="font-medium mb-2">공식: (전용면적 ÷ 공급면적) × 100</p>
            <p class="text-sm mb-2">
              예: 25평형 아파트<br/>
              전용 59㎡ ÷ 공급 82.64㎡ × 100 = <strong>71.4%</strong>
            </p>
            <p class="text-sm text-gray-600 mb-0">
              일반적인 전용률: 아파트 60~75%, 다세대 80~85%
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- 광고 슬롯 2 -->
    <AdContainer slot="0987654321" position="bottom" />

    <!-- FAQ Section -->
    <section class="bg-gray-50 py-12">
      <div class="container mx-auto px-4 max-w-4xl">
        <h2 class="text-2xl font-bold text-gray-800 mb-8">자주 묻는 질문</h2>
        <FAQ faqs={sortedFaqs} />
      </div>
    </section>

    <!-- 계산기 소개 섹션 -->
    <section class="bg-white py-12">
      <div class="container mx-auto px-4 max-w-4xl">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-blue-50 rounded-lg p-6">
            <h3 class="font-bold text-gray-800 mb-3">🎯 목적 및 특징</h3>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>✓ 정부 공식 변환계수 사용</li>
              <li>✓ 실시간 양방향 변환</li>
              <li>✓ 모바일 최적화</li>
              <li>✓ 소수점 둘째 자리 정밀도</li>
            </ul>
          </div>
          <div class="bg-green-50 rounded-lg p-6">
            <h3 class="font-bold text-gray-800 mb-3">📚 사용된 공식 및 출처</h3>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>변환계수: 1평 = 3.3058㎡</li>
              <li>법적 근거: 계량법 시행령 [별표 2]</li>
              <li>참고: 국가법령정보센터, 국토교통부</li>
            </ul>
          </div>
        </div>
        <p class="text-center text-sm text-gray-500 mt-6">
          최근 업데이트: {new Date().toLocaleDateString('ko-KR')} | 
          본 계산기는 참고용이며, 법률 자문을 대체하지 않습니다.
        </p>
      </div>
    </section>
  </main>
</BaseLayout>
```

---

## 7. 테스트 마이그레이션

### 7.1 Vitest 설정

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
  },
});
```

### 7.2 Playwright 설정 수정

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:4321', // Astro 기본 포트
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } },
  ],

  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 7.3 E2E 테스트 수정

```typescript
// tests/e2e/calculator.spec.ts
import { test, expect } from '@playwright/test';

test.describe('평수 계산기 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Islands 로딩 대기 (client:visible)
    await page.waitForSelector('[data-testid="calculator"]', { 
      state: 'visible',
      timeout: 5000 
    });
  });

  // 기존 테스트 케이스 유지...
  test('제곱미터 입력 시 평수가 실시간으로 계산된다', async ({ page }) => {
    const sqmInput = page.getByLabel(/제곱미터/);
    const pyeongInput = page.getByLabel(/평/);

    await sqmInput.fill('33.06');
    await expect(pyeongInput).toHaveValue('10.00');
  });
});
```

---

## 8. 배포 파이프라인

### 8.1 GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:run
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      deployments: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: pyeongsu-calculator
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### 8.2 package.json 스크립트

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "vitest",
    "test:run": "vitest run",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test:run && npm run test:e2e",
    "lint": "eslint .",
    "format": "prettier --write \"src/**/*.{ts,tsx,astro,css}\""
  }
}
```

---

## 9. 성능 목표

### Core Web Vitals 목표

| 지표 | 목표 | 예상 달성 |
|------|------|----------|
| **LCP** | < 2.5s | ~1.0s ✅ |
| **INP** | < 200ms | ~50ms ✅ |
| **CLS** | < 0.1 | 0 ✅ |

### 빌드 크기 비교

| 항목 | 현재 (Vite) | Astro 전환 후 |
|------|-------------|---------------|
| HTML | ~2KB | ~15KB (콘텐츠 포함) |
| CSS | ~15KB | ~8KB (purged) |
| JS | ~150KB | ~25KB (Islands만) |
| **Total** | **~167KB** | **~48KB** |

**3.5배 감소** → LCP, FCP 개선

---

## 10. 마이그레이션 체크리스트

### Pre-Migration

- [ ] 기존 테스트 모두 통과 확인
- [ ] 현재 dist/ 백업
- [ ] 도메인 준비 (pyeongsu-calculator.kr)

### Migration

- [ ] Astro 프로젝트 초기화
- [ ] 기존 컴포넌트 이전 (Calculator, ReferenceTable)
- [ ] 유틸리티/상수 복사
- [ ] 레이아웃 구성
- [ ] 메인 페이지 작성
- [ ] SEO 콘텐츠 작성 (1,800+ 단어)
- [ ] FAQ 15개 작성 (Content Collections)
- [ ] 스키마 마크업 구현
- [ ] 광고 컨테이너 구현 (CLS 방지)

### Testing

- [ ] 유닛 테스트 통과
- [ ] E2E 테스트 통과
- [ ] Lighthouse 점수 확인 (95+ 목표)
- [ ] 모바일 테스트

### Post-Migration

- [ ] Cloudflare Pages 배포
- [ ] Google Search Console 등록
- [ ] Naver 웹마스터 도구 등록
- [ ] 사이트맵 제출 (양쪽)
- [ ] robots.txt 확인

---

## 11. 결론

### 왜 Astro + React인가?

| 요구사항 | Astro 해결책 |
|----------|-------------|
| Naver SEO | SSG로 순수 HTML 생성 |
| 코드 재사용 | React 컴포넌트 그대로 사용 |
| CWV 성능 | 0 JS 기본, Islands Architecture |
| 무료 호스팅 | Cloudflare Pages 네이티브 지원 |
| 타입 안전 | TypeScript 네이티브 |
| 테스트 유지 | Vitest/Playwright 호환 |

### 예상 ROI 개선

| 지표 | 현재 (Vite CSR) | Astro 전환 후 |
|------|----------------|---------------|
| Google 1페이지 진입 | 6개월+ | 3-4개월 |
| Naver 노출 | ⚠️ 제한적 | ✅ 완벽 |
| CWV Pass | 불확실 | 95%+ |
| 번들 크기 | 167KB | 48KB |
| 월 트래픽 예상 | 1,000 | 3,000+ |

---

**문서 작성일**: 2025-11-27  
**다음 단계**: 마이그레이션 실행
