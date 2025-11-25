import { SQM_TO_PYEONG_RATIO } from '../constants/conversion';

/**
 * 제곱미터를 평으로 변환
 */
export function convertSqmToPyeong(sqm: number): number {
  return sqm * SQM_TO_PYEONG_RATIO;
}
