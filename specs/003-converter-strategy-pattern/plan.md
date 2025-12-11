# Implementation Plan: Converter Strategy Pattern Refactor

**Branch**: `003-converter-strategy-pattern` | **Date**: 2025-12-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-converter-strategy-pattern/spec.md`

**Status**: IMPLEMENTATION COMPLETE - All tasks verified

## Summary

Refactor `src/utils/converter.ts` to implement a high-performance Strategy Pattern for unit conversion with O(1) lookup time complexity. The implementation uses a module-scoped registry that maps unit identifiers to conversion strategies, with all conversions going through sqm as the canonical base unit.

**Key Design Decisions (from Clarifications):**
- Invalid inputs (NaN, undefined) return `NaN` per JavaScript conventions
- Registry uses module-scoped `Map` pattern (accessed via wrapper functions)
- Only wrapper functions are exported; registry internals are encapsulated

## Technical Context

**Language/Version**: TypeScript 5.5
**Primary Dependencies**: None (pure TypeScript, no external libraries)
**Storage**: N/A (stateless utility functions)
**Testing**: Vitest (unit tests + benchmarks)
**Target Platform**: Web (Astro + React Islands, runs in browser)
**Project Type**: Web application
**Performance Goals**: All conversions <1ms (NFR-001), single frame updates (16ms)
**Constraints**: Bundle size increase <500 bytes gzipped (NFR-002)
**Scale/Scope**: 4 unit types (sqm, pyeong, sqft, acre), extensible via registerUnit()

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. User-Centric Design | ✅ Pass | O(1) lookups ensure instant feedback, no perceived delay |
| II. Progressive Enhancement | ✅ Pass | Pure utility functions, no JS framework dependency |
| III. Performance First | ✅ Pass | <1ms target, bundle size constraint defined |
| IV. Code Quality | ✅ Pass | Lint/format checks required in success criteria |
| V. Maintainability | ✅ Pass | Registry pattern enables easy unit addition |

## Project Structure

### Documentation (this feature)

```text
specs/003-converter-strategy-pattern/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API contracts for utility)
└── tasks.md             # Phase 2 output (COMPLETE - 31 tasks done)
```

### Source Code (repository root)

```text
src/
├── utils/
│   ├── converter.ts       # Target file (REFACTORED)
│   ├── converter.test.ts  # Unit tests (56 tests passing)
│   └── converter.bench.ts # Performance benchmarks
├── constants/
│   └── conversion.ts      # Conversion ratios (preserved)
└── ...
```

**Structure Decision**: Single file refactor in existing `src/utils/converter.ts`. No new directories or architectural changes needed.

## Implementation Status

### Verified Complete

| Component | Status | Verification |
|-----------|--------|--------------|
| UnitType definition | ✅ | Line 18 |
| ConversionStrategy interface | ✅ | Lines 24-29 |
| Module-scoped registry | ✅ | Lines 35-56 |
| convert() generic function | ✅ | Lines 66-70 |
| Wrapper functions (12) | ✅ | Lines 76-150 |
| registerUnit() extensibility | ✅ | Lines 160-166 |
| All tests passing | ✅ | 196 tests pass |
| Lint/format clean | ✅ | Verified |

## Complexity Tracking

> No violations - implementation follows minimal complexity approach.

| Aspect | Implementation | Why Minimal |
|--------|---------------|-------------|
| Registry | `Record<string, ConversionStrategy>` | Object literal, O(1) lookup, no class overhead |
| Strategy | Interface with 2 functions | Minimal surface, pure functions |
| Export | Wrapper functions only | Encapsulation, tree-shakeable |
