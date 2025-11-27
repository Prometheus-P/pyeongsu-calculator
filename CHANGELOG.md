# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/lang/ko/spec/v2.0.0.html).

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

### Phase 2 계획

**5. 사용자 편의 기능**
- 계산 히스토리 (localStorage)
- 클립보드 복사
- URL 공유

**6. UI/UX 개선**
- 다크 모드
- 키보드 접근성

**7. 단위 확장**
- 에이커, 제곱피트 변환 지원

**8. 기술 개선**
- PWA 지원
- 성능 최적화

---

[1.0.0]: https://github.com/username/pyeongsu-calculator/releases/tag/v1.0.0
[Unreleased]: https://github.com/username/pyeongsu-calculator/compare/v1.0.0...HEAD
