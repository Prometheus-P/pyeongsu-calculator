import { describe, it, expect } from 'vitest';
import { convertSqmToPyeong, convertPyeongToSqm } from './converter';

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
