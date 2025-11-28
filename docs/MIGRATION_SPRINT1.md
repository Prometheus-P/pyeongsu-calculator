# 🚀 Pyeongsu Calculator: Vite → Astro Migration

## Sprint 1 실행 가이드

---

## 📍 프로젝트 정보

| 항목 | 값 |
|------|-----|
| **기존 프로젝트** | `/Users/admin/Documents/dev/pyeongsu-calculator` |
| **신규 프로젝트** | `/Users/admin/Documents/dev/pyeongsu-calculator-astro` |
| **목표** | Vite CSR → Astro SSG (SEO 최적화) |
| **기존 코드 재사용률** | 90%+ |

---

## 📁 기존 프로젝트 구조 (참조용)

```
pyeongsu-calculator/
├── src/
│   ├── components/
│   │   ├── Calculator.tsx          ← 마이그레이션 대상
│   │   ├── Calculator.test.tsx
│   │   ├── ReferenceTable.tsx      ← 마이그레이션 대상
│   │   └── ReferenceTable.test.tsx
│   ├── utils/
│   │   └── converter.ts            ← 그대로 복사
│   ├── constants/
│   │   └── conversion.ts           ← 그대로 복사
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── main.tsx
│   └── index.css
├── e2e/
│   └── calculator.spec.ts          ← 수정 후 재사용
├── tailwind.config.js              ← 수정 후 재사용
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

---

## 🎯 신규 프로젝트 구조 (목표)

```
pyeongsu-calculator-astro/
├── src/
│   ├── components/
│   │   ├── calculator/
│   │   │   ├── Calculator.tsx      # Islands 컴포넌트
│   │   │   └── ReferenceTable.tsx  # Islands 컴포넌트
│   │   ├── seo/
│   │   │   ├── SEOHead.astro       # 메타태그 관리
│   │   │   └── SchemaMarkup.astro  # JSON-LD 스키마
│   │   ├── ads/
│   │   │   └── AdContainer.astro   # 광고 슬롯 (CLS 방지)
│   │   └── ui/
│   │       ├── Header.astro
│   │       ├── Footer.astro
│   │       └── FAQ.astro
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro        # 공통 레이아웃
│   │
│   ├── pages/
│   │   ├── index.astro             # 메인 페이지
│   │   ├── robots.txt.ts           # 동적 robots.txt
│   │   └── sitemap.xml.ts          # 동적 사이트맵
│   │
│   ├── content/
│   │   ├── config.ts               # Content Collections 설정
│   │   └── faq/
│   │       ├── 01-basic.md
│   │       ├── 02-legal.md
│   │       └── 03-practical.md
│   │
│   ├── utils/
│   │   └── converter.ts            # [기존] 그대로
│   │
│   ├── constants/
│   │   └── conversion.ts           # [기존] 그대로
│   │
│   └── styles/
│       └── global.css              # Tailwind base
│
├── tests/
│   ├── unit/
│   │   ├── converter.test.ts
│   │   └── setup.ts
│   └── e2e/
│       └── calculator.spec.ts      # [수정] Islands 대응
│
├── public/
│   ├── favicon.svg
│   └── og-image.png
│
├── astro.config.mjs
├── tailwind.config.mjs             # [수정] content 경로
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

---

## ✅ Sprint 1 태스크 상세

### Task M-001: Astro 프로젝트 생성

**목표:** 새 Astro 프로젝트 초기화

**실행 명령:**
```bash
cd /Users/admin/Documents/dev
npm create astro@latest pyeongsu-calculator-astro -- \
  --template minimal \
  --typescript strict \
  --install \
  --git
```

**완료 조건:**
- [ ] `/Users/admin/Documents/dev/pyeongsu-calculator-astro` 생성됨
- [ ] `npm run dev` 실행 시 `localhost:4321` 접속 가능
- [ ] `tsconfig.json`에 `"extends": "astro/tsconfigs/strict"` 포함

---

### Task M-002: React + Tailwind + Sitemap 통합

