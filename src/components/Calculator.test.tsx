import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Calculator from './Calculator';

describe('Calculator', () => {
  describe('기본 렌더링', () => {
    it('제목 "평수 계산기"를 렌더링한다', () => {
      render(<Calculator />);
      expect(screen.getByText('평수 계산기')).toBeInTheDocument();
    });

    it('제곱미터 입력 필드를 렌더링한다', () => {
      render(<Calculator />);
      expect(screen.getByLabelText(/제곱미터|㎡/)).toBeInTheDocument();
    });

    it('평 입력 필드를 렌더링한다', () => {
      render(<Calculator />);
      expect(screen.getByLabelText(/평/)).toBeInTheDocument();
    });
  });
});
