import { describe, it, expect } from 'vitest';
import {
  convertSqmToPyeong,
  convertPyeongToSqm,
  formatNumber,
  isValidInput,
  convertSqmToSqft,
  convertSqftToSqm,
  convertSqmToAcre,
  convertAcreToSqm,
  convertPyeongToSqft,
  convertSqftToPyeong,
  convertPyeongToAcre,
  convertAcreToPyeong,
} from './converter';

describe('convertSqmToPyeong', () => {
  it('33.06㎡를 10평으로 변환한다 (오차 0.01 이내)', () => {
    const result = convertSqmToPyeong(33.06);
    expect(result).toBeCloseTo(10, 2);
  });

  // 경계값 테스트
  it('0㎡를 0평으로 변환한다', () => {
    expect(convertSqmToPyeong(0)).toBe(0);
  });

  it('매우 큰 값도 정확히 변환한다', () => {
    const result = convertSqmToPyeong(10000);
    expect(result).toBeCloseTo(3025, 0);
  });

  it('소수점 값도 정확히 변환한다', () => {
    expect(convertSqmToPyeong(3.306)).toBeCloseTo(1, 2);
  });

  // 왕복 변환 정확도
  it('왕복 변환 시 원래 값과 유사하다', () => {
    const original = 33.06;
    const pyeong = convertSqmToPyeong(original);
    const backToSqm = convertPyeongToSqm(pyeong);
    expect(backToSqm).toBeCloseTo(original, 1);
  });
});

describe('convertPyeongToSqm', () => {
  it('10평을 33.06㎡로 변환한다 (오차 0.01 이내)', () => {
    const result = convertPyeongToSqm(10);
    expect(result).toBeCloseTo(33.06, 2);
  });

  // 경계값 테스트
  it('0평을 0㎡로 변환한다', () => {
    expect(convertPyeongToSqm(0)).toBe(0);
  });

  it('매우 큰 값도 정확히 변환한다', () => {
    const result = convertPyeongToSqm(1000);
    expect(result).toBeCloseTo(3305.8, 1);
  });

  it('소수점 값도 정확히 변환한다', () => {
    expect(convertPyeongToSqm(0.5)).toBeCloseTo(1.6529, 2);
  });

  // 일반적인 평형 테스트
  it.each([
    [10, 33.06],
    [15, 49.59],
    [20, 66.12],
    [25, 82.65],
    [30, 99.17],
    [35, 115.7],
    [40, 132.23],
  ])('%i평을 %f㎡로 변환한다', (pyeong, expectedSqm) => {
    expect(convertPyeongToSqm(pyeong)).toBeCloseTo(expectedSqm, 1);
  });
});

describe('formatNumber', () => {
  it('소수점 둘째자리까지 반올림한다 (기본값)', () => {
    expect(formatNumber(10.126)).toBe('10.13');
    expect(formatNumber(10.124)).toBe('10.12');
  });

  it('지정된 소수점 자릿수로 포맷한다', () => {
    expect(formatNumber(10.1234, 3)).toBe('10.123');
    expect(formatNumber(10, 1)).toBe('10.0');
  });

  // 경계값 테스트
  it('0을 올바르게 포맷한다', () => {
    expect(formatNumber(0)).toBe('0.00');
    expect(formatNumber(0, 0)).toBe('0');
  });

  it('매우 큰 숫자를 포맷한다', () => {
    expect(formatNumber(999999.999)).toBe('1000000.00');
  });

  it('매우 작은 소수를 포맷한다', () => {
    expect(formatNumber(0.001)).toBe('0.00');
    expect(formatNumber(0.001, 3)).toBe('0.001');
  });

  it('음수를 포맷한다', () => {
    expect(formatNumber(-10.126)).toBe('-10.13');
  });
});

