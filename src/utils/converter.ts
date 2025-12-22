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
    verdict: "✅ 내 집 마련의 첫 단추, 신혼부부 국민 평형",
    pros: "컴팩트한 공간, 효율적인 동선, 저렴한 관리비",
    cons: "자녀의 성장에 따라 공간 확장이 필요할 수 있어요.",
    benchmark: "서울 신축 기준, 전세 5-6억, 매매 8-10억 선"
  },
  74: {
    label: "30평형 (74㎡)",
    verdict: "⚖️ 가성비와 실용성을 모두 잡는 현명한 선택",
    pros: "25평의 아쉬움을 달래고, 34평의 가격 부담을 덜어주는 최적의 포지션",
    cons: "국평(84㎡)에 비해 상대적으로 매물 수가 적어 희소성이 높음",
    benchmark: "신축 단지에서 가장 먼저 소진되는 로얄 평형"
  },
  84: {
    label: "34평형 (84㎡)",
    verdict: "🏆 압도적 1위, 시장을 지배하는 국민 평형",
    pros: "높은 환금성, 넓은 수요층, 검증된 공간 설계",
    cons: "삶의 질과 함께 관리비도 소폭 상승해요.",
    benchmark: "모든 부동산 시세 분석의 바로미터"
  },
  110: {
    label: "40평형대 (110㎡+)",
    verdict: "✨ 공간을 넘어, 라이프스타일을 디자인하는 평형",
    pros: "세대 분리, 재택 근무, 취미 공간 등 다양한 삶의 방식 구현 가능",
    cons: "유지보수 비용과 난방비에 대한 계획적인 접근이 필요",
    benchmark: "성공의 상징, 삶의 여유를 담는 프리미엄 공간"
  }
} as const;

export type InsightKey = keyof typeof PROPRIETARY_INSIGHTS;