# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/lang/ko/spec/v2.0.0.html).

## [2.0.0] - 2025-12-01

### BREAKING CHANGES

- **Vite → Astro 마이그레이션**: React SPA에서 Astro Islands 아키텍처로 전환
- 포트 변경: 5173 → 4321
- 빌드 명령어 변경: Astro CLI 사용

### Added

**사용자 편의 기능**
- 계산 히스토리 (localStorage 저장, 최근 10개)
- 클립보드 복사 버튼 + 토스트 피드백
- URL 쿼리 파라미터 공유 (`?pyeong=30`)

**UI/UX 개선**
- 다크 모드 (시스템 설정 자동 감지, localStorage 저장)
- 키보드 접근성 (Enter: 다음 필드, Escape: 초기화)
- Footer 컴포넌트 (내비게이션 링크, 저작권)
- 404 에러 페이지

**단위 확장**
- 에이커 (acre) ↔ 제곱미터 변환
- 제곱피트 (sq ft) ↔ 제곱미터 변환

**기술 개선**
- PWA 지원 (오프라인 사용, Service Worker)
- React.memo 성능 최적화
- SEO 최적화 (SSR, 구조화 데이터, 사이트맵)
- Google Analytics 4 통합
- AdSense 광고 슬롯 컴포넌트

**콘텐츠 페이지**
- 면적 변환 가이드 11개
- 개인정보처리방침, 이용약관, 사이트 소개
- OG 이미지 (소셜 미디어 공유)

**배포**
- Cloudflare Pages 배포 설정 (_headers, _redirects)
- 환경 변수 템플릿 (.env.example)

### Technical Details

| 구분 | 내용 |
|------|------|
| 프레임워크 | Astro 4.15 + React Islands |
| 테스트 | 196 unit tests + 31 E2E tests |
| 빌드 페이지 | 16 pages |
| CI/CD | GitHub Actions + Cloudflare Pages |

---

## [1.0.0] - 2025-11-27

### Added

**유틸리티 함수 (converter.ts)**
- `convertSqmToPyeong()`: 제곱미터 → 평 변환 함수
- `convertPyeongToSqm()`: 평 → 제곱미터 변환 함수
- `formatNumber()`: 숫자 포맷팅 함수 (소수점 둘째자리 반올림)
- `isValidInput()`: 입력값 유효성 검사 함수

**Calculator 컴포넌트**
- 제곱미터/평 입력 필드 실시간 양방향 변환
- 초기화 버튼
- 빠른 평형 버튼 (10, 15, 20, 25, 30, 35, 40평)

**ReferenceTable 컴포넌트**
- 일반적인 평형 참고표 (7개 항목)
- 참고표 항목 클릭 시 Calculator 값 연동

**기타**
- React 18 + TypeScript + Vite 기반 프로젝트 구조
- Tailwind CSS 반응형 디자인
- Vitest + Testing Library 테스트 환경 (131개 테스트)
- Playwright E2E 테스트 환경
- CI/CD 파이프라인 (GitHub Actions)
- XSS 방지 보안 테스트

### Technical Details

| 구분 | 내용 |
|------|------|
| 변환 공식 | 1평 = 3.3058㎡ |
| 테스트 커버리지 | 131 tests passed |
| 빌드 크기 | ~47KB (gzip) |

---

## [Unreleased]

### 계획

**선택적 기능**
- 키보드 단축키 안내 툴팁
- 단위 선택 드롭다운 UI
- Lighthouse 성능 점수 90+ 최적화

---

[2.0.0]: https://github.com/Prometheus-P/pyeongsu-calculator/releases/tag/v2.0.0
[1.0.0]: https://github.com/Prometheus-P/pyeongsu-calculator/releases/tag/v1.0.0
[Unreleased]: https://github.com/Prometheus-P/pyeongsu-calculator/compare/v2.0.0...HEAD
