import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from '../contexts/ThemeContext';
import { DynamicColorProvider } from '../contexts/DynamicColorContext';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <DynamicColorProvider>{ui}</DynamicColorProvider>
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('테마 토글 버튼을 렌더링한다', () => {
    renderWithProviders(<ThemeToggle />);

    expect(screen.getByRole('button', { name: /다크 모드로 전환|라이트 모드로 전환/i })).toBeInTheDocument();
  });

  it('라이트 모드에서 달 아이콘(SVG)을 표시한다', () => {
    renderWithProviders(<ThemeToggle />);

    const button = screen.getByRole('button', { name: '다크 모드로 전환' });
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', '다크 모드로 전환');
  });

  it('클릭 시 다크 모드로 전환된다', () => {
    renderWithProviders(<ThemeToggle />);

    const button = screen.getByRole('button', { name: '다크 모드로 전환' });
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-label', '라이트 모드로 전환');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('다시 클릭하면 라이트 모드로 복귀한다', () => {
    renderWithProviders(<ThemeToggle />);

    const button = screen.getByRole('button', { name: '다크 모드로 전환' });
    fireEvent.click(button); // dark
    fireEvent.click(button); // light

    expect(button).toHaveAttribute('aria-label', '다크 모드로 전환');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('색상 선택 버튼을 렌더링한다', () => {
    renderWithProviders(<ThemeToggle />);

    expect(screen.getByRole('button', { name: '테마 색상 변경' })).toBeInTheDocument();
  });
});
