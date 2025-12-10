# Research: Converter Strategy Pattern Refactor

**Date**: 2025-12-10
**Feature**: 003-converter-strategy-pattern

## Research Topics

### 1. Strategy Pattern Implementation for O(1) Lookups

**Decision**: Use a plain JavaScript object (Record) as the ConversionRegistry for O(1) property access.

**Rationale**:
- JavaScript object property access is O(1) amortized (hash map internally)
- No external dependencies required
- TypeScript provides full type safety with `Record<UnitType, ConversionStrategy>`
- Smaller bundle size than Map or class-based implementations

**Alternatives Considered**:
- **Map**: Rejected - slightly larger overhead, no benefit for string keys
- **Class with methods**: Rejected - larger bundle size, unnecessary for stateless operations
- **Switch statement**: Rejected - O(n) worst case, harder to extend

**Implementation Pattern**:
```typescript
type UnitType = 'sqm' | 'pyeong' | 'sqft' | 'acre';

interface ConversionStrategy {
  toBase: (value: number) => number;   // Convert to sqm
  fromBase: (value: number) => number; // Convert from sqm
}

const registry: Record<UnitType, ConversionStrategy> = {
  sqm: { toBase: (v) => v, fromBase: (v) => v },
  pyeong: { toBase: (v) => v * PYEONG_TO_SQM_RATIO, fromBase: (v) => v * SQM_TO_PYEONG_RATIO },
  // ...
};
```

---

### 2. Tree-Shaking Strategy for Pure Functions

**Decision**: Export individual named functions that internally use the registry. Keep registry as module-level constant.

**Rationale**:
- Named exports are tree-shakeable by Vite/Rollup
- Module-level constants are eliminated if unused
- Existing function signatures preserved for backward compatibility
- No runtime registration (all defined at module load)

**Alternatives Considered**:
- **Class export**: Rejected - classes are not well tree-shaken
- **Factory functions**: Rejected - runtime overhead, harder to tree-shake
- **Dynamic imports**: Rejected - unnecessary complexity for 4 units

**Implementation Pattern**:
```typescript
// Internal registry (tree-shaken if convert() not used)
const registry = { ... };

// Backward-compatible exports (individually tree-shakeable)
export function convertSqmToPyeong(sqm: number): number {
  return registry.pyeong.fromBase(sqm);
}

// Generic convert function (for new code)
export function convert(value: number, from: UnitType, to: UnitType): number {
  const baseValue = registry[from].toBase(value);
  return registry[to].fromBase(baseValue);
}
```

---

### 3. Bundle Size Optimization

**Decision**: Keep registry definition inline with conversion functions. No separate file for registry.

**Rationale**:
- Avoids additional import overhead
- Bundler can inline constants during minification
- Existing constants in `conversion.ts` remain unchanged
- Estimated increase: ~300-400 bytes gzipped (under 500 byte limit)

**Bundle Size Analysis**:
| Component | Estimated Size (gzipped) |
|-----------|-------------------------|
| UnitType type | 0 bytes (compile-time only) |
| ConversionStrategy interface | 0 bytes (compile-time only) |
| Registry object | ~150 bytes |
| Generic convert() function | ~80 bytes |
| Wrapper functions | ~50 bytes (minimal, delegate to registry) |
| **Total Increase** | **~280 bytes** |

**Alternatives Considered**:
- **Separate registry module**: Rejected - adds import overhead
- **Code generation**: Rejected - over-engineering for 4 units

---

### 4. Backward Compatibility Strategy

**Decision**: Preserve all 10 existing function signatures as thin wrappers around registry calls.

**Rationale**:
- Zero breaking changes for existing consumers
- Tests pass without modification (FR-008)
- Gradual migration possible - new code can use generic `convert()`
- No version bump required (non-breaking refactor)

**Existing Functions to Preserve**:
1. `convertSqmToPyeong(sqm: number): number`
2. `convertPyeongToSqm(pyeong: number): number`
3. `convertSqmToSqft(sqm: number): number`
4. `convertSqftToSqm(sqft: number): number`
5. `convertSqmToAcre(sqm: number): number`
6. `convertAcreToSqm(acre: number): number`
7. `convertPyeongToSqft(pyeong: number): number`
8. `convertSqftToPyeong(sqft: number): number`
9. `convertPyeongToAcre(pyeong: number): number`
10. `convertAcreToPyeong(acre: number): number`

**Plus utilities (unchanged)**:
- `formatNumber(value: number, decimals?: number): string`
- `isValidInput(value: string): boolean`

---

### 5. Unit Registration for Extensibility

**Decision**: Provide a `registerUnit()` function that modifies the registry at runtime.

**Rationale**:
- Allows adding new units without modifying core code
- Supports future units (hectare, tsubo) per spec
- Pure function approach maintained (registration is side-effect, but controlled)
- Can be tree-shaken if not used

**Implementation Pattern**:
```typescript
export function registerUnit(
  unitType: string,
  toBase: (value: number) => number,
  fromBase: (value: number) => number
): void {
  registry[unitType as UnitType] = { toBase, fromBase };
}

// Usage:
registerUnit('hectare', (v) => v * 10000, (v) => v / 10000);
```

**Alternatives Considered**:
- **Compile-time only**: Rejected - limits extensibility
- **Plugin system**: Rejected - over-engineering for simple use case

---

### 6. Performance Validation Approach

**Decision**: Use Vitest benchmark mode for performance testing.

**Rationale**:
- Already using Vitest for unit tests
- Built-in `bench()` function for microbenchmarks
- No additional dependencies
- Can verify <1ms requirement

**Benchmark Pattern**:
```typescript
import { bench, describe } from 'vitest';

describe('conversion performance', () => {
  bench('convert sqm to pyeong', () => {
    convertSqmToPyeong(100);
  });

  bench('generic convert', () => {
    convert(100, 'sqm', 'pyeong');
  });
});
```

---

## Summary

All research topics resolved. No NEEDS CLARIFICATION items remain.

| Topic | Decision | Risk Level |
|-------|----------|------------|
| Registry Structure | Plain object (Record) | Low |
| Tree-Shaking | Named exports + module constants | Low |
| Bundle Size | Inline registry, ~280 bytes | Low |
| Backward Compat | Thin wrapper functions | Low |
| Extensibility | registerUnit() function | Low |
| Performance Test | Vitest benchmark mode | Low |

**All decisions align with Constitution principles and spec requirements.**
