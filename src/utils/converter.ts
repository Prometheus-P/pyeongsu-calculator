import { SQM_TO_PYEONG_RATIO, PYEONG_TO_SQM_RATIO } from '../constants/conversion';

/**
 * 제곱미터를 평으로 변환
 */
export function convertSqmToPyeong(sqm: number): number {
  return sqm * SQM_TO_PYEONG_RATIO;
}

/**
 * 평을 제곱미터로 변환
 */
export function convertPyeongToSqm(pyeong: number): number {
  return pyeong * PYEONG_TO_SQM_RATIO;
}

/**
 * 숫자를 지정된 소수점 자릿수로 포맷
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}
