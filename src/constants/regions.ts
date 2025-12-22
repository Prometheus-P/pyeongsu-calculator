/**
 * src/constants/regions.ts
 * 법정동 코드 상수 정의
 *
 * @see https://www.code.go.kr/stdcode/regCodeL.do
 */

export interface RegionCode {
  code: string;
  name: string;
  nameEn: string;
}

/**
 * 주요 시/도 법정동 코드 (앞 2자리)
 */
export const SIDO_CODES: Record<string, RegionCode> = {
  '11': { code: '11', name: '서울특별시', nameEn: 'Seoul' },
  '26': { code: '26', name: '부산광역시', nameEn: 'Busan' },
  '27': { code: '27', name: '대구광역시', nameEn: 'Daegu' },
  '28': { code: '28', name: '인천광역시', nameEn: 'Incheon' },
  '29': { code: '29', name: '광주광역시', nameEn: 'Gwangju' },
  '30': { code: '30', name: '대전광역시', nameEn: 'Daejeon' },
  '31': { code: '31', name: '울산광역시', nameEn: 'Ulsan' },
  '36': { code: '36', name: '세종특별자치시', nameEn: 'Sejong' },
  '41': { code: '41', name: '경기도', nameEn: 'Gyeonggi' },
  '42': { code: '42', name: '강원특별자치도', nameEn: 'Gangwon' },
  '43': { code: '43', name: '충청북도', nameEn: 'Chungbuk' },
  '44': { code: '44', name: '충청남도', nameEn: 'Chungnam' },
  '45': { code: '45', name: '전북특별자치도', nameEn: 'Jeonbuk' },
  '46': { code: '46', name: '전라남도', nameEn: 'Jeonnam' },
  '47': { code: '47', name: '경상북도', nameEn: 'Gyeongbuk' },
  '48': { code: '48', name: '경상남도', nameEn: 'Gyeongnam' },
  '50': { code: '50', name: '제주특별자치도', nameEn: 'Jeju' },
};

/**
 * 서울특별시 구/군 법정동 코드 (앞 5자리)
 * - 가장 많이 조회되는 서울 지역 우선 포함
 */
export const SEOUL_GUGUN_CODES: Record<string, RegionCode> = {
  '11110': { code: '11110', name: '종로구', nameEn: 'Jongno-gu' },
  '11140': { code: '11140', name: '중구', nameEn: 'Jung-gu' },
  '11170': { code: '11170', name: '용산구', nameEn: 'Yongsan-gu' },
  '11200': { code: '11200', name: '성동구', nameEn: 'Seongdong-gu' },
  '11215': { code: '11215', name: '광진구', nameEn: 'Gwangjin-gu' },
  '11230': { code: '11230', name: '동대문구', nameEn: 'Dongdaemun-gu' },
  '11260': { code: '11260', name: '중랑구', nameEn: 'Jungnang-gu' },
  '11290': { code: '11290', name: '성북구', nameEn: 'Seongbuk-gu' },
  '11305': { code: '11305', name: '강북구', nameEn: 'Gangbuk-gu' },
  '11320': { code: '11320', name: '도봉구', nameEn: 'Dobong-gu' },
  '11350': { code: '11350', name: '노원구', nameEn: 'Nowon-gu' },
  '11380': { code: '11380', name: '은평구', nameEn: 'Eunpyeong-gu' },
  '11410': { code: '11410', name: '서대문구', nameEn: 'Seodaemun-gu' },
  '11440': { code: '11440', name: '마포구', nameEn: 'Mapo-gu' },
  '11470': { code: '11470', name: '양천구', nameEn: 'Yangcheon-gu' },
  '11500': { code: '11500', name: '강서구', nameEn: 'Gangseo-gu' },
  '11530': { code: '11530', name: '구로구', nameEn: 'Guro-gu' },
  '11545': { code: '11545', name: '금천구', nameEn: 'Geumcheon-gu' },
  '11560': { code: '11560', name: '영등포구', nameEn: 'Yeongdeungpo-gu' },
  '11590': { code: '11590', name: '동작구', nameEn: 'Dongjak-gu' },
  '11620': { code: '11620', name: '관악구', nameEn: 'Gwanak-gu' },
  '11650': { code: '11650', name: '서초구', nameEn: 'Seocho-gu' },
  '11680': { code: '11680', name: '강남구', nameEn: 'Gangnam-gu' },
  '11710': { code: '11710', name: '송파구', nameEn: 'Songpa-gu' },
  '11740': { code: '11740', name: '강동구', nameEn: 'Gangdong-gu' },
};

