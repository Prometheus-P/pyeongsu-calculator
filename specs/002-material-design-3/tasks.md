# Tasks: Material Design 3 디자인 시스템

**Feature Branch**: `002-material-design-3`
**Generated**: 2025-12-02
**Total Tasks**: 35

## Overview

| Phase | Name | Tasks | Parallel |
|-------|------|-------|----------|
| 1 | Setup | 5 | 5 |
| 2 | Foundational (CSS) | 4 | 3 |
| 3 | User Story 1 (P1) | 8 | 6 |
| 4 | User Story 2 (P2) | 5 | 3 |
| 5 | User Story 3 (P3) | 4 | 2 |
| 6 | Testing & Validation | 6 | 4 |
| 7 | Polish | 3 | 2 |

---

## Phase 1: Setup (Tailwind Token Configuration)

**Goal**: Configure M3 design tokens in Tailwind CSS

**Validation**: `npm run build` succeeds without errors

- [ ] T001 [P] Add M3 color tokens to theme.extend.colors in tailwind.config.js
- [ ] T002 [P] Add M3 typography scale to theme.extend.fontSize in tailwind.config.js
- [ ] T003 [P] Add M3 spacing tokens (4px grid) to theme.extend.spacing in tailwind.config.js
- [ ] T004 [P] Add M3 elevation shadows to theme.extend.boxShadow in tailwind.config.js
- [ ] T005 [P] Add M3 border radius tokens to theme.extend.borderRadius in tailwind.config.js

### Parallel Execution Example (Phase 1)

```bash
# All 5 tasks modify different sections of tailwind.config.js
# Can be done in single file edit session
Task: "Edit tailwind.config.js to add T001-T005 M3 tokens per data-model.md"
```

---

## Phase 2: Foundational (CSS Custom Properties)

**Goal**: Define CSS custom properties for runtime theme switching

**Validation**: Both light and dark mode colors render correctly

**Dependencies**: Phase 1 complete

- [ ] T006 Define M3 color CSS custom properties for light mode in src/styles/global.css
- [ ] T007 [P] Define M3 color CSS custom properties for dark mode (.dark) in src/styles/global.css
- [ ] T008 [P] Add high contrast media query styles (prefers-contrast: more) in src/styles/global.css
- [ ] T009 [P] Add M3 state layer base classes (.m3-state-layer) in src/styles/global.css

### Parallel Execution Example (Phase 2)

```bash
# T006 must be first (defines :root variables)
# T007, T008, T009 can run in parallel after T006
```

---

## Phase 3: User Story 1 - 일관된 시각적 경험 (P1)

**Story**: 사용자가 평수 계산기를 사용할 때, 모든 UI 요소가 일관된 디자인 언어로 표현되어 전문적이고 신뢰감 있는 인상을 받는다.

**Independent Test**: 모든 페이지에서 동일한 색상 팔레트, 타이포그래피, 간격이 적용되었는지 시각적 검증.

**Dependencies**: Phase 2 complete

### Implementation Tasks

- [ ] T010 [P] [US1] Update input fields to M3 outlined style with border and focus colors in src/components/Calculator.tsx
- [ ] T011 [P] [US1] Update buttons to M3 filled/tonal styles with primary colors in src/components/Calculator.tsx
- [ ] T012 [P] [US1] Apply M3 card elevation (level 2) to calculator container in src/components/Calculator.tsx
- [ ] T013 [P] [US1] Update typography to M3 scale (headline-medium for title, body-medium for labels) in src/components/Calculator.tsx
- [ ] T014 [P] [US1] Apply M3 list item styling to history items in src/components/History.tsx
- [ ] T015 [P] [US1] Apply M3 table styling with surface colors in src/components/ReferenceTable.tsx
- [ ] T016 [US1] Apply M3 surface-variant color to footer in src/components/Footer.astro
- [ ] T017 [US1] Apply M3 surface color as page background in src/layouts/BaseLayout.astro

### Parallel Execution Example (Phase 3)

```bash
# T010-T015 can run in parallel (different components)
# T016, T017 can run in parallel after above
```

### Acceptance Criteria Verification

```gherkin
Given 사용자가 홈페이지를 방문할 때
When 계산기 UI를 확인하면
Then M3 색상 팔레트와 타이포그래피가 적용되어 있다

Given 다크 모드가 활성화될 때
When 페이지를 확인하면
Then M3 다크 테마 색상이 일관되게 적용된다
```

---

## Phase 4: User Story 2 - 향상된 사용성 (P2)

**Story**: 사용자가 계산기의 입력 필드와 버튼을 사용할 때, M3 컴포넌트의 명확한 시각적 피드백으로 쉽게 조작할 수 있다.

**Independent Test**: 모든 인터랙티브 요소에서 호버/포커스/활성 상태가 시각적으로 구분되는지 확인.

**Dependencies**: Phase 3 complete (or can run in parallel if using different components)

### Implementation Tasks

- [ ] T018 [P] [US2] Add m3-state-layer class to all buttons for hover/focus states in src/components/Calculator.tsx
- [ ] T019 [P] [US2] Add M3 focus ring (2px primary border) to input fields in src/components/Calculator.tsx
- [ ] T020 [P] [US2] Ensure all interactive elements have minimum 48px touch target in src/components/Calculator.tsx
- [ ] T021 [US2] Add m3-state-layer class to theme toggle button in src/components/ThemeToggle.tsx
- [ ] T022 [US2] Add optional ripple effect utility class in src/styles/global.css

### Acceptance Criteria Verification

