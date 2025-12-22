/**
 * src/services/realEstateApi.ts
 * 국토교통부 실거래가 API 서비스
 *
 * @see https://www.data.go.kr/data/15126469/openapi.do
 *
 * 현재 모드: MOCK (API 키 없이 데모 데이터 사용)
 * TODO: 공공데이터포털 API 키 발급 후 실제 API 연동
 */

import type {
  ApartmentTransaction,
  RealPriceSearchParams,
  RealPriceApiResponse,
  RegionPriceSummary,
  PriceSummaryBySize,
} from '../types/realEstate';
import { sqmToPyeong, getSizeGroup } from '../types/realEstate';
import { getRegionName } from '../constants/regions';

/**
 * API 모드 설정
 * - 'mock': 데모 데이터 사용 (API 키 없이 테스트)
 * - 'live': 실제 API 호출 (API 키 필요)
 */
const API_MODE: 'mock' | 'live' = 'mock';

/**
 * 국토교통부 아파트 매매 실거래가 API 엔드포인트
 */
const API_ENDPOINT = 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev';

/**
 * Mock 데이터 생성 (데모용)
 */
function generateMockTransactions(lawdCd: string, dealYmd: string): ApartmentTransaction[] {
  const year = parseInt(dealYmd.substring(0, 4));
  const month = parseInt(dealYmd.substring(4, 6));

  // 지역별 기준 평당가 (만원)
  const basePricePerPyeong: Record<string, number> = {
    '11680': 8500,  // 강남구
    '11650': 7800,  // 서초구
    '11710': 6200,  // 송파구
    '11440': 5500,  // 마포구
    '41135': 4800,  // 분당구
    '41465': 3500,  // 수지구
  };

  const basePrice = basePricePerPyeong[lawdCd] || 3000;

  // 주요 평형대 (전용면적)
  const sizes = [59, 84, 114, 135];
  const aptNames = [
    '래미안', '자이', '아이파크', '힐스테이트', 'e편한세상',
    '롯데캐슬', '푸르지오', '더샵', '센트레빌', '포레나'
  ];
  const dongNames = ['역삼동', '삼성동', '청담동', '논현동', '대치동'];

  const transactions: ApartmentTransaction[] = [];

  // 각 평형대별 3-5건의 거래 생성
  sizes.forEach((size) => {
    const pyeong = sqmToPyeong(size);
    const count = 3 + Math.floor(Math.random() * 3);

    for (let i = 0; i < count; i++) {
      // 가격 변동 (±15%)
      const priceVariation = 0.85 + Math.random() * 0.3;
      const dealAmount = Math.round(basePrice * pyeong * priceVariation);

      transactions.push({
        lawdCd,
        umdNm: dongNames[Math.floor(Math.random() * dongNames.length)],
        aptNm: `${aptNames[Math.floor(Math.random() * aptNames.length)]} ${['1차', '2차', '센트럴'][Math.floor(Math.random() * 3)]}`,
        excluUseAr: size + Math.random() * 2 - 1, // ±1㎡ 변동
        dealYear: year,
        dealMonth: month,
        dealDay: 1 + Math.floor(Math.random() * 28),
        dealAmount,
        floor: 5 + Math.floor(Math.random() * 25),
        buildYear: 2005 + Math.floor(Math.random() * 18),
        dealType: Math.random() > 0.2 ? '중개거래' : '직거래',
      });
    }
  });

  return transactions;
}

/**
 * 실거래가 데이터 조회
 */
export async function fetchRealPrices(
  params: RealPriceSearchParams
): Promise<RealPriceApiResponse> {
  if (API_MODE === 'mock') {
    // Mock 모드: 데모 데이터 반환
    await new Promise((resolve) => setTimeout(resolve, 500)); // 네트워크 지연 시뮬레이션

    const mockData = generateMockTransactions(params.lawdCd, params.dealYmd);

    return {
      success: true,
      data: mockData,
      totalCount: mockData.length,
    };
  }

  // Live 모드: 실제 API 호출
  try {
    const apiKey = import.meta.env.PUBLIC_DATA_GO_KR_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        data: [],
        totalCount: 0,
        errorMessage: 'API 키가 설정되지 않았습니다.',
      };
    }

    const url = new URL(API_ENDPOINT);
    url.searchParams.set('serviceKey', apiKey);
    url.searchParams.set('LAWD_CD', params.lawdCd);
    url.searchParams.set('DEAL_YMD', params.dealYmd);
    url.searchParams.set('pageNo', String(params.pageNo || 1));
    url.searchParams.set('numOfRows', String(params.numOfRows || 100));

    const response = await fetch(url.toString());
    const xmlText = await response.text();

    // XML 파싱 (간략화 - 실제로는 xml2js 등 사용 권장)
    const transactions = parseXmlResponse(xmlText);

    return {
      success: true,
      data: transactions,
      totalCount: transactions.length,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      totalCount: 0,
      errorMessage: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
}

