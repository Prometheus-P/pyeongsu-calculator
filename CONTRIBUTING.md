# 기여 가이드라인

이 문서는 프로젝트에 기여할 때 따라야 할 규칙을 정의합니다.

## TDD 개발 사이클

모든 기능 구현 시 아래 사이클을 따릅니다:

```
┌─────────────────────────────────────────┐
│  1. RED    → 실패하는 테스트 작성       │
│  2. GREEN  → 테스트 통과 최소 코드      │
│  3. REFACTOR → 코드 개선 (테스트 유지)  │
│  4. COMMIT → 규칙에 맞는 커밋           │
│  5. UPDATE → plan.md 체크 + 해시 기록   │
└─────────────────────────────────────────┘
```

## Git 규칙

### 커밋 메시지 형식

```
<type>(<scope>): <subject>

Refs: plan.md#<section>.<item>
Tests: <test_file>:<test_name>
```

### Type 종류

| Type     | 용도                        |
|----------|---------------------------|
| feat     | 새 기능 (테스트 포함)       |
| fix      | 버그 수정 (테스트 포함)     |
| refactor | 구조 개선 (기능 변경 없음)  |
| style    | UI/스타일 변경              |
| test     | 테스트만 추가/수정          |
| docs     | 문서만 변경                 |
| chore    | 빌드/설정 변경              |

### 예시

```
feat(converter): add sqm to pyeong conversion

Refs: plan.md#1.1
Tests: converter.test.ts:convertSqmToPyeong
```

### 브랜치 전략

- `main`: 배포 브랜치 (직접 커밋 금지)
- `feat/*`: 기능 개발
- `fix/*`: 버그 수정

### 핵심 원칙

- 구조 변경(Tidy)과 기능 변경(Behavior)을 **같은 커밋에 혼합 금지**
- 하나의 커밋 = 하나의 논리적 변경
- 테스트 실패 상태에서 커밋 금지

## 코드 스타일

### 클린 코드 기준

| 항목          | 기준        |
|--------------|-----------|
| 함수 길이     | 20줄 이하   |
| 컴포넌트 길이 | 100줄 이하  |
| 중첩 깊이     | 3단계 이하  |
| 매개변수 수   | 4개 이하    |

### 네이밍 규칙

| 요소              | 규칙            | 예시                    |
|------------------|----------------|------------------------|
| 변수/함수         | camelCase      | `convertSqmToPyeong`   |
| 컴포넌트/클래스   | PascalCase     | `PyeongCalculator`     |
| 상수             | UPPER_SNAKE    | `SQM_TO_PYEONG_RATIO`  |
| 테스트 설명       | 한글           | `'제곱미터를 평으로 변환한다'` |

### 파일 구조

```
src/
├── components/           # React 컴포넌트
│   ├── Calculator.tsx
│   └── Calculator.test.tsx
├── utils/               # 유틸리티 함수
│   ├── converter.ts
│   └── converter.test.ts
└── constants/           # 상수 정의
    └── conversion.ts
```

## 보안 규칙 (XSS 방지)

- `innerHTML` 대신 `textContent` 사용
- 사용자 입력은 항상 이스케이프 처리
- `dangerouslySetInnerHTML` 사용 금지
- 외부 스크립트 로드 시 무결성 검증

## 언어 규칙

| 요소         | 언어   |
|-------------|-------|
| 문서 내용    | 한국어 |
| 코드 주석    | 한국어 |
| 변수/함수명  | 영어   |
| 커밋 메시지  | 영어   |
| 테스트 설명  | 한국어 |

## Pull Request 규칙

1. PR 전 모든 테스트 통과 확인
2. plan.md 해당 항목 체크 확인
3. 리뷰어 지정 필수
4. CI 통과 후 머지
