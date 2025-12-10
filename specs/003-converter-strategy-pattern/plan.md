# Implementation Plan: Converter Strategy Pattern Refactor

**Branch**: `003-converter-strategy-pattern` | **Date**: 2025-12-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-converter-strategy-pattern/spec.md`

## Summary

Refactor `src/utils/converter.ts` to implement a high-performance Strategy Pattern with a ConversionRegistry providing O(1) lookups. Use sqm as the base unit, maintain pure functions for tree-shaking, preserve all existing function signatures for backward compatibility, and ensure 100% existing test pass rate.

## Technical Context

**Language/Version**: TypeScript 5.5
**Primary Dependencies**: None (pure TypeScript, no external libraries)
**Storage**: N/A (stateless utility functions)
**Testing**: Vitest 2.0.5 (292 lines of existing tests in `src/utils/converter.test.ts`)
**Target Platform**: Web (Browser via Vite/Rollup bundling)
**Project Type**: Web application (Astro + React Islands)
**Performance Goals**: O(1) conversion lookups, <1ms per conversion, 60fps UI updates
**Constraints**: <500 bytes gzipped bundle increase, pure functions, tree-shakeable
**Scale/Scope**: 4 units (sqm, pyeong, sqft, acre), 10 existing conversion functions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. User-Centric Design | ☑ Pass | Instant conversions maintain user trust; no UX changes |
| II. Progressive Enhancement | ☑ Pass | Pure utility functions work with or without JS framework |
| III. Performance First | ☑ Pass | O(1) lookups, <1ms target, <500 bytes increase |
| IV. Code Quality | ☑ Pass | TypeScript, ESLint/Prettier compliance required |
| V. Maintainability | ☑ Pass | Registry pattern centralizes unit definitions; easy to extend |

## Project Structure

### Documentation (this feature)

```text
specs/003-converter-strategy-pattern/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── utils/
│   ├── converter.ts           # REFACTOR: Add ConversionRegistry + Strategy Pattern
│   └── converter.test.ts      # PRESERVE: 292 lines of existing tests (must pass)
└── constants/
    └── conversion.ts          # PRESERVE: Existing ratios used by registry

tests/
└── (existing structure - no changes needed)
```

**Structure Decision**: Minimal structural changes. Refactor existing `converter.ts` in-place, keeping all exports. No new directories needed. Registry and strategies are internal implementation details.

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
