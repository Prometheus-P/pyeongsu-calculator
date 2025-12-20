/**
 * src/utils/converter.ts
 * [Zero to One Update]
 * 단순 변환 계수를 넘어, 시장의 '사회적 합의'와 '라이프스타일' 데이터를 독점적으로 정의함.
 */

export const SQM_TO_PYEONG = 0.3025;
export const PYEONG_TO_SQM = 3.305785;

// Pure Functions
export function convertSqmToPyeong(sqm: number): number {
  return sqm * SQM_TO_PYEONG;
}

export function convertPyeongToSqm(pyeong: number): number {
  return pyeong * PYEONG_TO_SQM;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function isValidInput(value: string): boolean {
  if (value === '' || value === '.') return false;
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}

// 💎 Proprietary Content: 경쟁자가 복제할 수 없는 'Insight'
// 단순 수치가 아닌, 해당 평형대가 한국 부동산 시장에서 갖는 '사회적 지위'와 '실용성'을 정의
export const PROPRIETARY_INSIGHTS = {
  59: {
    label: "25평형 (59㎡)",
    verdict: "📉 신혼부부의 현실적 타협점",
    pros: "둘이 살긴 쾌적, 청소하기 매우 편함",
    cons: "아이가 생기고 짐이 늘면 거실이 창고로 변함",
    benchmark: "서울 신축 평균 전세가: 약 5~6억 선"
  },
  74: {
    label: "30평형 (74㎡)",
    verdict: "⚖️ 틈새 시장의 강자",
    pros: "25평은 좁고 34평은 비싼 사람들의 구원투수",
    cons: "물량이 적어 매물 찾기가 하늘의 별따기",
    benchmark: "가성비가 가장 뛰어난 구간"
  },
  84: {
    label: "34평형 (84㎡)",
    verdict: "👑 대한민국 4인 가족 표준 (국평)",
    pros: "환금성 1위. 팔고 싶을 때 바로 팔림",
    cons: "관리비가 20평대 대비 체감상 1.5배 뜀",
    benchmark: "모든 아파트 가격 비교의 기준점"
  },
  110: {
    label: "40평형대 (110㎡+)",
    verdict: "🏆 여유와 프라이버시",
    pros: "각자의 방에서 안 나옴. 화장실 전쟁 끝.",
    cons: "청소 이모님 필수. 난방비 폭탄 주의.",
    benchmark: "부의 상징으로 진입하는 단계"
  }
} as const;

export type InsightKey = keyof typeof PROPRIETARY_INSIGHTS;