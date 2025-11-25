import { describe, it, expect } from 'vitest';
import { convertSqmToPyeong } from './converter';

describe('convertSqmToPyeong', () => {
  it('33.06㎡를 10평으로 변환한다 (오차 0.01 이내)', () => {
    const result = convertSqmToPyeong(33.06);
    expect(result).toBeCloseTo(10, 2);
  });
});
