# Implementation Plan: Material Design 3 디자인 시스템

**Feature Branch**: `002-material-design-3`
**Created**: 2025-12-02
**Status**: Planning Complete

## Technical Context

### Current Stack
| Component | Version | Notes |
|-----------|---------|-------|
| Astro | 4.16.x | Static Site Generation |
| React | 18.3.x | Islands Architecture |
| Tailwind CSS | 3.4.x | Utility-first CSS |
| TypeScript | 5.5.x | Type safety |
| Playwright | 1.57.x | E2E testing |

### Implementation Approach
**Selected**: Option A - Tailwind CSS + M3 Design Tokens
- Extend `tailwind.config.js` with M3 tokens
- Use CSS custom properties for runtime theme switching
- No external M3 libraries

### Key Decisions (from Clarifications)
| Decision | Choice |
|----------|--------|
| Implementation | Tailwind + M3 Tokens |
| Primary Color | Blue (#1976D2) |
| Input Style | Outlined |
| Theme Toggle | Header right icon |
| High Contrast | prefers-contrast media query |

---

## Constitution Check

### Principle Compliance

| Principle | Status | Notes |
|-----------|--------|-------|
| User-Centric Design | ✅ Pass | M3 improves accessibility and usability |
| Progressive Enhancement | ✅ Pass | CSS-only tokens, JS optional for theme toggle |
| Performance First | ✅ Pass | No external libraries, CSS-only <5KB |
| Code Quality | ✅ Pass | Token-based design, consistent naming |
| Maintainability | ✅ Pass | Centralized token definitions |

### Gate Evaluation
- **Gate 1** (Spec Quality): ✅ Clarifications complete
- **Gate 2** (Technical Feasibility): ✅ Tailwind extension proven
- **Gate 3** (Test Coverage): Pending implementation

---

## Implementation Phases

### Phase 1: Foundation (M3 Token Setup)

**Goal**: Establish M3 design token infrastructure

| Task | File | Description |
|------|------|-------------|
| T001 | `tailwind.config.js` | Add M3 color tokens as CSS variable references |
| T002 | `tailwind.config.js` | Add M3 typography scale |
| T003 | `tailwind.config.js` | Add M3 spacing (4px grid) |
| T004 | `tailwind.config.js` | Add M3 elevation shadows |
| T005 | `tailwind.config.js` | Add M3 border radius tokens |
| T006 | `src/styles/global.css` | Define CSS custom properties for light mode |
| T007 | `src/styles/global.css` | Define CSS custom properties for dark mode |
| T008 | `src/styles/global.css` | Add high contrast media query styles |
| T009 | `src/styles/global.css` | Add M3 state layer base classes |

**Validation**: Build succeeds, no Tailwind errors

---

### Phase 2: Component Migration (User Story 1)

**Goal**: Apply M3 visual consistency to all UI elements

| Task | File | Description |
|------|------|-------------|
| T010 | `src/components/Calculator.tsx` | Update input fields to M3 outlined style |
| T011 | `src/components/Calculator.tsx` | Update buttons to M3 filled/tonal styles |
| T012 | `src/components/Calculator.tsx` | Apply M3 card elevation |
| T013 | `src/components/Calculator.tsx` | Update typography to M3 scale |
| T014 | `src/components/History.tsx` | Apply M3 list item styling |
| T015 | `src/components/ReferenceTable.tsx` | Apply M3 table styling |
| T016 | `src/components/Footer.astro` | Apply M3 surface colors |
| T017 | `src/layouts/BaseLayout.astro` | Apply M3 background surface |

**Validation**: Visual inspection, Lighthouse accessibility score maintained

---

### Phase 3: Interaction States (User Story 2)

**Goal**: Implement M3 state layers for all interactive elements

| Task | File | Description |
|------|------|-------------|
| T018 | `src/components/Calculator.tsx` | Add state layer to buttons |
| T019 | `src/components/Calculator.tsx` | Add focus ring to inputs |
| T020 | `src/components/Calculator.tsx` | Ensure 48px touch targets |
| T021 | `src/components/ThemeToggle.tsx` | Add state layer to toggle |
| T022 | `src/styles/global.css` | Add ripple effect (optional) |

**Validation**: E2E tests for hover/focus states

---

### Phase 4: Theme Switching (User Story 3)

**Goal**: Smooth dark/light mode transition with M3 palettes

| Task | File | Description |
|------|------|-------------|
| T023 | `src/layouts/BaseLayout.astro` | Add 300ms theme transition |
| T024 | `src/components/ThemeToggle.tsx` | Update to SVG sun/moon icons |
| T025 | `src/contexts/ThemeContext.tsx` | Ensure localStorage persistence |
| T026 | `src/layouts/BaseLayout.astro` | Verify prefers-color-scheme detection |

**Validation**: Theme toggle E2E test, no flash on reload

---

### Phase 5: Testing & Validation

**Goal**: Ensure quality gates pass

| Task | File | Description |
|------|------|-------------|
| T027 | `e2e/m3.spec.ts` | Create M3 visual consistency tests |
| T028 | `e2e/m3.spec.ts` | Create state layer interaction tests |
| T029 | `e2e/m3.spec.ts` | Create theme switching tests |
| T030 | `e2e/m3.spec.ts` | Create high contrast mode tests |
| T031 | - | Run Lighthouse accessibility audit |
| T032 | - | Verify bundle size <5KB increase |

**Validation**: All E2E tests pass, Lighthouse ≥90

---

### Phase 6: Polish & Documentation

**Goal**: Final refinements and documentation

| Task | File | Description |
|------|------|-------------|
| T033 | `specs/002-material-design-3/quickstart.md` | Update with final implementation details |
| T034 | - | Cross-browser testing (Chrome, Firefox, Safari) |
| T035 | - | Mobile responsive verification |

---

## Dependency Graph

```
T001-T005 (Tailwind tokens)
    ↓
T006-T009 (CSS properties)
    ↓
T010-T017 (Component visual) ←── parallel
    ↓
T018-T022 (Interactions)
    ↓
T023-T026 (Theme switching)
    ↓
T027-T032 (Testing)
    ↓
T033-T035 (Polish)
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tailwind class conflicts | Medium | Use `m3-` prefix namespace |
| Dark mode flash | Low | Inline script already in place |
| Bundle size increase | Low | CSS-only, no JS libraries |
| Existing test failures | Medium | Incremental migration, test after each phase |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| WCAG AA Compliance | 100% | Lighthouse accessibility |
| E2E Test Pass Rate | 100% | Playwright results |
| Bundle Size Increase | <5KB | Build output comparison |
| Theme Switch Time | <300ms | Performance profiling |
| Cross-browser Support | 3 browsers | Manual + E2E testing |

---

## Artifacts Generated

| Artifact | Path |
|----------|------|
| Feature Spec | `specs/002-material-design-3/spec.md` |
| Research | `specs/002-material-design-3/research.md` |
| Data Model | `specs/002-material-design-3/data-model.md` |
| Quickstart | `specs/002-material-design-3/quickstart.md` |
| Implementation Plan | `specs/002-material-design-3/plan.md` |

---

## Next Steps

1. Run `/speckit.tasks` to generate actionable task list
2. Begin Phase 1 implementation
3. Run E2E tests after each phase
