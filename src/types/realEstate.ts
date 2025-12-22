/**
 * src/types/realEstate.ts
 * 부동산 실거래가 API 관련 타입 정의
 */

/**
 * 아파트 매매 실거래 데이터 (API 응답)
 */
export interface ApartmentTransaction {
  /** 법정동 시군구 코드 */
  lawdCd: string;
  /** 법정동 읍면동명 */
  umdNm: string;
  /** 아파트 단지명 */
  aptNm: string;
  /** 전용면적 (㎡) */
  excluUseAr: number;
  /** 계약년도 */
  dealYear: number;
  /** 계약월 */
  dealMonth: number;
  /** 계약일 */
  dealDay: number;
  /** 거래금액 (만원) */
  dealAmount: number;
  /** 층 */
  floor: number;
  /** 건축년도 */
  buildYear: number;
  /** 거래유형 (중개거래/직거래) */
  dealType?: string;
  /** 지번 */
  jibun?: string;
  /** 도로명 */
  roadNm?: string;
}

/**
 * 실거래가 조회 요청 파라미터
 */
export interface RealPriceSearchParams {
  /** 법정동 코드 (5자리) */
  lawdCd: string;
  /** 거래년월 (YYYYMM) */
  dealYmd: string;
  /** 페이지 번호 */
  pageNo?: number;
  /** 페이지당 결과 수 */
  numOfRows?: number;
}

/**
 * API 응답 래퍼
 */
export interface RealPriceApiResponse {
  success: boolean;
  data: ApartmentTransaction[];
  totalCount: number;
  errorMessage?: string;
}

/**
 * 평형대별 시세 요약
 */
export interface PriceSummaryBySize {
  /** 전용면적 범위 (예: "59-60") */
  sizeRange: string;
  /** 평형 (예: 18) */
  pyeong: number;
  /** 평균 거래가 (만원) */
  avgPrice: number;
  /** 최저 거래가 (만원) */
  minPrice: number;
  /** 최고 거래가 (만원) */
  maxPrice: number;
  /** 거래 건수 */
  transactionCount: number;
  /** 평당 평균가 (만원) */
  pricePerPyeong: number;
}

/**
 * 지역 시세 요약
 */
export interface RegionPriceSummary {
  /** 법정동 코드 */
  lawdCd: string;
  /** 지역명 */
  regionName: string;
  /** 조회 기간 */
  period: string;
  /** 평형대별 시세 */
  bySize: PriceSummaryBySize[];
  /** 전체 평균 평당가 (만원) */
  overallPricePerPyeong: number;
  /** 총 거래 건수 */
  totalTransactions: number;
}

/**
 * 전용면적 → 평형 변환
 */
export function sqmToPyeong(sqm: number): number {
  return Math.round(sqm / 3.3058);
}

/**
 * 평형대 그룹핑 (예: 84㎡ → "84-85")
 */
export function getSizeGroup(sqm: number): string {
  const base = Math.floor(sqm);
  return `${base}-${base + 1}`;
}
