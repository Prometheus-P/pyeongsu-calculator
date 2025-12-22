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

/**
 * 평형별 인사이트 데이터
 * 한국 아파트 시장에서 각 평형이 갖는 특성과 시세 정보
 */
export const PROPRIETARY_INSIGHTS = {
  59: {
    label: "25평형 · 59㎡",
    verdict: "신혼부부와 1~2인 가구에게 인기 있는 실속형 평형이에요.",
    pros: "동선이 짧아 청소와 관리가 편하고, 관리비 부담이 적어요. 역세권 소형 아파트로 출퇴근이 편리한 경우가 많아요.",
    cons: "수납공간이 부족할 수 있고, 가족이 늘어나면 이사를 고려해야 할 수 있어요.",
    benchmark: "서울 신축 기준 전세 5~6억, 매매 8~10억 수준"
  },
  74: {
    label: "30평형 · 74㎡",
    verdict: "25평은 좁고, 34평은 부담스러울 때 선택하는 균형잡힌 평형이에요.",
    pros: "방 3개 구성이 가능해 자녀 1명 가구에 적합해요. 국평보다 합리적인 가격대를 유지해요.",
    cons: "84㎡에 비해 매물이 적어 원하는 조건을 찾기 어려울 수 있어요.",
    benchmark: "분양 시 빠르게 마감되는 인기 평형"
  },
  84: {
    label: "34평형 · 84㎡",
    verdict: "가장 많이 거래되는 '국민 평형'으로, 시세 파악의 기준이 돼요.",
    pros: "매물이 많아 비교가 쉽고, 되팔 때도 수요가 풍부해요. 방 3개 + 거실 구성으로 활용도가 높아요.",
    cons: "같은 단지 내에서도 경쟁이 치열하고, 관리비가 소형 대비 높아요.",
    benchmark: "부동산 시세 분석의 기준점"
  },
  110: {
    label: "40평형대 · 110㎡ 이상",
    verdict: "넓은 공간이 필요한 3~4인 가구나 재택근무자에게 적합해요.",
    pros: "독립된 서재나 드레스룸 구성이 가능하고, 손님 초대에도 여유로워요.",
    cons: "난방비와 관리비 부담이 크고, 청소에 시간이 더 걸려요.",
    benchmark: "프리미엄 단지 위주로 공급"
  }
} as const;

export type InsightKey = keyof typeof PROPRIETARY_INSIGHTS;