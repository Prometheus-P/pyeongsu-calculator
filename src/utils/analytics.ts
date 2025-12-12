/**
 * Google Analytics 이벤트 트래킹 유틸리티
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean>;

/**
 * GA4 이벤트 전송
 */
export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

// 계산기 이벤트
export const CalculatorEvents = {
  /** 면적 변환 완료 */
  conversion: (sqm: number, pyeong: number) =>
    trackEvent('conversion', {
      sqm,
      pyeong,
      conversion_type: 'area',
    }),

  /** 빠른 선택 버튼 클릭 */
  quickSelect: (size: number) =>
    trackEvent('quick_select', {
      pyeong_size: size,
    }),

  /** 결과 복사 */
  copyResult: (sqm: number, pyeong: number) =>
    trackEvent('copy_result', {
      sqm,
      pyeong,
    }),

  /** 초기화 */
  clear: () => trackEvent('calculator_clear'),
};

// 히스토리 이벤트
export const HistoryEvents = {
  /** 히스토리 항목 선택 */
  selectItem: (pyeong: number) =>
    trackEvent('history_select', {
      pyeong_size: pyeong,
    }),

  /** 히스토리 전체 삭제 */
  clearAll: () => trackEvent('history_clear_all'),
};

// 테마 이벤트
export const ThemeEvents = {
  /** 테마 변경 */
  toggle: (theme: 'light' | 'dark') =>
    trackEvent('theme_toggle', {
      theme,
    }),
};
