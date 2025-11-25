// 평수 변환 상수
// 1평 = 3.3058㎡ (정확한 값: 400/121 ≈ 3.305785...)
export const PYEONG_TO_SQM_RATIO = 3.3058;

// 1㎡ = 0.3025평 (정확한 값: 121/400 = 0.3025)
export const SQM_TO_PYEONG_RATIO = 0.3025;

// 일반적인 평형 참고 데이터
export const COMMON_SIZES = [
  { pyeong: 10, label: '10평', type: '원룸' },
  { pyeong: 15, label: '15평', type: '투룸' },
  { pyeong: 20, label: '20평', type: '소형 아파트' },
  { pyeong: 25, label: '25평', type: '중소형 아파트' },
  { pyeong: 30, label: '30평', type: '중형 아파트' },
  { pyeong: 35, label: '35평', type: '중대형 아파트' },
  { pyeong: 40, label: '40평', type: '대형 아파트' },
] as const;
