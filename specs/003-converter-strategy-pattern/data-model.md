# Data Model: Converter Strategy Pattern Refactor

**Date**: 2025-12-10
**Feature**: 003-converter-strategy-pattern

## Overview

This feature introduces a Strategy Pattern for unit conversions. The data model consists of TypeScript types and interfaces that define the conversion registry structure. All entities are stateless and defined at module load time.

## Entity Definitions

### 1. UnitType

**Type**: String literal union
**Purpose**: Identifier for supported area units

```typescript
type UnitType = 'sqm' | 'pyeong' | 'sqft' | 'acre';
```

| Value | Description | Base Unit |
|-------|-------------|-----------|
| `'sqm'` | Square meters (제곱미터) | Yes (canonical) |
| `'pyeong'` | Korean pyeong (평) | No |
| `'sqft'` | Square feet (제곱피트) | No |
| `'acre'` | Acre (에이커) | No |

**Extensibility**: New units can be added by extending the union type or using `registerUnit()`.

---

### 2. ConversionStrategy

**Type**: Interface
**Purpose**: Defines bidirectional conversion logic for a single unit

```typescript
interface ConversionStrategy {
  /**
   * Convert from this unit to base unit (sqm)
   * @param value - Value in this unit
   * @returns Value in square meters
   */
  toBase: (value: number) => number;

  /**
   * Convert from base unit (sqm) to this unit
   * @param value - Value in square meters
   * @returns Value in this unit
   */
  fromBase: (value: number) => number;
}
```

**Properties**:

| Property | Type | Description |
|----------|------|-------------|
| `toBase` | `(value: number) => number` | Pure function converting to sqm |
| `fromBase` | `(value: number) => number` | Pure function converting from sqm |

**Invariants**:
- Both functions MUST be pure (no side effects)
- `fromBase(toBase(x))` MUST equal `x` within floating-point tolerance
- Functions MUST handle `0` correctly (return `0`)

---

### 3. ConversionRegistry

**Type**: Record object
**Purpose**: Maps unit identifiers to their conversion strategies

```typescript
type ConversionRegistry = Record<UnitType, ConversionStrategy>;
```

**Structure**:

```typescript
const registry: ConversionRegistry = {
  sqm: {
    toBase: (v) => v,                              // Identity
    fromBase: (v) => v,                            // Identity
  },
  pyeong: {
    toBase: (v) => v * PYEONG_TO_SQM_RATIO,       // 3.3058
    fromBase: (v) => v * SQM_TO_PYEONG_RATIO,     // 0.3025
  },
  sqft: {
    toBase: (v) => v * SQFT_TO_SQM_RATIO,         // 0.0929
    fromBase: (v) => v * SQM_TO_SQFT_RATIO,       // 10.7639
  },
  acre: {
    toBase: (v) => v * ACRE_TO_SQM_RATIO,         // 4046.86
    fromBase: (v) => v * SQM_TO_ACRE_RATIO,       // 0.000247105
  },
};
```

**Lookup Complexity**: O(1) - JavaScript object property access

---

## Relationships

```
┌─────────────────────────────────────────────────────┐
│                ConversionRegistry                    │
│         Record<UnitType, ConversionStrategy>         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │   sqm   │  │ pyeong  │  │  sqft   │  │  acre   │ │
│  ├─────────┤  ├─────────┤  ├─────────┤  ├─────────┤ │
│  │ toBase  │  │ toBase  │  │ toBase  │  │ toBase  │ │
│  │fromBase │  │fromBase │  │fromBase │  │fromBase │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │
│       │             │            │            │      │
│       └─────────────┼────────────┼────────────┘      │
│                     │            │                   │
│                     ▼            ▼                   │
│              ┌─────────────────────┐                 │
│              │    Base Unit (sqm)   │                 │
│              │   All conversions    │                 │
│              │   go through sqm     │                 │
│              └─────────────────────┘                 │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Conversion Flow**:
```
Unit A ──toBase()──> sqm ──fromBase()──> Unit B
```

---

## Validation Rules

### Type Validation (Compile-Time)

| Rule | Enforcement |
|------|-------------|
| Valid UnitType | TypeScript union type |
| Strategy shape | ConversionStrategy interface |
| Registry completeness | Record type requires all UnitType keys |

### Runtime Validation

| Rule | Validation |
|------|------------|
| Non-negative input | Existing `isValidInput()` function |
| Numeric input | Existing `isValidInput()` function |
| Unit existence | Registry lookup (throws if undefined) |

---

## Conversion Constants (Existing)

From `src/constants/conversion.ts`:

| Constant | Value | Description |
|----------|-------|-------------|
| `PYEONG_TO_SQM_RATIO` | 3.3058 | 1 pyeong = 3.3058 sqm |
| `SQM_TO_PYEONG_RATIO` | 0.3025 | 1 sqm = 0.3025 pyeong |
| `SQM_TO_SQFT_RATIO` | 10.7639 | 1 sqm = 10.7639 sqft |
| `SQFT_TO_SQM_RATIO` | 0.0929 | 1 sqft = 0.0929 sqm |
| `ACRE_TO_SQM_RATIO` | 4046.86 | 1 acre = 4046.86 sqm |
| `SQM_TO_ACRE_RATIO` | 0.000247105 | 1 sqm = 0.000247105 acre |

**Note**: These constants are preserved and reused by the new registry.

---

## API Surface

### Existing Functions (Preserved)

| Function | Signature | Internal Implementation |
|----------|-----------|------------------------|
| `convertSqmToPyeong` | `(sqm: number) => number` | `registry.pyeong.fromBase(sqm)` |
| `convertPyeongToSqm` | `(pyeong: number) => number` | `registry.pyeong.toBase(pyeong)` |
| `convertSqmToSqft` | `(sqm: number) => number` | `registry.sqft.fromBase(sqm)` |
| `convertSqftToSqm` | `(sqft: number) => number` | `registry.sqft.toBase(sqft)` |
| `convertSqmToAcre` | `(sqm: number) => number` | `registry.acre.fromBase(sqm)` |
| `convertAcreToSqm` | `(acre: number) => number` | `registry.acre.toBase(acre)` |
| `convertPyeongToSqft` | `(pyeong: number) => number` | `convert(pyeong, 'pyeong', 'sqft')` |
| `convertSqftToPyeong` | `(sqft: number) => number` | `convert(sqft, 'sqft', 'pyeong')` |
| `convertPyeongToAcre` | `(pyeong: number) => number` | `convert(pyeong, 'pyeong', 'acre')` |
| `convertAcreToPyeong` | `(acre: number) => number` | `convert(acre, 'acre', 'pyeong')` |

### New Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `convert` | `(value: number, from: UnitType, to: UnitType) => number` | Generic conversion between any units |
| `registerUnit` | `(unitType: string, toBase: Function, fromBase: Function) => void` | Add new unit at runtime |

---

## Usage Examples

```typescript
// Existing API (preserved)
const pyeong = convertSqmToPyeong(100);  // 30.25

// New generic API
const sqft = convert(100, 'sqm', 'sqft');  // 1076.39

// Same-unit conversion (no-op)
const same = convert(100, 'sqm', 'sqm');   // 100

// Adding a new unit
registerUnit('hectare',
  (v) => v * 10000,      // hectare to sqm
  (v) => v / 10000       // sqm to hectare
);
const hectares = convert(10000, 'sqm', 'hectare');  // 1
```
