// 평수 변환 상수
// 1평 = 3.3058㎡ (정확한 값: 400/121 ≈ 3.305785...)
export const PYEONG_TO_SQM_RATIO = 3.3058;

// 1㎡ = 0.3025평 (정확한 값: 121/400 = 0.3025)
export const SQM_TO_PYEONG_RATIO = 0.3025;

// 제곱피트 변환 상수
// 1㎡ = 10.7639 sqft
export const SQM_TO_SQFT_RATIO = 10.7639;

// 1 sqft = 0.0929 ㎡
export const SQFT_TO_SQM_RATIO = 0.0929;

// 에이커 변환 상수
// 1 acre = 4046.86 ㎡
export const ACRE_TO_SQM_RATIO = 4046.86;

// 1㎡ = 0.000247105 acre
export const SQM_TO_ACRE_RATIO = 0.000247105;

// 일반적인 평형에 대한 독점적 인사이트 데이터
export const PROPRIETARY_INSIGHTS = {
  59: {
    label: "25평형 (59㎡)",
    verdict: "신혼부부의 현실적 타협점",
    pros: "둘이 살긴 쾌적, 아이 하나까진 OK",
    cons: "짐이 많다면 팬트리 부족으로 거실이 창고됨",
    benchmark: "서울 신축 평균 전세가: 5.2억 (예시 데이터)"
  },
  84: {
    label: "34평형 (84㎡)",
    verdict: "대한민국 4인 가족 표준",
    pros: "되팔 때 가장 잘 팔림 (환금성 1위)",
    cons: "관리비가 20평대 대비 1.5배 상승 구간",
    benchmark: "국민평형(국평)이라 불림"
  }
} as const;
