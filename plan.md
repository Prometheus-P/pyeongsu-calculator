# 평수 계산기 TDD 개발 계획

> 기존 standalone.html 및 pyeongsu-calculator.jsx의 기능을 TDD 방식으로 재구현

## 진행 상황

- 총 항목: 15개
- 완료: 4개
- 진행률: 27%

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
- [ ] 제목 "평수 계산기" 렌더링
- [ ] 제곱미터 입력 필드 렌더링
- [ ] 평 입력 필드 렌더링
- 파일: `src/components/Calculator.tsx`

### 2.2 제곱미터 → 평 변환 (실시간)
- [ ] 제곱미터 입력 시 평 필드 자동 업데이트
- 테스트: 33.06 입력 → 평 필드에 10.00 표시
- 파일: `src/components/Calculator.tsx`

### 2.3 평 → 제곱미터 변환 (실시간)
- [ ] 평 입력 시 제곱미터 필드 자동 업데이트
- 테스트: 10 입력 → 제곱미터 필드에 33.06 표시
- 파일: `src/components/Calculator.tsx`

### 2.4 초기화 기능
- [ ] 초기화 버튼 클릭 시 모든 필드 비움
- 테스트: 값 입력 후 초기화 → 빈 필드
- 파일: `src/components/Calculator.tsx`

### 2.5 빠른 평형 버튼
- [ ] 10, 15, 20, 25, 30, 35, 40평 버튼 렌더링
- [ ] 버튼 클릭 시 해당 값으로 필드 업데이트
- 테스트: 30평 버튼 클릭 → 평: 30, 제곱미터: 99.17
- 파일: `src/components/Calculator.tsx`

---

## 3. ReferenceTable 컴포넌트

### 3.1 참고표 렌더링
- [ ] 일반적인 평형 목록 7개 렌더링
- [ ] 각 항목에 평, 제곱미터, 타입 표시
- 파일: `src/components/ReferenceTable.tsx`

### 3.2 참고표 클릭 동작
- [ ] 참고표 항목 클릭 시 Calculator에 값 전달
- 테스트: 25평 항목 클릭 → 입력 필드 업데이트
- 파일: `src/components/ReferenceTable.tsx`

---

## 4. 통합 및 스타일링

### 4.1 App 컴포넌트 통합
- [ ] Calculator와 ReferenceTable 통합
- [ ] 반응형 레이아웃 적용
- 파일: `src/App.tsx`

### 4.2 Tailwind CSS 스타일링
- [ ] 기존 디자인 재현 (그라데이션 배경, 카드 UI)
- [ ] 모바일 반응형 스타일
- 파일: `src/components/*.tsx`

---

## 커밋 기록

| 항목 | 커밋 해시 | 날짜 |
|------|----------|------|
| 1.1 convertSqmToPyeong | 0422476 | 2025-11-25 |
| 1.2 convertPyeongToSqm | 18276c4 | 2025-11-25 |
| 1.3 formatNumber | 34cc76e | 2025-11-25 |
| 1.4 isValidInput | ea10744 | 2025-11-25 |
