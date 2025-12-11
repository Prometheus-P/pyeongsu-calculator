import { test, expect } from '@playwright/test';

test.describe('SEO E2E 테스트', () => {
  test.describe('User Story 1: 검색 엔진 발견', () => {
    test.describe('메타 태그 (T005)', () => {
      test('홈페이지에 필수 메타 태그가 있다', async ({ page }) => {
        await page.goto('/');

        // Title
        await expect(page).toHaveTitle(/평수 계산기/);

        // Description
        const description = await page.getAttribute(
          'meta[name="description"]',
          'content'
        );
        expect(description).toBeTruthy();
        expect(description!.length).toBeGreaterThan(0);
        expect(description!.length).toBeLessThanOrEqual(160);

        // Canonical
        const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
        expect(canonical).toBeTruthy();
      });

      test('가이드 페이지에 고유 메타 태그가 있다', async ({ page }) => {
        await page.goto('/guide/pyeong-sqm-guide');

        const title = await page.title();
        expect(title).not.toContain('평수 계산기 |'); // Should be unique, not generic

        const description = await page.getAttribute(
          'meta[name="description"]',
          'content'
        );
        expect(description).toBeTruthy();
      });
    });

    test.describe('구조화된 데이터 (T006)', () => {
      test('홈페이지에 WebApplication 스키마가 있다', async ({ page }) => {
        await page.goto('/');

        const jsonLd = await page.evaluate(() => {
          const scripts = document.querySelectorAll(
            'script[type="application/ld+json"]'
          );
          return Array.from(scripts).map((s) => {
            try {
              return JSON.parse(s.textContent || '{}');
            } catch {
              return null;
            }
          });
        });

        const webApp = jsonLd.find((s) => s && s['@type'] === 'WebApplication');
        expect(webApp).toBeTruthy();
        expect(webApp.name).toBe('PyeongCalc 평수 계산기');
        expect(webApp.applicationCategory).toBe('FinanceApplication');
      });

      test('홈페이지에 FAQPage 스키마가 있다', async ({ page }) => {
        await page.goto('/');

        const jsonLd = await page.evaluate(() => {
          const scripts = document.querySelectorAll(
            'script[type="application/ld+json"]'
          );
          return Array.from(scripts).map((s) => {
            try {
              return JSON.parse(s.textContent || '{}');
            } catch {
              return null;
            }
          });
        });

        const faq = jsonLd.find((s) => s && s['@type'] === 'FAQPage');
        expect(faq).toBeTruthy();
        expect(faq.mainEntity).toBeDefined();
        expect(faq.mainEntity.length).toBeGreaterThan(0);
      });

      test('홈페이지에 HowTo 스키마가 있다', async ({ page }) => {
        await page.goto('/');

        const jsonLd = await page.evaluate(() => {
          const scripts = document.querySelectorAll(
            'script[type="application/ld+json"]'
          );
          return Array.from(scripts).map((s) => {
            try {
              return JSON.parse(s.textContent || '{}');
            } catch {
              return null;
            }
          });
        });

        const howTo = jsonLd.find((s) => s && s['@type'] === 'HowTo');
        expect(howTo).toBeTruthy();
        expect(howTo.step).toBeDefined();
        expect(howTo.step.length).toBeGreaterThan(0);
      });
    });

    test.describe('robots.txt 접근성 (T007)', () => {
      test('robots.txt가 접근 가능하다', async ({ page }) => {
        const response = await page.goto('/robots.txt');
        expect(response?.status()).toBe(200);
      });

      test('robots.txt에 올바른 내용이 있다', async ({ page }) => {
        await page.goto('/robots.txt');
        const content = await page.textContent('body');

        expect(content).toContain('User-agent:');
        expect(content).toContain('Allow:');
        expect(content).toContain('Sitemap:');
      });

      test('sitemap이 robots.txt에 참조되어 있다', async ({ page }) => {
        await page.goto('/robots.txt');
        const content = await page.textContent('body');

        expect(content).toContain('sitemap-index.xml');
      });
    });
  });

  test.describe('User Story 2: 소셜 미디어 공유', () => {
    test.describe('Open Graph 태그 (T011)', () => {
      test('홈페이지에 OG 태그가 있다', async ({ page }) => {
        await page.goto('/');

        const ogTitle = await page.getAttribute(
          'meta[property="og:title"]',
          'content'
        );
        const ogDescription = await page.getAttribute(
          'meta[property="og:description"]',
          'content'
        );
        const ogImage = await page.getAttribute(
          'meta[property="og:image"]',
          'content'
        );
        const ogUrl = await page.getAttribute(
          'meta[property="og:url"]',
          'content'
        );
        const ogType = await page.getAttribute(
          'meta[property="og:type"]',
          'content'
        );

        expect(ogTitle).toBeTruthy();
        expect(ogDescription).toBeTruthy();
        expect(ogImage).toBeTruthy();
        expect(ogImage).toContain('.png'); // Should be PNG, not SVG
        expect(ogUrl).toBeTruthy();
        expect(ogType).toBe('website');
      });

      test('OG 이미지가 절대 URL이다', async ({ page }) => {
        await page.goto('/');

        const ogImage = await page.getAttribute(
          'meta[property="og:image"]',
          'content'
        );
        expect(ogImage).toMatch(/^https?:\/\//);
      });
    });

    test.describe('Twitter Card 태그 (T012)', () => {
      test('홈페이지에 Twitter Card 태그가 있다', async ({ page }) => {
        await page.goto('/');

        const twitterCard = await page.getAttribute(
          'meta[name="twitter:card"]',
          'content'
        );
        const twitterTitle = await page.getAttribute(
          'meta[name="twitter:title"]',
          'content'
        );
        const twitterImage = await page.getAttribute(
          'meta[name="twitter:image"]',
          'content'
        );

        expect(twitterCard).toBe('summary_large_image');
        expect(twitterTitle).toBeTruthy();
        expect(twitterImage).toBeTruthy();
        expect(twitterImage).toContain('.png'); // Should be PNG
      });
    });
  });

  test.describe('User Story 3: 가이드 콘텐츠 발견', () => {
    test.describe('Article 스키마 (T016)', () => {
      test('가이드 페이지에 Article 스키마가 있다', async ({ page }) => {
        await page.goto('/guide/pyeong-sqm-guide');

        const jsonLd = await page.evaluate(() => {
          const scripts = document.querySelectorAll(
            'script[type="application/ld+json"]'
          );
          return Array.from(scripts).map((s) => {
            try {
              return JSON.parse(s.textContent || '{}');
            } catch {
              return null;
            }
          });
        });

        // Schema can be in @graph format or standalone
        let article = jsonLd.find((s) => s && s['@type'] === 'Article');

        // Check if it's in @graph format
        if (!article) {
          const graphSchema = jsonLd.find((s) => s && s['@graph']);
          if (graphSchema && Array.isArray(graphSchema['@graph'])) {
            article = graphSchema['@graph'].find(
              (item: { '@type'?: string }) => item && item['@type'] === 'Article'
            );
          }
        }

        expect(article).toBeTruthy();
        expect(article.headline).toBeTruthy();
        expect(article.author).toBeTruthy();
        expect(article.datePublished).toBeTruthy();
      });
    });

    test.describe('BreadcrumbList 스키마 (T017)', () => {
      test('가이드 페이지에 BreadcrumbList 스키마가 있다', async ({ page }) => {
        await page.goto('/guide/pyeong-sqm-guide');

        const jsonLd = await page.evaluate(() => {
          const scripts = document.querySelectorAll(
            'script[type="application/ld+json"]'
          );
          return Array.from(scripts).map((s) => {
            try {
              return JSON.parse(s.textContent || '{}');
            } catch {
              return null;
            }
          });
        });

        const breadcrumb = jsonLd.find(
          (s) => s && s['@type'] === 'BreadcrumbList'
        );
        expect(breadcrumb).toBeTruthy();
        expect(breadcrumb.itemListElement).toBeDefined();
        expect(breadcrumb.itemListElement.length).toBeGreaterThanOrEqual(2);
      });

      test('Breadcrumb에 올바른 계층 구조가 있다', async ({ page }) => {
        await page.goto('/guide/pyeong-sqm-guide');

        const jsonLd = await page.evaluate(() => {
          const scripts = document.querySelectorAll(
            'script[type="application/ld+json"]'
          );
          return Array.from(scripts).map((s) => {
            try {
              return JSON.parse(s.textContent || '{}');
            } catch {
              return null;
            }
          });
        });

        const breadcrumb = jsonLd.find(
          (s) => s && s['@type'] === 'BreadcrumbList'
        );
        const items = breadcrumb?.itemListElement || [];

        // Should have at least: Home > Guide > Article
        expect(items[0]?.position).toBe(1);
        expect(items[0]?.name).toBeTruthy();
      });
    });
  });
});