describe('isValidInput', () => {
  it('빈 문자열은 유효하지 않다', () => {
    expect(isValidInput('')).toBe(false);
  });

  it('점만 있는 문자열은 유효하지 않다', () => {
    expect(isValidInput('.')).toBe(false);
  });

  it('음수는 유효하지 않다', () => {
    expect(isValidInput('-5')).toBe(false);
    expect(isValidInput('-10.5')).toBe(false);
  });

  it('유효한 양수는 유효하다', () => {
    expect(isValidInput('10')).toBe(true);
    expect(isValidInput('33.06')).toBe(true);
    expect(isValidInput('0')).toBe(true);
    expect(isValidInput('0.5')).toBe(true);
  });

  // 악성 입력 테스트 (XSS, SQL Injection 시도)
  // 참고: 현재 구현은 parseFloat을 사용하여 숫자로 시작하면 유효로 판정됨
  describe('악성 입력 방어', () => {
    it('문자열만 있는 입력은 유효하지 않다', () => {
      expect(isValidInput('abc')).toBe(false);
      expect(isValidInput('test')).toBe(false);
    });

    it('스크립트 태그만 있는 입력은 유효하지 않다', () => {
      expect(isValidInput('<script>alert(1)</script>')).toBe(false);
    });

    it('SQL Injection 시도 (숫자로 시작)는 parseFloat에 의해 유효로 처리됨', () => {
      // 경고: 현재 구현의 한계점 - 숫자로 시작하면 뒤 문자가 무시됨
      // 이는 UI 입력 검증용으로는 충분하지만, 서버 검증이 필요
      expect(isValidInput('1; DROP TABLE users;')).toBe(true); // parseFloat('1; DROP...') = 1
      expect(isValidInput("1' OR '1'='1")).toBe(true); // parseFloat("1' OR...") = 1
    });

    it('숫자로 시작하는 특수문자 포함 입력은 parseFloat에 의해 유효로 처리됨', () => {
      // 경고: 현재 구현의 한계점
      expect(isValidInput('10!')).toBe(true); // parseFloat('10!') = 10
      expect(isValidInput('10@#$')).toBe(true); // parseFloat('10@#$') = 10
      expect(isValidInput('10\n20')).toBe(true); // parseFloat('10\n20') = 10
    });

    it('숫자로 시작하는 공백 포함 입력은 parseFloat에 의해 유효로 처리됨', () => {
      // 경고: 현재 구현의 한계점
      expect(isValidInput(' 10')).toBe(true); // parseFloat(' 10') = 10
      expect(isValidInput('10 ')).toBe(true); // parseFloat('10 ') = 10
      expect(isValidInput('1 0')).toBe(true); // parseFloat('1 0') = 1
    });

    it('지수 표기법은 유효하다 (parseFloat 허용)', () => {
      // 참고: parseFloat('1e2') = 100, 이는 유효한 양수
      expect(isValidInput('1e2')).toBe(true);
    });

    it('Infinity는 유효하다 (parseFloat 허용)', () => {
      // 참고: parseFloat('Infinity') = Infinity
      expect(isValidInput('Infinity')).toBe(true);
    });
  });

  // 경계값 테스트
  describe('경계값', () => {
    it('매우 큰 숫자는 유효하다', () => {
      expect(isValidInput('999999999')).toBe(true);
    });

    it('매우 작은 양수는 유효하다', () => {
      expect(isValidInput('0.0001')).toBe(true);
    });

    it('선행 0이 있는 숫자는 유효하다', () => {
      expect(isValidInput('00010')).toBe(true);
    });
  });
});

// 제곱피트 변환 테스트
describe('convertSqmToSqft', () => {
  it('1㎡를 10.764 sqft로 변환한다', () => {
    expect(convertSqmToSqft(1)).toBeCloseTo(10.764, 2);
  });

  it('0㎡를 0 sqft로 변환한다', () => {
    expect(convertSqmToSqft(0)).toBe(0);
  });

  it('100㎡를 약 1076.4 sqft로 변환한다', () => {
    expect(convertSqmToSqft(100)).toBeCloseTo(1076.4, 0);
  });
});

describe('convertSqftToSqm', () => {
  it('10.764 sqft를 약 1㎡로 변환한다', () => {
    expect(convertSqftToSqm(10.764)).toBeCloseTo(1, 2);
  });

  it('0 sqft를 0㎡로 변환한다', () => {
    expect(convertSqftToSqm(0)).toBe(0);
  });

  it('1000 sqft를 약 92.9㎡로 변환한다', () => {
    expect(convertSqftToSqm(1000)).toBeCloseTo(92.9, 0);
  });
});

// 에이커 변환 테스트
describe('convertSqmToAcre', () => {
  it('4046.86㎡를 1 acre로 변환한다', () => {
    expect(convertSqmToAcre(4046.86)).toBeCloseTo(1, 2);
  });

  it('0㎡를 0 acre로 변환한다', () => {
    expect(convertSqmToAcre(0)).toBe(0);
  });

  it('10000㎡를 약 2.47 acre로 변환한다', () => {
    expect(convertSqmToAcre(10000)).toBeCloseTo(2.47, 1);
  });
});

describe('convertAcreToSqm', () => {
  it('1 acre를 약 4046.86㎡로 변환한다', () => {
    expect(convertAcreToSqm(1)).toBeCloseTo(4046.86, 0);
  });

  it('0 acre를 0㎡로 변환한다', () => {
    expect(convertAcreToSqm(0)).toBe(0);
  });
});

// 평 ↔ 제곱피트 변환 테스트
describe('convertPyeongToSqft', () => {
  it('1평을 약 35.58 sqft로 변환한다', () => {
    expect(convertPyeongToSqft(1)).toBeCloseTo(35.58, 1);
  });

  it('10평을 약 355.8 sqft로 변환한다', () => {
    expect(convertPyeongToSqft(10)).toBeCloseTo(355.8, 0);
  });

  it('0평을 0 sqft로 변환한다', () => {
    expect(convertPyeongToSqft(0)).toBe(0);
  });
});

describe('convertSqftToPyeong', () => {
  it('35.58 sqft를 약 1평으로 변환한다', () => {
    expect(convertSqftToPyeong(35.58)).toBeCloseTo(1, 1);
  });

  it('0 sqft를 0평으로 변환한다', () => {
    expect(convertSqftToPyeong(0)).toBe(0);
  });
});

// 평 ↔ 에이커 변환 테스트
describe('convertPyeongToAcre', () => {
  it('1224평을 약 1 acre로 변환한다', () => {
    // 1 acre = 4046.86㎡, 1평 = 3.3058㎡ → 4046.86 / 3.3058 ≈ 1224
    expect(convertPyeongToAcre(1224)).toBeCloseTo(1, 1);
  });

  it('0평을 0 acre로 변환한다', () => {
    expect(convertPyeongToAcre(0)).toBe(0);
  });
});

describe('convertAcreToPyeong', () => {
  it('1 acre를 약 1224평으로 변환한다', () => {
    expect(convertAcreToPyeong(1)).toBeCloseTo(1224, 0);
  });

  it('0 acre를 0평으로 변환한다', () => {
    expect(convertAcreToPyeong(0)).toBe(0);
  });
});
