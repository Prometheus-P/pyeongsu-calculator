import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

// 테스트용 컴포넌트
function TestComponent() {
  const { theme, toggleTheme, isDark } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="isDark">{isDark ? 'dark' : 'light'}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  describe('기본 동작', () => {
    it('기본 테마는 light이다', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('isDark')).toHaveTextContent('light');
    });

    it('toggleTheme으로 테마를 전환할 수 있다', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByRole('button', { name: 'Toggle' });
      fireEvent.click(toggleButton);

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('isDark')).toHaveTextContent('dark');
    });

    it('다크 모드 시 html에 dark 클래스가 추가된다', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByRole('button', { name: 'Toggle' });
      fireEvent.click(toggleButton);

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('라이트 모드 시 html에서 dark 클래스가 제거된다', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByRole('button', { name: 'Toggle' });
      fireEvent.click(toggleButton); // dark
      fireEvent.click(toggleButton); // light

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('localStorage 저장', () => {
    it('테마 변경 시 localStorage에 저장된다', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByRole('button', { name: 'Toggle' });
      fireEvent.click(toggleButton);

      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('저장된 테마가 있으면 해당 테마로 초기화된다', () => {
      localStorage.setItem('theme', 'dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });

  describe('시스템 설정 감지', () => {
    it('저장된 테마가 없고 시스템이 다크 모드면 다크로 초기화', () => {
      // matchMedia mock
      const mockMatchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      window.matchMedia = mockMatchMedia;

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });
});
