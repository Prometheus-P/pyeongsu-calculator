# 평수 계산기 (Pyeongsu Calculator)

제곱미터(㎡)와 평을 실시간으로 변환하는 웹 계산기입니다.

## 주요 기능

- 제곱미터 ↔ 평 실시간 양방향 변환
- 빠른 평형 버튼 (10평 ~ 40평)
- 공간 시각화 (SpaceVisualizer)
- 예산 추정 (BudgetEstimator)
- 실거래가 정보 연동
- Material 3 디자인 시스템
- 다크모드 지원
- SEO 최적화 (JSON-LD, 사이트맵)
- 반응형 디자인 (모바일 지원)

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Astro 4 + React 18 |
| 스타일링 | Tailwind CSS + Material 3 |
| 테스트 | Vitest + Playwright |
| 배포 | Cloudflare Pages |
| 언어 | TypeScript 5.5 |
| CI/CD | GitHub Actions |

## 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 테스트 실행
npm test

# 프로덕션 빌드
npm run build
```

## 변환 공식

```
1평 = 3.3058㎡
1㎡ = 0.3025평
```

## 프로젝트 구조

```
src/
├── components/           # 컴포넌트
│   ├── ads/             # 광고 컴포넌트
│   ├── analytics/       # 분석 컴포넌트
│   ├── m3/              # Material 3 UI
│   ├── seo/             # SEO 컴포넌트
│   ├── Calculator.tsx   # 메인 계산기
│   ├── BudgetEstimator.tsx
│   ├── SpaceVisualizer.tsx
│   └── ThemeToggle.tsx
├── constants/           # 상수 정의
├── content/             # Astro Content Collections
├── contexts/            # React Context
├── hooks/               # 커스텀 훅
├── layouts/             # Astro 레이아웃
├── pages/               # Astro 페이지
├── services/            # API 서비스
├── styles/              # CSS 스타일
├── types/               # TypeScript 타입
└── utils/               # 유틸리티 함수
```

## 문서

- [CONTRIBUTING.md](./CONTRIBUTING.md) - 기여 가이드라인
- [CHANGELOG.md](./CHANGELOG.md) - 변경 이력

### 배포 가이드
- [배포 빠른 시작](./docs/DEPLOYMENT-QUICKSTART.md)
- [Cloudflare Pages 설정](./docs/cloudflare-pages-setup.md)
- [Google Analytics 설정](./docs/google-analytics-setup.md)
- [검색엔진 등록](./docs/search-console-setup.md)

## 라이선스

Copyright (c) 2024-2025 David Park. All Rights Reserved.

문의: parkdavid31@gmail.com
