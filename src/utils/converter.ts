import {
  SQM_TO_PYEONG_RATIO,
  PYEONG_TO_SQM_RATIO,
  SQM_TO_SQFT_RATIO,
  SQFT_TO_SQM_RATIO,
  SQM_TO_ACRE_RATIO,
  ACRE_TO_SQM_RATIO,
} from '../constants/conversion';

// ============================================
// Phase 2: Foundational Type Definitions
// ============================================

/**
 * Supported area unit types
 * sqm is the canonical base unit for all conversions
 */
export type UnitType = 'sqm' | 'pyeong' | 'sqft' | 'acre';

/**
 * Strategy interface for bidirectional unit conversion
 * All conversions go through sqm as the base unit
 */
export interface ConversionStrategy {
  /** Convert from this unit to sqm (base unit) */
  toBase: (value: number) => number;
  /** Convert from sqm (base unit) to this unit */
  fromBase: (value: number) => number;
}

/**
 * Internal conversion registry - O(1) lookup for all unit strategies
 * Mutable to support runtime unit registration (registerUnit)
 */
const registry: Record<string, ConversionStrategy> = {
  // T006: sqm strategy (identity functions - base unit)
  sqm: {
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  // T007: pyeong strategy
  pyeong: {
    toBase: (v) => v * PYEONG_TO_SQM_RATIO,
    fromBase: (v) => v * SQM_TO_PYEONG_RATIO,
  },
  // T008: sqft strategy
  sqft: {
    toBase: (v) => v * SQFT_TO_SQM_RATIO,
    fromBase: (v) => v * SQM_TO_SQFT_RATIO,
  },
  // T009: acre strategy
  acre: {
    toBase: (v) => v * ACRE_TO_SQM_RATIO,
    fromBase: (v) => v * SQM_TO_ACRE_RATIO,
  },
};

// ============================================
// Phase 3: Core Conversion Functions (User Stories 1 & 2)
// ============================================

/**
 * T020: Generic convert function - O(1) lookup for any unit pair
 * Converts value from source unit to target unit via sqm base
 */
export function convert(value: number, from: UnitType, to: UnitType): number {
  if (from === to) return value;
  const baseValue = registry[from].toBase(value);
  return registry[to].fromBase(baseValue);
}

/**
 * 제곱미터를 평으로 변환
 * T010: Refactored to use registry.pyeong.fromBase()
 */
export function convertSqmToPyeong(sqm: number): number {
  return registry.pyeong.fromBase(sqm);
}

/**
 * 평을 제곱미터로 변환
 * T011: Refactored to use registry.pyeong.toBase()
 */
export function convertPyeongToSqm(pyeong: number): number {
  return registry.pyeong.toBase(pyeong);
}

/**
 * 제곱미터를 제곱피트로 변환
 * T012: Refactored to use registry.sqft.fromBase()
 */
export function convertSqmToSqft(sqm: number): number {
  return registry.sqft.fromBase(sqm);
}

/**
 * 제곱피트를 제곱미터로 변환
 * T013: Refactored to use registry.sqft.toBase()
 */
export function convertSqftToSqm(sqft: number): number {
  return registry.sqft.toBase(sqft);
}

/**
 * 제곱미터를 에이커로 변환
 * T014: Refactored to use registry.acre.fromBase()
 */
export function convertSqmToAcre(sqm: number): number {
  return registry.acre.fromBase(sqm);
}

/**
 * 에이커를 제곱미터로 변환
 * T015: Refactored to use registry.acre.toBase()
 */
export function convertAcreToSqm(acre: number): number {
  return registry.acre.toBase(acre);
}

/**
 * 평을 제곱피트로 변환
 * T016: Refactored to use generic conversion via registry
 */
export function convertPyeongToSqft(pyeong: number): number {
  return convert(pyeong, 'pyeong', 'sqft');
}

/**
 * 제곱피트를 평으로 변환
 * T017: Refactored to use generic conversion via registry
 */
export function convertSqftToPyeong(sqft: number): number {
  return convert(sqft, 'sqft', 'pyeong');
}

/**
 * 평을 에이커로 변환
 * T018: Refactored to use generic conversion via registry
 */
export function convertPyeongToAcre(pyeong: number): number {
  return convert(pyeong, 'pyeong', 'acre');
}

/**
 * 에이커를 평으로 변환
 * T019: Refactored to use generic conversion via registry
 */
export function convertAcreToPyeong(acre: number): number {
  return convert(acre, 'acre', 'pyeong');
}

// ============================================
// Phase 4: Extensibility (User Story 3)
// ============================================

/**
 * T022: Register a new unit type at runtime
 * Allows adding custom units without modifying core code
 */
export function registerUnit(
  unitType: string,
  toBase: (value: number) => number,
  fromBase: (value: number) => number
): void {
  registry[unitType] = { toBase, fromBase };
}

// ============================================
// Utility Functions (unchanged)
// ============================================

/**
 * 숫자를 지정된 소수점 자릿수로 포맷
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * 입력값 유효성 검사
 */
export function isValidInput(value: string): boolean {
  if (value === '' || value === '.') {
    return false;
  }
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}
