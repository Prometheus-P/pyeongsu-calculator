# Tasks: Converter Strategy Pattern Refactor

**Input**: Design documents from `/specs/003-converter-strategy-pattern/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Existing test suite (292 lines) must pass unchanged. No new tests required per spec.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Web application (Astro + React Islands)
- **Source**: `src/` at repository root
- **Target file**: `src/utils/converter.ts` (refactor in place)

---

## Phase 1: Setup

**Purpose**: No setup required - this is a refactor of existing code in place

- [x] T001 Verify existing tests pass before refactor: `npm run test:run`
- [x] T002 Record current bundle size baseline: `npm run build`

---

## Phase 2: Foundational (Type Definitions)

**Purpose**: Define core types that ALL user stories depend on

**CRITICAL**: These types must be defined before any strategy implementation

- [x] T003 Define `UnitType` type alias in `src/utils/converter.ts`
- [x] T004 Define `ConversionStrategy` interface with `toBase` and `fromBase` functions in `src/utils/converter.ts`
- [x] T005 Define internal `registry` constant with type `Record<UnitType, ConversionStrategy>` in `src/utils/converter.ts`

**Checkpoint**: Foundation ready - type structure in place

---

## Phase 3: User Story 1 & 2 - Instant & Accurate Unit Conversion (Priority: P1)

**Goal**: Implement O(1) registry lookups while preserving calculation accuracy and passing all existing tests

**Independent Test**: Run `npm run test:run` - all 292 lines of existing tests must pass unchanged

### Implementation for User Stories 1 & 2

- [x] T006 [US1] Implement `sqm` strategy (identity functions) in registry in `src/utils/converter.ts`
- [x] T007 [P] [US1] Implement `pyeong` strategy using `PYEONG_TO_SQM_RATIO` and `SQM_TO_PYEONG_RATIO` in `src/utils/converter.ts`
- [x] T008 [P] [US1] Implement `sqft` strategy using `SQFT_TO_SQM_RATIO` and `SQM_TO_SQFT_RATIO` in `src/utils/converter.ts`
- [x] T009 [P] [US1] Implement `acre` strategy using `ACRE_TO_SQM_RATIO` and `SQM_TO_ACRE_RATIO` in `src/utils/converter.ts`
- [x] T010 [US2] Refactor `convertSqmToPyeong` to use `registry.pyeong.fromBase()` in `src/utils/converter.ts`
- [x] T011 [P] [US2] Refactor `convertPyeongToSqm` to use `registry.pyeong.toBase()` in `src/utils/converter.ts`
- [x] T012 [P] [US2] Refactor `convertSqmToSqft` to use `registry.sqft.fromBase()` in `src/utils/converter.ts`
- [x] T013 [P] [US2] Refactor `convertSqftToSqm` to use `registry.sqft.toBase()` in `src/utils/converter.ts`
- [x] T014 [P] [US2] Refactor `convertSqmToAcre` to use `registry.acre.fromBase()` in `src/utils/converter.ts`
- [x] T015 [P] [US2] Refactor `convertAcreToSqm` to use `registry.acre.toBase()` in `src/utils/converter.ts`
- [x] T016 [US2] Refactor `convertPyeongToSqft` to use generic conversion via registry in `src/utils/converter.ts`
- [x] T017 [P] [US2] Refactor `convertSqftToPyeong` to use generic conversion via registry in `src/utils/converter.ts`
- [x] T018 [P] [US2] Refactor `convertPyeongToAcre` to use generic conversion via registry in `src/utils/converter.ts`
- [x] T019 [P] [US2] Refactor `convertAcreToPyeong` to use generic conversion via registry in `src/utils/converter.ts`
- [x] T020 [US1] Add generic `convert(value: number, from: UnitType, to: UnitType): number` function in `src/utils/converter.ts`
- [x] T021 [US2] Run existing test suite to verify accuracy: `npm run test:run`

**Checkpoint**: User Stories 1 & 2 complete - O(1) lookups with 100% test pass

---

## Phase 4: User Story 3 - Developer Adds New Unit Support (Priority: P2)

**Goal**: Enable developers to add new units at runtime without modifying core code

**Independent Test**: Call `registerUnit('hectare', ...)` then verify `convert(10000, 'sqm', 'hectare')` returns `1`

### Implementation for User Story 3

- [x] T022 [US3] Implement `registerUnit(unitType, toBase, fromBase)` function in `src/utils/converter.ts`
- [x] T023 [US3] Export `UnitType` type for external use in `src/utils/converter.ts`
- [x] T024 [US3] Export `ConversionStrategy` interface for external use in `src/utils/converter.ts`
- [x] T025 [US3] Export `convert` function for external use in `src/utils/converter.ts`
- [x] T026 [US3] Export `registerUnit` function for external use in `src/utils/converter.ts`

**Checkpoint**: User Story 3 complete - new units can be registered at runtime

---

## Phase 5: Polish & Validation

**Purpose**: Final verification of all requirements

- [x] T027 Run lint check: `npm run lint`
- [x] T028 Run format check: `npm run format:check`
- [x] T029 Run full test suite: `npm run test:run`
- [x] T030 Build and verify bundle size increase <500 bytes: `npm run build`
- [x] T031 Verify all exports are tree-shakeable (manual code review)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verify baseline first
- **Foundational (Phase 2)**: Depends on Setup - defines types
- **US1 & US2 (Phase 3)**: Depends on Foundational - implements core functionality
- **US3 (Phase 4)**: Depends on Phase 3 - adds extensibility
- **Polish (Phase 5)**: Depends on all user stories

### User Story Dependencies

- **User Stories 1 & 2 (P1)**: Combined because both require the same registry implementation
- **User Story 3 (P2)**: Depends on US1/US2 (needs working registry to extend)

### Within Each Phase

- Registry strategies (T007-T009) can run in parallel [P]
- Direct wrapper refactors (T011-T015) can run in parallel [P]
- Cross-unit refactors (T017-T019) can run in parallel [P]

### Parallel Opportunities

**Phase 3 - Strategies parallel:**
```
T007, T008, T009 can run in parallel (different unit strategies)
```

**Phase 3 - Direct wrappers parallel:**
```
T011, T012, T013, T014, T015 can run in parallel (independent functions)
```

**Phase 3 - Cross-unit wrappers parallel:**
```
T017, T018, T019 can run in parallel (independent functions)
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T005)
3. Complete Phase 3: User Stories 1 & 2 (T006-T021)
4. **VALIDATE**: All existing tests pass, O(1) performance verified
5. **MVP READY**: Core refactor complete with backward compatibility

### Full Implementation

1. Complete MVP (Phases 1-3)
2. Add Phase 4: User Story 3 (T022-T026) - Extensibility
3. Complete Phase 5: Polish (T027-T031) - Final validation
4. **FULL RELEASE READY**

### Task Counts by Phase

| Phase | Tasks | Parallel | Description |
|-------|-------|----------|-------------|
| Setup | 2 | 0 | Baseline verification |
| Foundational | 3 | 0 | Type definitions |
| US1 & US2 (P1) | 16 | 12 | Core implementation |
| US3 (P2) | 5 | 0 | Extensibility |
| Polish | 5 | 0 | Final validation |
| **Total** | **31** | **12** | |

---

## Notes

- [P] tasks = different functions/strategies, no dependencies
- [US1/US2] = Performance and accuracy (tightly coupled, both P1)
- [US3] = Extensibility (P2, depends on working core)
- All refactors preserve existing function signatures
- Existing test suite (292 lines) serves as regression test
- No new test files needed - existing tests validate accuracy
- Single file refactor: only `src/utils/converter.ts` is modified
