# Feature Specification: Converter Strategy Pattern Refactor

**Feature Branch**: `003-converter-strategy-pattern`
**Created**: 2025-12-10
**Status**: Draft
**Input**: User description: "Refactor 'src/utils/converter.ts' to implement a high-performance Strategy Pattern for unit conversion, ensuring O(1) execution time for Core Web Vitals optimization."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Instant Unit Conversion (Priority: P1)

A user enters a value in one unit field and immediately sees the converted values in all other unit fields without any perceptible delay.

**Why this priority**: This is the core functionality of the calculator. Users expect real-time conversion with no lag, which directly impacts user trust and Core Web Vitals (INP - Interaction to Next Paint).

**Independent Test**: Can be fully tested by entering any numeric value in any unit field and verifying that all other fields update instantly with accurate conversions.

**Acceptance Scenarios**:

1. **Given** the calculator is loaded and idle, **When** a user types "100" in the sqm field, **Then** all other unit fields (pyeong, sqft, acre) display accurate converted values within 16ms (single frame).
2. **Given** any unit field contains a value, **When** the user modifies the value, **Then** all conversions complete and display before the next animation frame.
3. **Given** a large numeric value (e.g., 999,999,999), **When** the user enters this value, **Then** the conversion completes with the same performance as small values.

---

### User Story 2 - Accurate Calculations Across All Unit Pairs (Priority: P1)

A user converting between any pair of supported units receives mathematically accurate results consistent with the established conversion ratios.

**Why this priority**: Calculation accuracy is a fundamental trust signal. Incorrect conversions would render the calculator useless and damage user confidence.

**Independent Test**: Can be fully tested by performing round-trip conversions (e.g., pyeong → sqm → pyeong) and verifying the original value is preserved within acceptable floating-point tolerance.

**Acceptance Scenarios**:

1. **Given** any supported unit pair (sqm, pyeong, sqft, acre), **When** converting a value from unit A to unit B, **Then** the result matches the expected mathematical ratio.
2. **Given** a value in pyeong, **When** converting to sqm and back to pyeong, **Then** the final value equals the original within 0.0001% tolerance.
3. **Given** the existing test suite, **When** all tests are run after the refactor, **Then** 100% of existing conversion tests pass without modification.

---

### User Story 3 - Developer Adds New Unit Support (Priority: P2)

A developer needs to add support for a new area unit (e.g., hectare, tsubo) to the converter without modifying existing conversion logic or increasing the initial bundle size for users who don't need the new unit.

**Why this priority**: Extensibility ensures long-term maintainability. The architecture should support growth without regression.

**Independent Test**: Can be tested by adding a mock new unit type and verifying it integrates without affecting existing conversions or bundle size.

**Acceptance Scenarios**:

1. **Given** the ConversionRegistry architecture, **When** a developer registers a new unit with its sqm conversion ratio, **Then** the new unit becomes available for all conversions without code changes to existing units.
2. **Given** a new unit is added, **When** the application is built, **Then** unused unit conversions are tree-shaken from the bundle if not imported.
3. **Given** the existing unit set, **When** a new unit is added, **Then** no existing unit's conversion logic or performance is affected.

---

### Edge Cases

- What happens when a user enters zero? The system displays zero in all fields without errors.
- What happens when a user enters a negative number? The system treats negative values as invalid per existing validation logic.
- How does the system handle extremely large numbers that exceed safe integer range? The system uses standard JavaScript number handling and displays the result with appropriate precision.
- What happens when converting between the same unit (sqm → sqm)? The system returns the input value unchanged without unnecessary computation.
- What happens when input is NaN, undefined, or a non-numeric string? The system returns `NaN`, following JavaScript math operation conventions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a ConversionRegistry that stores unit conversion strategies with O(1) lookup time complexity.
- **FR-002**: System MUST use square meters (sqm) as the canonical base unit for all conversions, ensuring any unit can convert to any other unit via sqm.
- **FR-003**: System MUST maintain all existing conversion functions as pure functions with no side effects, enabling tree-shaking by bundlers.
- **FR-004**: System MUST support the current unit set: sqm (square meters), pyeong (평), sqft (square feet), and acre.
- **FR-005**: System MUST allow registration of new units by providing only the to-sqm and from-sqm conversion ratios.
- **FR-006**: System MUST execute any single unit conversion in constant time O(1), regardless of the number of registered units.
- **FR-007**: System MUST maintain backward compatibility with existing function signatures (convertSqmToPyeong, convertPyeongToSqm, etc.).
- **FR-008**: System MUST pass all existing unit tests without modification to test assertions.

### Non-Functional Requirements

- **NFR-001**: All conversion operations MUST complete within 1ms to support 60fps UI updates.
- **NFR-002**: The refactored module MUST NOT increase the production bundle size by more than 500 bytes gzipped.
- **NFR-003**: The architecture MUST support tree-shaking so unused conversion strategies are eliminated from the final bundle.
- **NFR-004**: Code MUST pass project linting (ESLint) and formatting (Prettier) checks per constitution requirements.

### Key Entities

- **ConversionRegistry**: A module-scoped `Map` that maps unit identifiers to their conversion strategies. Provides O(1) lookup for any unit's conversion logic. Accessed via exported functions rather than direct Map access.
- **ConversionStrategy**: Represents a unit's conversion logic, containing the ratio to convert to/from the base unit (sqm). Each strategy is a pure function or function pair.
- **UnitType**: An identifier representing a supported unit (sqm, pyeong, sqft, acre). Used as keys in the ConversionRegistry.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All unit conversions complete within 1ms as measured by performance tests, ensuring no impact on Interaction to Next Paint (INP).
- **SC-002**: 100% of existing conversion tests pass without modification after the refactor.
- **SC-003**: The refactored module bundle size increase is less than 500 bytes gzipped compared to the current implementation.
- **SC-004**: A new unit can be added by a developer in under 5 minutes by registering a single conversion ratio.
- **SC-005**: The codebase maintains zero linting errors and zero formatting issues after the refactor.

## Clarifications

### Session 2025-12-11

- Q: NaN, undefined, 빈 문자열 등 invalid input 처리 방식? → A: `return NaN` (JavaScript 수학 연산 컨벤션 따름)
- Q: ConversionRegistry 구조 패턴? → A: Module-scoped `Record<UnitType, ConversionStrategy>` object (ES 모듈 스코프에 객체 리터럴, 함수로 접근). Object literal chosen over `Map` for simpler syntax while maintaining O(1) lookup.
- Q: Registry export 전략? → A: Wrapper functions only (registry 내부 숨김, 함수만 export)

## Assumptions

- The existing conversion ratios in `src/constants/conversion.ts` are accurate and should be preserved.
- The current function signatures (e.g., `convertSqmToPyeong(sqm: number): number`) must remain available for backward compatibility, even if internally they delegate to the registry.
- "O(1) lookup" refers to hash map/object property access, which is amortized constant time in JavaScript.
- Tree-shaking will be handled by the build toolchain (likely Vite/Rollup); the code must be structured to enable it but does not implement tree-shaking itself.
- Performance testing will use standard browser performance APIs or Vitest benchmarks.
