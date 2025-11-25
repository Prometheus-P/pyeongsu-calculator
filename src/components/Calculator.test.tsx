import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  describe('제곱미터 → 평 변환', () => {
    it('제곱미터 입력 시 평 필드가 자동 업데이트된다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/);
      await user.type(sqmInput, '33.06');

      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
      expect(pyeongInput.value).toBe('10.00');
    });
  });

  describe('평 → 제곱미터 변환', () => {
    it('평 입력 시 제곱미터 필드가 자동 업데이트된다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const pyeongInput = screen.getByLabelText(/평/);
      await user.type(pyeongInput, '10');

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;
      expect(sqmInput.value).toBe('33.06');
    });
  });

  describe('초기화 기능', () => {
    it('초기화 버튼 클릭 시 모든 필드가 비워진다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;
      await user.type(sqmInput, '33.06');

      const resetButton = screen.getByRole('button', { name: /초기화/ });
      await user.click(resetButton);

      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
      expect(sqmInput.value).toBe('');
      expect(pyeongInput.value).toBe('');
    });
  });

  describe('빠른 평형 버튼', () => {
    it('10, 15, 20, 25, 30, 35, 40평 버튼을 렌더링한다', () => {
      render(<Calculator />);
      [10, 15, 20, 25, 30, 35, 40].forEach((pyeong) => {
        expect(screen.getByRole('button', { name: `${pyeong}평` })).toBeInTheDocument();
      });
    });

    it('30평 버튼 클릭 시 필드가 업데이트된다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const button30 = screen.getByRole('button', { name: '30평' });
      await user.click(button30);

      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;

      expect(pyeongInput.value).toBe('30');
      expect(sqmInput.value).toBe('99.17');
    });
  });
});