**목표:** Astro 통합 패키지 설치

**실행 명령:**
```bash
cd /Users/admin/Documents/dev/pyeongsu-calculator-astro
npx astro add react tailwind sitemap -y
```

**astro.config.mjs 수정:**
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pyeongsu-calculator.kr',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
});
```

**완료 조건:**
- [ ] `@astrojs/react`, `@astrojs/tailwind`, `@astrojs/sitemap` 설치됨
- [ ] `astro.config.mjs`에 site URL 설정됨
- [ ] React JSX 파일 렌더링 가능

---

### Task M-003: TypeScript 설정 마이그레이션

**목표:** 기존 TypeScript 설정 + Astro 설정 병합

**tsconfig.json 수정:**
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@constants/*": ["src/constants/*"],
      "@layouts/*": ["src/layouts/*"]
    },
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**완료 조건:**
- [ ] `npx astro check` 통과
- [ ] 경로 별칭 (`@/`, `@components/` 등) 동작

---

### Task M-004: 디렉토리 구조 생성

**목표:** 설계서 기반 폴더 구조 생성

**실행 명령:**
```bash
cd /Users/admin/Documents/dev/pyeongsu-calculator-astro

# src 하위 디렉토리
mkdir -p src/components/calculator
mkdir -p src/components/seo
mkdir -p src/components/ads
mkdir -p src/components/ui
mkdir -p src/layouts
mkdir -p src/content/faq
mkdir -p src/utils
mkdir -p src/constants
mkdir -p src/styles

# tests 디렉토리
mkdir -p tests/unit
mkdir -p tests/e2e

# public 디렉토리 (이미 존재할 수 있음)
mkdir -p public
```

**완료 조건:**
- [ ] 모든 디렉토리 생성됨
- [ ] `src/pages/index.astro` 존재 (Astro 기본 생성)

---

### Task M-005: 유틸리티 함수 복사

**목표:** converter.ts 그대로 복사

**실행 명령:**
```bash
cp /Users/admin/Documents/dev/pyeongsu-calculator/src/utils/converter.ts \
   /Users/admin/Documents/dev/pyeongsu-calculator-astro/src/utils/converter.ts
```

**파일 내용 확인 (변경 없음):**
```typescript
// src/utils/converter.ts
import { SQM_TO_PYEONG_RATIO, PYEONG_TO_SQM_RATIO } from '../constants/conversion';

export function convertSqmToPyeong(sqm: number): number {
  return sqm * SQM_TO_PYEONG_RATIO;
}

export function convertPyeongToSqm(pyeong: number): number {
  return pyeong * PYEONG_TO_SQM_RATIO;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function isValidInput(value: string): boolean {
  if (value === '' || value === '.') {
    return false;
  }
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}
```

**완료 조건:**
- [ ] 파일 복사 완료
- [ ] import 경로 정상 (상대 경로 유지)

---

### Task M-006: 상수 파일 복사

**목표:** conversion.ts 그대로 복사

**실행 명령:**
```bash
cp /Users/admin/Documents/dev/pyeongsu-calculator/src/constants/conversion.ts \
   /Users/admin/Documents/dev/pyeongsu-calculator-astro/src/constants/conversion.ts
```

**파일 내용 확인 (변경 없음):**
```typescript
// src/constants/conversion.ts
export const PYEONG_TO_SQM_RATIO = 3.3058;
export const SQM_TO_PYEONG_RATIO = 0.3025;

export const COMMON_SIZES = [
  { pyeong: 10, label: '10평', type: '원룸' },
  { pyeong: 15, label: '15평', type: '투룸' },
  { pyeong: 20, label: '20평', type: '소형 아파트' },
  { pyeong: 25, label: '25평', type: '중소형 아파트' },
  { pyeong: 30, label: '30평', type: '중형 아파트' },
  { pyeong: 35, label: '35평', type: '중대형 아파트' },
  { pyeong: 40, label: '40평', type: '대형 아파트' },
] as const;
```

**완료 조건:**
- [ ] 파일 복사 완료
- [ ] TypeScript 타입 검증 통과

---

### Task M-007: Tailwind 설정 마이그레이션

**목표:** 기존 Tailwind 설정을 Astro용으로 수정

**기존 파일 참조:**
`/Users/admin/Documents/dev/pyeongsu-calculator/tailwind.config.js`

**신규 파일 생성 (tailwind.config.mjs):**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // 필요시 커스텀 컬러 추가
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // prose 클래스용
  ],
};
```

**추가 패키지 설치:**
```bash
npm install -D @tailwindcss/typography
```

**global.css 생성 (src/styles/global.css):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 커스텀 베이스 스타일 */
@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply antialiased;
  }
}

