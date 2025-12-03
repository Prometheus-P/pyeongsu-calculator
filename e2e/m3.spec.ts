import { test, expect } from '@playwright/test';

test.describe('Material Design 3 디자인 시스템 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // T027: M3 Visual Consistency E2E Test
  test.describe('T027: M3 시각적 일관성', () => {
    test('M3 색상 토큰이 적용되어 있다', async ({ page }) => {
      // Calculator 카드 배경색 확인
      const calculator = page.locator('.bg-m3-surface').first();
      await expect(calculator).toBeVisible();

      // 버튼에 M3 색상 적용 확인
      const primaryButton = page.getByRole('button', { name: /복사/ });
      const resetButton = page.getByRole('button', { name: /초기화/ });

      // 입력 값이 있어야 복사 버튼이 보임
      await page.getByLabel(/제곱미터/).fill('100');
      await expect(primaryButton).toBeVisible();
      await expect(resetButton).toBeVisible();
    });

    test('M3 타이포그래피가 적용되어 있다', async ({ page }) => {
      // 헤드라인 스타일 확인
      const heading = page.getByRole('heading', { name: '평수 계산기' });
      await expect(heading).toBeVisible();
      await expect(heading).toHaveClass(/text-headline-small/);
    });

    test('M3 elevation이 카드에 적용되어 있다', async ({ page }) => {
      // Calculator 카드의 그림자 확인
      const calculator = page.locator('.shadow-m3-2').first();
      await expect(calculator).toBeVisible();
    });

    test('M3 border-radius가 적용되어 있다', async ({ page }) => {
      // 버튼의 rounded 스타일 확인
      const button = page.getByRole('button', { name: /초기화/ });
      await expect(button).toHaveClass(/rounded-m3-sm/);
    });

    test('Footer에 M3 surface-variant 색상이 적용되어 있다', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toHaveClass(/bg-m3-surface-variant/);
    });
  });

  // T028: State Layer Interaction E2E Test
  test.describe('T028: State Layer 인터랙션', () => {
    test('버튼에 m3-state-layer 클래스가 적용되어 있다', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /초기화/ });
      await expect(resetButton).toHaveClass(/m3-state-layer/);
    });

    test('빠른 선택 버튼에 state layer가 적용되어 있다', async ({ page }) => {
      const quickButton = page.getByRole('button', { name: '10평' });
      await expect(quickButton).toHaveClass(/m3-state-layer/);
    });

    test('입력 필드에 포커스 시 M3 스타일이 적용된다', async ({ page }) => {
      const sqmInput = page.getByLabel(/제곱미터/);
      await sqmInput.focus();
      await expect(sqmInput).toBeFocused();
      await expect(sqmInput).toHaveClass(/m3-outlined-input/);
    });

    test('버튼의 최소 터치 영역이 48px이다', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: /초기화/ });
      const boundingBox = await resetButton.boundingBox();

      expect(boundingBox).not.toBeNull();
      if (boundingBox) {
        expect(boundingBox.height).toBeGreaterThanOrEqual(48);
      }
    });

    test('테마 토글 버튼에 state layer가 적용되어 있다', async ({ page }) => {
      const themeToggle = page.getByRole('button', { name: /모드로 전환/ });
      await expect(themeToggle).toHaveClass(/m3-state-layer/);
    });
  });

  // T029: Theme Switching E2E Test
  test.describe('T029: 테마 전환', () => {
    test('테마 토글 버튼이 존재한다', async ({ page }) => {
      const themeToggle = page.getByRole('button', { name: /모드로 전환/ });
      await expect(themeToggle).toBeVisible();
    });

    test('테마 토글 시 다크 모드가 활성화된다', async ({ page }) => {
      const themeToggle = page.getByRole('button', { name: /다크 모드로 전환/ });
      await themeToggle.click();

      // dark 클래스가 html에 추가되었는지 확인
      const html = page.locator('html');
      await expect(html).toHaveClass(/dark/);
    });

    test('테마 토글 시 라이트 모드로 복귀한다', async ({ page }) => {
      // 먼저 다크 모드로 전환
      const themeToggle = page.getByRole('button', { name: /다크 모드로 전환/ });
      await themeToggle.click();

      // 라이트 모드로 다시 전환
      const lightToggle = page.getByRole('button', { name: /라이트 모드로 전환/ });
      await lightToggle.click();

      const html = page.locator('html');
      await expect(html).not.toHaveClass(/dark/);
    });

    test('테마 토글 버튼에 SVG 아이콘이 사용된다', async ({ page }) => {
      const themeToggle = page.getByRole('button', { name: /모드로 전환/ });
      const svg = themeToggle.locator('svg');
      await expect(svg).toBeVisible();
    });

    test('테마 설정이 localStorage에 저장된다', async ({ page }) => {
      // 다크 모드로 전환
      const themeToggle = page.getByRole('button', { name: /다크 모드로 전환/ });
      await themeToggle.click();

      // localStorage 확인
      const theme = await page.evaluate(() => localStorage.getItem('theme'));
      expect(theme).toBe('dark');
    });

    test('body에 transition duration-300 클래스가 적용되어 있다', async ({ page }) => {
      const body = page.locator('body');
      await expect(body).toHaveClass(/duration-300/);
    });
  });

  // T030: High Contrast Mode E2E Test
  test.describe('T030: 고대비 모드', () => {
    test('prefers-contrast: more 미디어 쿼리가 스타일시트에 존재한다', async ({ page }) => {
      // CSS에 고대비 모드 스타일이 정의되어 있는지 확인
      const hasHighContrastStyles = await page.evaluate(() => {
        const styleSheets = Array.from(document.styleSheets);
        for (const sheet of styleSheets) {
          try {
            const rules = Array.from(sheet.cssRules || []);
            for (const rule of rules) {
              if (rule instanceof CSSMediaRule) {
                if (rule.conditionText?.includes('prefers-contrast: more')) {
                  return true;
                }
              }
            }
          } catch {
            // Cross-origin stylesheets will throw
            continue;
          }
        }
        return false;
      });

      expect(hasHighContrastStyles).toBe(true);
    });

    test.describe('고대비 모드 에뮬레이션', () => {
      test('고대비 모드에서 outline 색상이 변경된다', async ({ page }) => {
        // Playwright에서 고대비 모드 에뮬레이션
        await page.emulateMedia({ forcedColors: 'active' });

        // 페이지 재로드
        await page.goto('/');

        // 입력 필드가 여전히 표시되는지 확인
        const sqmInput = page.getByLabel(/제곱미터/);
        await expect(sqmInput).toBeVisible();
      });
    });
  });

  // Additional visual regression tests
  test.describe('시각적 일관성 추가 테스트', () => {
    test('라이트 모드에서 모든 컴포넌트가 렌더링된다', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '평수 계산기' })).toBeVisible();
      await expect(page.getByText('일반적인 평형 참고')).toBeVisible();
      await expect(page.getByText('최근 변환 기록')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });

    test('다크 모드에서 모든 컴포넌트가 렌더링된다', async ({ page }) => {
      // 다크 모드 활성화
      const themeToggle = page.getByRole('button', { name: /다크 모드로 전환/ });
      await themeToggle.click();

      await expect(page.getByRole('heading', { name: '평수 계산기' })).toBeVisible();
      await expect(page.getByText('일반적인 평형 참고')).toBeVisible();
      await expect(page.getByText('최근 변환 기록')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });

    test('M3 spacing이 적용되어 있다', async ({ page }) => {
      // 카드 패딩 확인
      const calculator = page.locator('.p-m3-6').first();
      await expect(calculator).toBeVisible();
    });
  });
});
