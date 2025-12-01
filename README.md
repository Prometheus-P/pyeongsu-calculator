# 평수 계산기 (Pyeongsu Calculator)

제곱미터(㎡)와 평을 실시간으로 변환하는 웹 계산기입니다.

## 주요 기능

- 제곱미터 → 평 실시간 변환
- 평 → 제곱미터 실시간 변환
- 빠른 평형 버튼 (10평 ~ 40평)
- 일반적인 평형 참고표
- 반응형 디자인 (모바일 지원)

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Astro 4 + React 18 |
| 스타일링 | Tailwind CSS |
| 테스트 | Vitest + Playwright |
| 배포 | Cloudflare Pages |
| 언어 | TypeScript |

## 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 테스트 실행
npm run test

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
📦 pyeongsu-calculator/
├── src/
│   ├── components/       # React 컴포넌트
│   ├── utils/           # 유틸리티 함수
│   └── __tests__/       # 테스트 파일
├── README.md            # 프로젝트 개요
├── plan.md              # TDD 태스크 목록
├── CONTRIBUTING.md      # 기여 가이드
└── package.json         # 의존성 관리
```

## 문서

### 개발 문서
- [plan.md](./plan.md) - TDD 태스크 목록 및 진행 상황
- [CONTRIBUTING.md](./CONTRIBUTING.md) - 기여 가이드라인

### 배포 가이드
- [🚀 배포 빠른 시작](./docs/DEPLOYMENT-QUICKSTART.md) - **여기서 시작하세요!**
- [Cloudflare Pages 설정](./docs/cloudflare-pages-setup.md) - Cloudflare 배포 가이드
- [Google Analytics 설정](./docs/google-analytics-setup.md) - GA4 설정 가이드
- [검색엔진 등록](./docs/search-console-setup.md) - Google/Naver 등록 가이드
- [전체 배포 체크리스트](./docs/deployment-checklist.md) - 상세 체크리스트
- [CI/CD 분석](./docs/ci-cd-analysis.md) - CI/CD 상태 및 보안 분석

## 라이선스

MIT License