```gherkin
Given 사용자가 버튼에 마우스를 올릴 때
When 호버 상태가 되면
Then M3 state layer (8% opacity overlay)가 표시된다

Given 사용자가 입력 필드에 포커스할 때
When 포커스 상태가 되면
Then M3 포커스 링 (2px primary border)이 표시된다
```

---

## Phase 5: User Story 3 - 다크/라이트 모드 전환 (P3)

**Story**: 사용자가 시스템 설정이나 토글을 통해 다크/라이트 모드를 전환할 때, 모든 UI 요소가 M3 색상 시스템에 맞게 부드럽게 전환된다.

**Independent Test**: 다크/라이트 모드 전환 시 모든 색상이 M3 팔레트에 맞게 변경되는지 확인.

**Dependencies**: Phase 2 complete (dark mode CSS properties must exist)

### Implementation Tasks

- [ ] T023 [P] [US3] Add 300ms transition for background-color and color properties in src/layouts/BaseLayout.astro
- [ ] T024 [P] [US3] Update theme toggle to use SVG sun/moon icons instead of emoji in src/components/ThemeToggle.tsx
- [ ] T025 [US3] Verify localStorage theme persistence works correctly in src/contexts/ThemeContext.tsx
- [ ] T026 [US3] Verify prefers-color-scheme detection on initial load in src/layouts/BaseLayout.astro

### Acceptance Criteria Verification

```gherkin
Given 시스템이 다크 모드일 때
When 페이지를 로드하면
Then M3 다크 팔레트가 자동 적용된다

Given 사용자가 헤더 우측의 테마 토글 아이콘을 클릭할 때
When 전환되면
Then 300ms 애니메이션으로 부드럽게 변경된다
```

---

## Phase 6: Testing & Validation

**Goal**: Ensure all acceptance criteria pass and quality gates met

**Dependencies**: Phases 3, 4, 5 complete

### E2E Test Tasks

- [ ] T027 [P] Create M3 visual consistency E2E test (color palette, typography) in e2e/m3.spec.ts
- [ ] T028 [P] Create state layer interaction E2E test (hover, focus states) in e2e/m3.spec.ts
- [ ] T029 [P] Create theme switching E2E test (toggle, animation timing) in e2e/m3.spec.ts
- [ ] T030 [P] Create high contrast mode E2E test (prefers-contrast) in e2e/m3.spec.ts

### Validation Tasks

- [ ] T031 Run Lighthouse accessibility audit and verify score ≥90
- [ ] T032 Verify bundle size increase is <5KB compared to main branch

---

## Phase 7: Polish & Documentation

**Goal**: Final refinements and cross-browser verification

**Dependencies**: Phase 6 complete

- [ ] T033 [P] Update quickstart.md with final implementation details in specs/002-material-design-3/quickstart.md
- [ ] T034 [P] Verify cross-browser compatibility (Chrome, Firefox, Safari)
- [ ] T035 Verify mobile responsive behavior on 320px-768px viewports

---

## Dependencies

### Story Dependency Graph

```
Phase 1 (Setup) ──────────────────────────┐
                                          ↓
Phase 2 (Foundational) ───────────────────┤
         │                                ↓
         ├──→ Phase 3 (US1: Visual) ─────→│
         │                                ↓
         ├──→ Phase 4 (US2: Usability) ──→│
         │                                ↓
         └──→ Phase 5 (US3: Theme) ──────→│
                                          ↓
                              Phase 6 (Testing)
                                          ↓
                              Phase 7 (Polish)
```

### User Story Independence

| Story | Can Start After | Independent Test |
|-------|-----------------|------------------|
| US1 | Phase 2 | Visual inspection of M3 colors/typography |
| US2 | Phase 2 | Hover/focus state verification |
| US3 | Phase 2 | Theme toggle functionality |

**Note**: US1, US2, US3 can technically run in parallel after Phase 2, but US2 and US3 depend on components styled in US1 for visual consistency.

---

## Path Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Config | `*.config.js` | `tailwind.config.js` |
| Styles | `src/styles/` | `src/styles/global.css` |
| Components | `src/components/` | `src/components/Calculator.tsx` |
| Layouts | `src/layouts/` | `src/layouts/BaseLayout.astro` |
| Contexts | `src/contexts/` | `src/contexts/ThemeContext.tsx` |
| E2E Tests | `e2e/` | `e2e/m3.spec.ts` |
| Specs | `specs/002-material-design-3/` | `specs/002-material-design-3/quickstart.md` |

---

## Implementation Strategy

### MVP Scope (User Story 1 Only)

For rapid delivery, implement Phase 1 + Phase 2 + Phase 3 (US1):
- 17 tasks total
- Delivers visual consistency across all components
- Can be validated independently

### Incremental Delivery

| Milestone | Phases | Tasks | Deliverable |
|-----------|--------|-------|-------------|
| MVP | 1-3 | T001-T017 | M3 visual design |
| Enhanced | 4 | T018-T022 | State layers & accessibility |
| Complete | 5-7 | T023-T035 | Theme switching & polish |

---

## Parallel Execution Summary

| Phase | Total | Parallelizable | Efficiency |
|-------|-------|----------------|------------|
| 1 | 5 | 5 | 100% |
| 2 | 4 | 3 | 75% |
| 3 | 8 | 6 | 75% |
| 4 | 5 | 3 | 60% |
| 5 | 4 | 2 | 50% |
| 6 | 6 | 4 | 67% |
| 7 | 3 | 2 | 67% |

**Total**: 35 tasks, 25 parallelizable (71% efficiency)
