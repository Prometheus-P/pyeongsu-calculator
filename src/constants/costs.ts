/**
 * src/constants/costs.ts
 * [S-Tier Data]
 * 사용자의 '돈 걱정'을 자극하는 현실적인 비용 데이터
 */

export const INTERIOR_COSTS = {
  BASIC: {
    label: "가성비 리모델링",
    pricePerPyeong: 1500000, // 평당 150만 원
    description: "도배, 장판, 필름, 기본 욕실/주방",
  },
  PREMIUM: {
    label: "호텔식 올수리",
    pricePerPyeong: 2500000, // 평당 250만 원
    description: "구조 변경, 시스템 에어컨, 히든 도어, 고급 타일",
  }
};

export const LOAN_RATES = {
  MORTGAGE: {
    label: "주택담보대출",
    rate: 4.2, // % (실시간 API 연동 전엔 하드코딩 후 주기적 업데이트)
    ltv: 0.7, // LTV 70% 가정
  }
};
