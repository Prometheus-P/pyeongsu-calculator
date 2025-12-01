// Vitest 테스트 환경 설정
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// localStorage Mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// matchMedia Mock (다크 모드 테스트용)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// React Testing Library 설정
configure({
  // 비동기 쿼리 타임아웃 설정 (Flaky 테스트 방지)
  asyncUtilTimeout: 5000,
});

// 각 테스트 후 자동 클린업
afterEach(() => {
  cleanup();
});

// 콘솔 에러/경고 억제 (act() 경고 등)
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // act() 관련 경고 무시
    if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) {
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = (...args: unknown[]) => {
    // React 18 관련 경고 무시
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('ReactDOM.render') || args[0].includes('act('))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// 타이머 모킹 유틸리티
export const advanceTimers = async (ms: number) => {
  vi.advanceTimersByTime(ms);
  await Promise.resolve();
};