/**
 * XML 응답 파싱 (실제 API 연동 시 사용)
 */
function parseXmlResponse(xmlText: string): ApartmentTransaction[] {
  // 간단한 XML 파싱 (실제로는 xml2js 라이브러리 사용 권장)
  const transactions: ApartmentTransaction[] = [];

  // 정규식으로 item 태그 추출
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemXml = match[1];

    const getValue = (tag: string): string => {
      const tagRegex = new RegExp(`<${tag}>([^<]*)</${tag}>`);
      const tagMatch = itemXml.match(tagRegex);
      return tagMatch ? tagMatch[1].trim() : '';
    };

    transactions.push({
      lawdCd: getValue('법정동시군구코드') || getValue('지역코드'),
      umdNm: getValue('법정동읍면동코드') || getValue('법정동'),
      aptNm: getValue('아파트') || getValue('단지명'),
      excluUseAr: parseFloat(getValue('전용면적')) || 0,
      dealYear: parseInt(getValue('년')) || parseInt(getValue('계약년도')) || 0,
      dealMonth: parseInt(getValue('월')) || parseInt(getValue('계약월')) || 0,
      dealDay: parseInt(getValue('일')) || parseInt(getValue('계약일')) || 0,
      dealAmount: parseInt(getValue('거래금액').replace(/,/g, '')) || 0,
      floor: parseInt(getValue('층')) || 0,
      buildYear: parseInt(getValue('건축년도')) || 0,
      dealType: getValue('거래유형'),
      jibun: getValue('지번'),
      roadNm: getValue('도로명'),
    });
  }

  return transactions;
}

/**
 * 평형대별 시세 요약 계산
 */
export function calculatePriceSummary(
  transactions: ApartmentTransaction[],
  lawdCd: string,
  period: string
): RegionPriceSummary {
  // 전용면적별 그룹핑
  const sizeGroups = new Map<string, ApartmentTransaction[]>();

  transactions.forEach((t) => {
    const group = getSizeGroup(t.excluUseAr);
    if (!sizeGroups.has(group)) {
      sizeGroups.set(group, []);
    }
    sizeGroups.get(group)!.push(t);
  });

  // 평형대별 통계 계산
  const bySize: PriceSummaryBySize[] = [];
  let totalPricePerPyeong = 0;
  let totalWeightedCount = 0;

  sizeGroups.forEach((items, sizeRange) => {
    const prices = items.map((t) => t.dealAmount);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const avgSqm = items.reduce((a, b) => a + b.excluUseAr, 0) / items.length;
    const pyeong = sqmToPyeong(avgSqm);
    const pricePerPyeong = Math.round(avgPrice / pyeong);

    bySize.push({
      sizeRange,
      pyeong,
      avgPrice,
      minPrice,
      maxPrice,
      transactionCount: items.length,
      pricePerPyeong,
    });

    totalPricePerPyeong += pricePerPyeong * items.length;
    totalWeightedCount += items.length;
  });

  // 면적 순 정렬
  bySize.sort((a, b) => parseInt(a.sizeRange) - parseInt(b.sizeRange));

  return {
    lawdCd,
    regionName: getRegionName(lawdCd),
    period,
    bySize,
    overallPricePerPyeong:
      totalWeightedCount > 0 ? Math.round(totalPricePerPyeong / totalWeightedCount) : 0,
    totalTransactions: transactions.length,
  };
}

/**
 * 현재 연월 문자열 반환 (YYYYMM)
 */
export function getCurrentYearMonth(): string {
  const now = new Date();
  // 실거래가 데이터는 1-2개월 지연되므로 이전 달 조회
  now.setMonth(now.getMonth() - 1);
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * API 모드 확인
 */
export function isApiMockMode(): boolean {
  return API_MODE === 'mock';
}