/* 광고 컨테이너 기본 스타일 */
@layer components {
  .ad-container {
    @apply bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center;
  }
}
```

**완료 조건:**
- [ ] `tailwind.config.mjs` 생성됨
- [ ] `@tailwindcss/typography` 설치됨
- [ ] `src/styles/global.css` 생성됨

---

### Task M-008: 기본 레이아웃 생성

**목표:** BaseLayout.astro 생성

**파일 생성 (src/layouts/BaseLayout.astro):**
```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    
    <!-- Primary Meta Tags -->
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    
    <!-- 추가 SEO 태그는 SEOHead 컴포넌트로 분리 예정 -->
    <slot name="head" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

**완료 조건:**
- [ ] `src/layouts/BaseLayout.astro` 생성됨
- [ ] Props 타입 정의됨
- [ ] global.css import됨

---

### Task M-009: 테스트용 index.astro 생성

**목표:** 마이그레이션 검증용 기본 페이지

**파일 수정 (src/pages/index.astro):**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout 
  title="평수 계산기 - 제곱미터 평 변환"
  description="부동산 평수를 제곱미터로 변환하는 계산기"
>
  <main class="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">평수 계산기</h1>
      <p class="text-gray-600 mb-6">Astro 마이그레이션 테스트</p>
      <div class="space-y-2 text-sm text-gray-500">
        <p>✅ Astro 프로젝트 초기화 완료</p>
        <p>✅ React 통합 완료</p>
        <p>✅ Tailwind CSS 동작 확인</p>
        <p>⏳ Calculator 컴포넌트 마이그레이션 대기</p>
      </div>
    </div>
  </main>
</BaseLayout>
```

**완료 조건:**
- [ ] `npm run dev` 시 페이지 렌더링
- [ ] Tailwind 그라데이션 배경 표시
- [ ] 한글 폰트 정상 렌더링

---

## 📊 Sprint 1 완료 체크리스트

| # | Task | Status |
|---|------|--------|
| M-001 | Astro 프로젝트 생성 | ⬜ |
| M-002 | React + Tailwind + Sitemap 통합 | ⬜ |
| M-003 | TypeScript 설정 | ⬜ |
| M-004 | 디렉토리 구조 생성 | ⬜ |
| M-005 | converter.ts 복사 | ⬜ |
| M-006 | conversion.ts 복사 | ⬜ |
| M-007 | Tailwind 설정 | ⬜ |
| M-008 | BaseLayout.astro | ⬜ |
| M-009 | 테스트용 index.astro | ⬜ |

**Sprint 1 Definition of Done:**
- [ ] `npm run dev` 성공
- [ ] `npm run build` 성공
- [ ] `npx astro check` 통과
- [ ] Tailwind 스타일 적용 확인
- [ ] 브라우저에서 페이지 렌더링 확인

---

## 🔜 Sprint 2 미리보기

Sprint 1 완료 후 진행:
- Calculator.tsx Islands 마이그레이션
- ReferenceTable.tsx Islands 마이그레이션
- SEOHead.astro 생성
- SchemaMarkup.astro 생성

---

**문서 버전:** 1.0  
**작성일:** 2025-11-27  
**작성자:** Delivery Manager