/**
 * 경기도 주요 시/군 법정동 코드 (앞 5자리)
 */
export const GYEONGGI_SIGUN_CODES: Record<string, RegionCode> = {
  '41111': { code: '41111', name: '수원시 장안구', nameEn: 'Suwon Jangan-gu' },
  '41113': { code: '41113', name: '수원시 권선구', nameEn: 'Suwon Gwonseon-gu' },
  '41115': { code: '41115', name: '수원시 팔달구', nameEn: 'Suwon Paldal-gu' },
  '41117': { code: '41117', name: '수원시 영통구', nameEn: 'Suwon Yeongtong-gu' },
  '41131': { code: '41131', name: '성남시 수정구', nameEn: 'Seongnam Sujeong-gu' },
  '41133': { code: '41133', name: '성남시 중원구', nameEn: 'Seongnam Jungwon-gu' },
  '41135': { code: '41135', name: '성남시 분당구', nameEn: 'Seongnam Bundang-gu' },
  '41171': { code: '41171', name: '안양시 만안구', nameEn: 'Anyang Manan-gu' },
  '41173': { code: '41173', name: '안양시 동안구', nameEn: 'Anyang Dongan-gu' },
  '41281': { code: '41281', name: '고양시 덕양구', nameEn: 'Goyang Deogyang-gu' },
  '41285': { code: '41285', name: '고양시 일산동구', nameEn: 'Goyang Ilsandong-gu' },
  '41287': { code: '41287', name: '고양시 일산서구', nameEn: 'Goyang Ilsanseo-gu' },
  '41290': { code: '41290', name: '과천시', nameEn: 'Gwacheon' },
  '41360': { code: '41360', name: '남양주시', nameEn: 'Namyangju' },
  '41390': { code: '41390', name: '하남시', nameEn: 'Hanam' },
  '41410': { code: '41410', name: '파주시', nameEn: 'Paju' },
  '41461': { code: '41461', name: '용인시 처인구', nameEn: 'Yongin Cheoin-gu' },
  '41463': { code: '41463', name: '용인시 기흥구', nameEn: 'Yongin Giheung-gu' },
  '41465': { code: '41465', name: '용인시 수지구', nameEn: 'Yongin Suji-gu' },
  '41480': { code: '41480', name: '화성시', nameEn: 'Hwaseong' },
};

/**
 * 인기 지역 (빠른 선택용)
 */
export const POPULAR_REGIONS: RegionCode[] = [
  SEOUL_GUGUN_CODES['11680'], // 강남구
  SEOUL_GUGUN_CODES['11650'], // 서초구
  SEOUL_GUGUN_CODES['11710'], // 송파구
  SEOUL_GUGUN_CODES['11440'], // 마포구
  GYEONGGI_SIGUN_CODES['41135'], // 분당구
  GYEONGGI_SIGUN_CODES['41465'], // 수지구
];

/**
 * 법정동 코드로 지역명 조회
 */
export function getRegionName(lawdCd: string): string {
  // 서울
  if (SEOUL_GUGUN_CODES[lawdCd]) {
    return `서울 ${SEOUL_GUGUN_CODES[lawdCd].name}`;
  }
  // 경기
  if (GYEONGGI_SIGUN_CODES[lawdCd]) {
    return `경기 ${GYEONGGI_SIGUN_CODES[lawdCd].name}`;
  }
  // 시도 코드만 있는 경우
  const sidoCode = lawdCd.substring(0, 2);
  if (SIDO_CODES[sidoCode]) {
    return SIDO_CODES[sidoCode].name;
  }
  return lawdCd;
}
