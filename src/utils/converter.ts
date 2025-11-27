import {
  SQM_TO_PYEONG_RATIO,
  PYEONG_TO_SQM_RATIO,
  SQM_TO_SQFT_RATIO,
  SQFT_TO_SQM_RATIO,
  SQM_TO_ACRE_RATIO,
  ACRE_TO_SQM_RATIO,
} from '../constants/conversion';

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
 * 제곱미터를 제곱피트로 변환
 */
export function convertSqmToSqft(sqm: number): number {
  return sqm * SQM_TO_SQFT_RATIO;
}

/**
 * 제곱피트를 제곱미터로 변환
 */
export function convertSqftToSqm(sqft: number): number {
  return sqft * SQFT_TO_SQM_RATIO;
}

/**
 * 제곱미터를 에이커로 변환
 */
export function convertSqmToAcre(sqm: number): number {
  return sqm * SQM_TO_ACRE_RATIO;
}

/**
 * 에이커를 제곱미터로 변환
 */
export function convertAcreToSqm(acre: number): number {
  return acre * ACRE_TO_SQM_RATIO;
}

/**
 * 평을 제곱피트로 변환
 */
export function convertPyeongToSqft(pyeong: number): number {
  return convertSqmToSqft(convertPyeongToSqm(pyeong));
}

/**
 * 제곱피트를 평으로 변환
 */
export function convertSqftToPyeong(sqft: number): number {
  return convertSqmToPyeong(convertSqftToSqm(sqft));
}

/**
 * 평을 에이커로 변환
 */
export function convertPyeongToAcre(pyeong: number): number {
  return convertSqmToAcre(convertPyeongToSqm(pyeong));
}

/**
 * 에이커를 평으로 변환
 */
export function convertAcreToPyeong(acre: number): number {
  return convertSqmToPyeong(convertAcreToSqm(acre));
}

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
