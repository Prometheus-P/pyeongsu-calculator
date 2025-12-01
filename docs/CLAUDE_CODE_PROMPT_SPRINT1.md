# 🤖 Claude Code 지시서: Sprint 1 실행

## 프로젝트 컨텍스트

기존 Vite + React 프로젝트를 Astro + React Islands로 마이그레이션합니다.

**기존 프로젝트:** `/Users/admin/Documents/dev/pyeongsu-calculator`
**신규 프로젝트:** `/Users/admin/Documents/dev/pyeongsu-calculator-astro`

---

## 🎯 Sprint 1 목표

Astro 프로젝트 부트스트랩 및 기본 인프라 구축

---

## 📋 실행 태스크 (순서대로)

### 1. Astro 프로젝트 생성

```bash
cd /Users/admin/Documents/dev
npm create astro@latest pyeongsu-calculator-astro -- --template minimal --typescript strict --install --git
```

### 2. React + Tailwind + Sitemap 통합

```bash
cd /Users/admin/Documents/dev/pyeongsu-calculator-astro
npx astro add react tailwind sitemap -y
npm install -D @tailwindcss/typography
```

### 3. astro.config.mjs 수정

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

### 4. tsconfig.json 수정

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

### 5. 디렉토리 구조 생성

```bash
cd /Users/admin/Documents/dev/pyeongsu-calculator-astro

mkdir -p src/components/calculator
mkdir -p src/components/seo
mkdir -p src/components/ads
mkdir -p src/components/ui
mkdir -p src/layouts
mkdir -p src/content/faq
mkdir -p src/utils
mkdir -p src/constants
mkdir -p src/styles
mkdir -p tests/unit
mkdir -p tests/e2e
```

### 6. 기존 프로젝트에서 파일 복사

```bash
# 유틸리티 함수
cp /Users/admin/Documents/dev/pyeongsu-calculator/src/utils/converter.ts \
   /Users/admin/Documents/dev/pyeongsu-calculator-astro/src/utils/converter.ts

# 상수
cp /Users/admin/Documents/dev/pyeongsu-calculator/src/constants/conversion.ts \
   /Users/admin/Documents/dev/pyeongsu-calculator-astro/src/constants/conversion.ts
```

### 7. tailwind.config.mjs 생성

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

### 8. src/styles/global.css 생성

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply antialiased;
  }
}

@layer components {
  .ad-container {
    @apply bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center;
  }
}
```

### 9. src/layouts/BaseLayout.astro 생성

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
    
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    
    <slot name="head" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### 10. src/pages/index.astro 수정

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
      <p class="text-gray-600 mb-6">Astro 마이그레이션 Sprint 1 완료</p>
      <div class="space-y-2 text-sm text-left">
        <p class="text-green-600">✅ Astro 프로젝트 초기화</p>
        <p class="text-green-600">✅ React 통합</p>
        <p class="text-green-600">✅ Tailwind CSS 설정</p>
        <p class="text-green-600">✅ TypeScript 설정</p>
        <p class="text-green-600">✅ 유틸리티 함수 이전</p>
        <p class="text-green-600">✅ 상수 파일 이전</p>
        <p class="text-yellow-600">⏳ Calculator 컴포넌트 (Sprint 2)</p>
        <p class="text-yellow-600">⏳ ReferenceTable 컴포넌트 (Sprint 2)</p>
      </div>
    </div>
  </main>
</BaseLayout>
```

---

## ✅ 검증 단계

모든 태스크 완료 후 다음을 확인:

```bash
cd /Users/admin/Documents/dev/pyeongsu-calculator-astro

# 1. 타입 체크
npx astro check

# 2. 개발 서버 실행
npm run dev
# → http://localhost:4321 접속하여 페이지 확인

# 3. 빌드 테스트
npm run build

# 4. 프리뷰
npm run preview
```

---

## 📊 완료 보고 형식

태스크 완료 후 다음 형식으로 보고:

```
## Sprint 1 완료 보고

### 실행 결과
- [x] Astro 프로젝트 생성
- [x] React + Tailwind 통합
- [x] TypeScript 설정
- [x] 디렉토리 구조 생성
- [x] converter.ts 복사
- [x] conversion.ts 복사
- [x] Tailwind 설정
- [x] BaseLayout.astro 생성
- [x] index.astro 생성

### 검증 결과
- `npx astro check`: ✅ 통과
- `npm run dev`: ✅ localhost:4321 접속 성공
- `npm run build`: ✅ dist/ 생성됨

### 이슈 (있는 경우)
- 없음 / [이슈 설명]

### 다음 단계
Sprint 2 준비 완료 - Calculator.tsx 마이그레이션
```

---

## ⚠️ 주의사항

1. **기존 프로젝트 수정 금지** - 새 프로젝트에서만 작업
2. **복사 시 경로 확인** - 소스/대상 경로 정확히 확인
3. **순서 준수** - 태스크 순서대로 실행 (의존성 있음)
4. **에러 발생 시** - 에러 메시지 전체 복사하여 보고

---

**Sprint 1 시작하세요.**
