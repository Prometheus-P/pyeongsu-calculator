# pyeongsu-calculator Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-11

## Active Technologies
- TypeScript 5.5, Astro 4.16 + Astro built-in i18n (astro:i18n module), @astrojs/sitemap (001-seo-i18n)
- N/A (static site, translations in JSON/TS files) (001-seo-i18n)
- TypeScript 5.5 + None (pure TypeScript, no external libraries) (003-converter-strategy-pattern)
- N/A (stateless utility functions) (003-converter-strategy-pattern)

- TypeScript 5.5, Astro 4.16 + Astro Content Collections (built-in), Zod (built-in via Astro), @astrojs/sitemap 3.6 (004-astro-guides-aeo)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.5, Astro 4.16: Follow standard conventions

## Recent Changes
- 003-converter-strategy-pattern: Added TypeScript 5.5 + None (pure TypeScript, no external libraries)
- 003-converter-strategy-pattern: Added TypeScript 5.5 + None (pure TypeScript, no external libraries)
- 001-seo-i18n: Added TypeScript 5.5, Astro 4.16 + Astro built-in i18n (astro:i18n module), @astrojs/sitemap
- JSON-LD Schema Centralization: Refactored SchemaMarkup.astro, ArticleLayout.astro, and GuideLayout.astro to centralize JSON-LD generation.
- `useQueryParams` `act` Usage Review: Reviewed and confirmed correct `act` usage in `useQueryParams` tests.
- Fix `App.test.tsx` failure: Refactored `App.test.tsx` to render `App` once per test, resolving a timing issue.
- M3 State Layer E2E Tests Fix: Modified `Calculator.tsx` to apply `m3-state-layer` and `m3-outlined-input` classes.
- BlogPosting Schema Presence Fix: Corrected `GuideLayout.astro` and `SchemaMarkup.astro` to properly generate and pass `BlogPosting` schema data.
- Dark Mode Visibility Improvement: Adjusted dark mode color variables in `src/styles/global.css` for better contrast.
- Refactor App.test.tsx: Refactored `App.test.tsx` to render `App` once per test, resolving a timing issue.


<!-- MANUAL ADDITIONS START -->

## 프로젝트 컨벤션

### Git 워크플로우
- **main/dev 직접 push 금지** – 항상 feature 브랜치에서 작업 후 PR로 머지
- 브랜치 네이밍: `XXX-feature-name` (예: `001-seo-improvements`)

### Spec-First 개발
- **스펙 문서가 Source of Truth** – 모든 기능은 스펙 문서 작성 후 구현
- 스펙 문서 위치: `specs/{feature-id}/`

### 역할별 디렉토리 구조
| 역할 | 디렉토리 |
|------|----------|
| AI Worker | `worker/` (해당 시) |
| Backend | `backend/` (해당 시) |
| Frontend | `src/` |

### 테스트 정책
- **TDD 원칙** – 테스트 먼저 작성
- **커밋 전 테스트 필수** – `npm test && npm run lint` 통과 후 커밋

### 환경 변수
- 단일 `.env` 파일 사용
- `.env.example` 제공 필수

### 아키텍처 패턴

#### Backend (Clean Architecture, 해당 시)
```
router → service → repository
```

#### AI Worker (Parser/Strategy Pattern, 해당 시)
- 파일 타입별 파서 분리
- Strategy 패턴으로 처리 로직 교체 가능

#### Frontend (현재 프로젝트)
```
src/
├── components/     # React 컴포넌트
├── contexts/       # React Context
├── hooks/          # 커스텀 훅
├── layouts/        # Astro 레이아웃
├── pages/          # Astro 페이지
├── styles/         # CSS 스타일
├── utils/          # 유틸리티 함수
├── constants/      # 상수 정의
└── test/           # 테스트 설정
```

### AI 결과 처리
- **AI 결과는 항상 Preview-only** – 사람이 최종 검토 및 승인
- 자동 적용 금지, 사람이 마지막 책임

### 보안 및 감사
- **Audit log** 필수 기록 (해당 시)
- **해시 검증** – 데이터 무결성 보장 (해당 시)
- **케이스 단위 데이터 격리** – 테넌트/케이스별 데이터 분리 (해당 시)

<!-- MANUAL ADDITIONS END -->
