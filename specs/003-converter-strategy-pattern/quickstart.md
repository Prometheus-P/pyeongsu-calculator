# Quickstart: Converter Strategy Pattern Refactor

**Feature**: 003-converter-strategy-pattern
**Date**: 2025-12-10

## TL;DR

Refactor `src/utils/converter.ts` to use a Strategy Pattern with ConversionRegistry for O(1) lookups while preserving all existing function signatures.

## Key Files

| File | Action | Purpose |
|------|--------|---------|
| `src/utils/converter.ts` | MODIFY | Add registry + generic convert() |
| `src/constants/conversion.ts` | NO CHANGE | Keep existing constants |
| `src/utils/converter.test.ts` | NO CHANGE | All tests must pass |

## Implementation Pattern

```typescript
// 1. Define types (compile-time only, 0 bytes)
type UnitType = 'sqm' | 'pyeong' | 'sqft' | 'acre';

interface ConversionStrategy {
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

// 2. Create registry (module-level constant)
const registry: Record<UnitType, ConversionStrategy> = {
  sqm: { toBase: (v) => v, fromBase: (v) => v },
  pyeong: {
    toBase: (v) => v * PYEONG_TO_SQM_RATIO,
    fromBase: (v) => v * SQM_TO_PYEONG_RATIO
  },
  sqft: {
    toBase: (v) => v * SQFT_TO_SQM_RATIO,
    fromBase: (v) => v * SQM_TO_SQFT_RATIO
  },
  acre: {
    toBase: (v) => v * ACRE_TO_SQM_RATIO,
    fromBase: (v) => v * SQM_TO_ACRE_RATIO
  },
};

// 3. Generic convert function (NEW)
export function convert(value: number, from: UnitType, to: UnitType): number {
  if (from === to) return value;
  const baseValue = registry[from].toBase(value);
  return registry[to].fromBase(baseValue);
}

// 4. Preserve existing functions as thin wrappers
export function convertSqmToPyeong(sqm: number): number {
  return registry.pyeong.fromBase(sqm);
}
// ... (same pattern for all 10 functions)

// 5. Runtime extensibility (NEW)
export function registerUnit(
  unitType: string,
  toBase: (value: number) => number,
  fromBase: (value: number) => number
): void {
  (registry as Record<string, ConversionStrategy>)[unitType] = { toBase, fromBase };
}
```

## Conversion Flow

```
Unit A ──toBase()──> sqm (base) ──fromBase()──> Unit B
```

All conversions go through sqm as the canonical base unit.

## Validation Checklist

- [ ] All 10 existing functions preserved with same signatures
- [ ] `npm run test:run` passes with 100% coverage
- [ ] `npm run build` succeeds
- [ ] Bundle size increase < 500 bytes gzipped
- [ ] Generic `convert()` function works for all unit pairs
- [ ] `registerUnit()` allows adding new units at runtime

## Quick Tests

```bash
# Run existing tests (must all pass)
npm run test:run

# Build and check bundle size
npm run build

# Optional: Run benchmarks
npx vitest bench src/utils/converter.bench.ts
```

## Common Patterns

### Existing API (preserved)
```typescript
const pyeong = convertSqmToPyeong(100);  // 30.25
const sqm = convertPyeongToSqm(30);      // 99.17
```

### New Generic API
```typescript
const sqft = convert(100, 'sqm', 'sqft');     // 1076.39
const pyeong = convert(100, 'sqft', 'pyeong'); // 2.81
```

### Adding New Units
```typescript
registerUnit('hectare',
  (v) => v * 10000,      // hectare → sqm
  (v) => v / 10000       // sqm → hectare
);
const ha = convert(10000, 'sqm', 'hectare');  // 1
```

## Do NOT

- Change function signatures of existing exports
- Add external dependencies
- Move constants to a different file
- Break tree-shaking (keep named exports)
- Add runtime type checking overhead
