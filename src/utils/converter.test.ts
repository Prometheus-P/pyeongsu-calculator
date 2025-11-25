import { describe, it, expect } from 'vitest';
import { convertSqmToPyeong, convertPyeongToSqm, formatNumber } from './converter';

describe('convertSqmToPyeong', () => {
  it('33.06㎡를 10평으로 변환한다 (오차 0.01 이내)', () => {
    const result = convertSqmToPyeong(33.06);
    expect(result).toBeCloseTo(10, 2);
  });
});

describe('convertPyeongToSqm', () => {
  it('10평을 33.06㎡로 변환한다 (오차 0.01 이내)', () => {
    const result = convertPyeongToSqm(10);
    expect(result).toBeCloseTo(33.06, 2);
  });
});

describe('formatNumber', () => {
  it('소수점 둘째자리까지 반올림한다 (기본값)', () => {
    expect(formatNumber(10.126)).toBe('10.13');
    expect(formatNumber(10.124)).toBe('10.12');
  });

  it('지정된 소수점 자릿수로 포맷한다', () => {
    expect(formatNumber(10.1234, 3)).toBe('10.123');
    expect(formatNumber(10, 1)).toBe('10.0');
  });
});
