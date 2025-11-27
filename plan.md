# 평수 계산기 TDD 개발 계획

> 기존 standalone.html 및 pyeongsu-calculator.jsx의 기능을 TDD 방식으로 재구현

## 진행 상황

- 총 항목: 15개
- 완료: 15개
- 진행률: 100%

---

## 1. 유틸리티 함수 (converter.ts)

### 1.1 제곱미터 → 평 변환 함수
- [x] `convertSqmToPyeong(sqm: number): number` 구현
- 테스트: 33.06㎡ → 10평 (오차 0.01 이내)
- 파일: `src/utils/converter.ts`

### 1.2 평 → 제곱미터 변환 함수
- [x] `convertPyeongToSqm(pyeong: number): number` 구현
- 테스트: 10평 → 33.06㎡ (오차 0.01 이내)
- 파일: `src/utils/converter.ts`

### 1.3 숫자 포맷팅 함수
- [x] `formatNumber(value: number, decimals?: number): string` 구현
- 테스트: 소수점 둘째자리 반올림
- 파일: `src/utils/converter.ts`

### 1.4 입력값 유효성 검사 함수
- [x] `isValidInput(value: string): boolean` 구현
- 테스트: 빈 문자열, '.', 음수, 유효한 숫자
- 파일: `src/utils/converter.ts`

---

## 2. Calculator 컴포넌트

### 2.1 기본 렌더링
- [x] 제목 "평수 계산기" 렌더링
- [x] 제곱미터 입력 필드 렌더링
- [x] 평 입력 필드 렌더링
- 파일: `src/components/Calculator.tsx`

### 2.2 제곱미터 → 평 변환 (실시간)
- [x] 제곱미터 입력 시 평 필드 자동 업데이트
- 테스트: 33.06 입력 → 평 필드에 10.00 표시
- 파일: `src/components/Calculator.tsx`

### 2.3 평 → 제곱미터 변환 (실시간)
- [x] 평 입력 시 제곱미터 필드 자동 업데이트
- 테스트: 10 입력 → 제곱미터 필드에 33.06 표시
- 파일: `src/components/Calculator.tsx`

### 2.4 초기화 기능
- [x] 초기화 버튼 클릭 시 모든 필드 비움
- 테스트: 값 입력 후 초기화 → 빈 필드
- 파일: `src/components/Calculator.tsx`

### 2.5 빠른 평형 버튼
- [x] 10, 15, 20, 25, 30, 35, 40평 버튼 렌더링
- [x] 버튼 클릭 시 해당 값으로 필드 업데이트
- 테스트: 30평 버튼 클릭 → 평: 30, 제곱미터: 99.17
- 파일: `src/components/Calculator.tsx`

---

## 3. ReferenceTable 컴포넌트

### 3.1 참고표 렌더링
- [x] 일반적인 평형 목록 7개 렌더링
- [x] 각 항목에 평, 제곱미터, 타입 표시
- 파일: `src/components/ReferenceTable.tsx`

### 3.2 참고표 클릭 동작
- [x] 참고표 항목 클릭 시 Calculator에 값 전달
- 테스트: 25평 항목 클릭 → 입력 필드 업데이트
- 파일: `src/components/ReferenceTable.tsx`

---

## 4. 통합 및 스타일링

### 4.1 App 컴포넌트 통합
- [x] Calculator와 ReferenceTable 통합
- [x] 반응형 레이아웃 적용
- 파일: `src/App.tsx`

### 4.2 Tailwind CSS 스타일링
- [x] 기존 디자인 재현 (그라데이션 배경, 카드 UI)
- [x] 모바일 반응형 스타일
- 파일: `src/components/*.tsx`

---

## 커밋 기록

| 항목 | 커밋 해시 | 날짜 |
|------|----------|------|
| 1.1 convertSqmToPyeong | 0422476 | 2025-11-25 |
| 1.2 convertPyeongToSqm | 18276c4 | 2025-11-25 |
| 1.3 formatNumber | 34cc76e | 2025-11-25 |
| 1.4 isValidInput | ea10744 | 2025-11-25 |
| 2.1 Calculator 기본 렌더링 | 5bd2367 | 2025-11-25 |
| 2.2 제곱미터→평 변환 | b0ba2d0 | 2025-11-25 |
| 2.3 평→제곱미터 변환 | 9a0ca37 | 2025-11-25 |
| 2.4 초기화 기능 | fbdc2f4 | 2025-11-25 |
| 2.5 빠른 평형 버튼 | e7ea473 | 2025-11-25 |
| 3.1 참고표 렌더링 | be8aae1 | 2025-11-25 |
| 3.2 참고표 클릭 동작 | 1792540 | 2025-11-25 |
| 4.1 App 통합 | 31aa19c | 2025-11-25 |
| 4.2 Tailwind 스타일링 | c234be9 | 2025-11-25 |

---

## Phase 2: 추가 기능 (예정)

- 총 항목: 8개
- 완료: 4개
- 진행률: 50%

---

## 5. 사용자 편의 기능

### 5.1 계산 히스토리
- [x] 최근 변환 기록 저장 (localStorage 활용)
- [x] 히스토리 목록 표시 컴포넌트
- [x] 히스토리 항목 클릭 시 값 복원
- 테스트: 변환 후 새로고침해도 기록 유지
- 파일: `src/components/History.tsx`, `src/utils/storage.ts`

### 5.2 클립보드 복사
- [x] 결과값 복사 버튼 추가
- [x] 복사 완료 피드백 (토스트 메시지)
- 테스트: 복사 버튼 클릭 → 클립보드에 값 저장
- 파일: `src/components/Calculator.tsx`

### 5.3 URL 공유
- [x] 현재 계산 결과를 URL 쿼리 파라미터로 반영
- [x] URL 접속 시 파라미터 값으로 자동 계산
- 테스트: `?pyeong=30` 접속 → 30평, 99.17㎡ 표시
- 파일: `src/App.tsx`, `src/hooks/useQueryParams.ts`

---

## 6. UI/UX 개선

### 6.1 다크 모드
- [x] 다크/라이트 테마 토글 버튼
- [x] 시스템 설정 자동 감지 (prefers-color-scheme)
- [x] 테마 설정 localStorage 저장
- 파일: `src/contexts/ThemeContext.tsx`, `src/components/ThemeToggle.tsx`, `tailwind.config.js`

### 6.2 키보드 접근성
- [ ] Enter 키로 다음 필드 이동
- [ ] Escape 키로 초기화
- [ ] 키보드 단축키 안내 툴팁
- 파일: `src/components/Calculator.tsx`

---

## 7. 단위 확장

### 7.1 추가 면적 단위
- [ ] 에이커 (acre) 변환 지원
- [ ] 제곱피트 (sq ft) 변환 지원
- [ ] 단위 선택 드롭다운 UI
- 파일: `src/utils/converter.ts`, `src/constants/conversion.ts`

---

## 8. 기술 개선

### 8.1 PWA 지원
- [ ] Service Worker 구현 (오프라인 사용)
- [ ] manifest.json 설정
- [ ] 앱 설치 프롬프트
- 파일: `public/manifest.json`, `src/sw.ts`

### 8.2 성능 최적화
- [ ] React.memo 적용
- [ ] 입력 디바운싱 (300ms)
- [ ] Lighthouse 성능 점수 90+ 달성
- 파일: `src/components/*.tsx`
