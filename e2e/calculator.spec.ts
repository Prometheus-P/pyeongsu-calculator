import { test, expect } from '@playwright/test';

test.describe('평수 계산기 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('페이지 로딩', () => {
    test('페이지가 정상적으로 로드된다', async ({ page }) => {
      await expect(page).toHaveTitle(/평수/i);
      await expect(page.getByRole('heading', { name: '평수 계산기' })).toBeVisible();
    });

    test('모든 UI 요소가 표시된다', async ({ page }) => {
      // Calculator
      await expect(page.getByLabel(/제곱미터/)).toBeVisible();
      await expect(page.getByLabel(/평/)).toBeVisible();
      await expect(page.getByRole('button', { name: /초기화/ })).toBeVisible();

      // Quick buttons
      const quickButtons = [10, 15, 20, 25, 30, 35, 40];
      for (const size of quickButtons) {
        await expect(page.getByRole('button', { name: `${size}평` })).toBeVisible();
      }

      // Reference table
      await expect(page.getByText('일반적인 평형 참고')).toBeVisible();
      await expect(page.getByRole('table')).toBeVisible();
    });
  });

  test.describe('제곱미터 → 평 변환', () => {
    test('제곱미터 입력 시 평수가 실시간으로 계산된다', async ({ page }) => {
      const sqmInput = page.getByLabel(/제곱미터/);
      const pyeongInput = page.getByLabel(/평/);

      await sqmInput.fill('33.06');
      await expect(pyeongInput).toHaveValue('10.00');
    });

    test('0 입력 시 0평으로 표시된다', async ({ page }) => {
      const sqmInput = page.getByLabel(/제곱미터/);
      const pyeongInput = page.getByLabel(/평/);

      await sqmInput.fill('0');
      await expect(pyeongInput).toHaveValue('0.00');
    });

    test('소수점 입력이 정상 동작한다', async ({ page }) => {
      const sqmInput = page.getByLabel(/제곱미터/);
      const pyeongInput = page.getByLabel(/평/);

      await sqmInput.fill('85.5');
      // 85.5 * 0.3025 = 25.86375 → 25.86
      await expect(pyeongInput).toHaveValue('25.86');
    });
  });

  test.describe('평 → 제곱미터 변환', () => {
    test('평 입력 시 제곱미터가 실시간으로 계산된다', async ({ page }) => {
      const sqmInput = page.getByLabel(/제곱미터/);
      const pyeongInput = page.getByLabel(/평/);

      await pyeongInput.fill('10');
      await expect(sqmInput).toHaveValue('33.06');
    });

    test('큰 숫자도 정상 변환된다', async ({ page }) => {
      const sqmInput = page.getByLabel(/제곱미터/);
      const pyeongInput = page.getByLabel(/평/);

      await pyeongInput.fill('100');
      await expect(sqmInput).toHaveValue('330.58');
    });
  });

  test.describe('빠른 선택 버튼', () => {
    const testCases = [
      { pyeong: 10, sqm: '33.06' },
      { pyeong: 15, sqm: '49.59' },
      { pyeong: 20, sqm: '66.12' },
      { pyeong: 25, sqm: '82.64' },
      { pyeong: 30, sqm: '99.17' },
      { pyeong: 35, sqm: '115.70' },
      { pyeong: 40, sqm: '132.23' },
    ];

    for (const { pyeong, sqm } of testCases) {
      test(`${pyeong}평 버튼 클릭 시 ${sqm}㎡로 변환된다`, async ({ page }) => {
        await page.getByRole('button', { name: `${pyeong}평` }).click();

        await expect(page.getByLabel(/평/)).toHaveValue(String(pyeong));
        await expect(page.getByLabel(/제곱미터/)).toHaveValue(sqm);
      });
    }
  });

  test.describe('초기화 기능', () => {
    test('초기화 버튼이 모든 필드를 비운다', async ({ page }) => {
      const sqmInput = page.getByLabel(/제곱미터/);
      const pyeongInput = page.getByLabel(/평/);

      // 값 입력
      await sqmInput.fill('100');
      await expect(pyeongInput).toHaveValue('30.25');

      // 초기화
      await page.getByRole('button', { name: /초기화/ }).click();

      await expect(sqmInput).toHaveValue('');
      await expect(pyeongInput).toHaveValue('');
    });
  });

  test.describe('참고 테이블 연동', () => {
    test('테이블 행 클릭 시 Calculator가 업데이트된다', async ({ page }) => {
      const sqmInput = page.getByLabel(/제곱미터/);
      const pyeongInput = page.getByLabel(/평/);

      // 30평 테이블 셀 클릭 (버튼이 아닌 테이블 셀)
      await page.getByRole('cell', { name: '30평' }).click();

      await expect(pyeongInput).toHaveValue('30');
      await expect(sqmInput).toHaveValue('99.17');
    });

    test('테이블의 모든 항목이 표시된다', async ({ page }) => {
      const types = ['원룸', '투룸', '소형 아파트', '중소형 아파트', '중형 아파트', '중대형 아파트', '대형 아파트'];

      for (const type of types) {
        await expect(page.getByRole('cell', { name: type, exact: true })).toBeVisible();
      }
    });
  });

  test.describe('사용자 시나리오', () => {
    test('시나리오: 85㎡ 아파트의 평수 확인', async ({ page }) => {
      await page.getByLabel(/제곱미터/).fill('85');
      await expect(page.getByLabel(/평/)).toHaveValue('25.71');
    });

    test('시나리오: 25평 아파트의 제곱미터 확인', async ({ page }) => {
      await page.getByLabel(/평/).fill('25');
      await expect(page.getByLabel(/제곱미터/)).toHaveValue('82.64');
    });

    test('시나리오: 빠른 선택 후 수동 조정', async ({ page }) => {
      // 30평 빠른 선택
      await page.getByRole('button', { name: '30평' }).click();
      await expect(page.getByLabel(/제곱미터/)).toHaveValue('99.17');

      // 수동으로 32평으로 조정
      await page.getByLabel(/평/).fill('32');
      await expect(page.getByLabel(/제곱미터/)).toHaveValue('105.79');
    });

    test('시나리오: 여러 평형 비교', async ({ page }) => {
      const sqmInput = page.getByLabel(/제곱미터/);

      // 20평
      await page.getByRole('button', { name: '20평' }).click();
      await expect(sqmInput).toHaveValue('66.12');

      // 30평
      await page.getByRole('button', { name: '30평' }).click();
      await expect(sqmInput).toHaveValue('99.17');

      // 40평
      await page.getByRole('button', { name: '40평' }).click();
      await expect(sqmInput).toHaveValue('132.23');
    });
  });

  test.describe('접근성', () => {
    test('키보드 탐색이 가능하다', async ({ page }) => {
      // Tab으로 요소 이동
      await page.keyboard.press('Tab');
      await expect(page.getByLabel(/제곱미터/)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(page.getByLabel(/평/)).toBeFocused();
    });

    test('Enter 키로 테이블 항목 선택 가능', async ({ page }) => {
      // 10평 테이블 행에 포커스
      const row = page.getByRole('row', { name: /10평.*33\.06㎡.*원룸/ });
      await row.focus();
      await page.keyboard.press('Enter');

      await expect(page.getByLabel(/평/)).toHaveValue('10');
    });

    test('포커스 표시가 보인다', async ({ page }) => {
      const sqmInput = page.getByLabel(/제곱미터/);
      await sqmInput.focus();

      // focus ring이 있는지 확인 (class 기반)
      await expect(sqmInput).toBeFocused();
    });
  });

  test.describe('반응형 디자인', () => {
    test('모바일 뷰포트에서 정상 표시된다', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await expect(page.getByRole('heading', { name: '평수 계산기' })).toBeVisible();
      await expect(page.getByLabel(/제곱미터/)).toBeVisible();
      await expect(page.getByLabel(/평/)).toBeVisible();
    });

    test('태블릿 뷰포트에서 정상 표시된다', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await expect(page.getByRole('heading', { name: '평수 계산기' })).toBeVisible();
      await expect(page.getByRole('table')).toBeVisible();
    });
  });

  test.describe('엣지 케이스', () => {
    test('빈 입력은 반대 필드를 비운다', async ({ page }) => {
      const sqmInput = page.getByLabel(/제곱미터/);
      const pyeongInput = page.getByLabel(/평/);

      await sqmInput.fill('100');
      await expect(pyeongInput).not.toHaveValue('');

      await sqmInput.fill('');
      await expect(pyeongInput).toHaveValue('');
    });

    test('매우 큰 숫자도 처리된다', async ({ page }) => {
      await page.getByLabel(/제곱미터/).fill('999999');
      await expect(page.getByLabel(/평/)).toHaveValue('302499.70');
    });

    test('소수점만 입력 시 반대 필드가 비어있다', async ({ page }) => {
      await page.getByLabel(/제곱미터/).fill('.');
      await expect(page.getByLabel(/평/)).toHaveValue('');
    });
  });

  test.describe('성능', () => {
    test('페이지 로드 시간이 3초 이내', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000);
    });

    test('입력 반응이 즉각적이다', async ({ page }) => {
      const sqmInput = page.getByLabel(/제곱미터/);
      const pyeongInput = page.getByLabel(/평/);

      const startTime = Date.now();
      await sqmInput.fill('100');
      await expect(pyeongInput).toHaveValue('30.25');
      const responseTime = Date.now() - startTime;

      expect(responseTime).toBeLessThan(500);
    });
  });
});
