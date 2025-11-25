import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  describe('통합', () => {
    it('Calculator와 ReferenceTable을 모두 렌더링한다', () => {
      render(<App />);
      // Calculator
      expect(screen.getByText('평수 계산기')).toBeInTheDocument();
      // ReferenceTable
      expect(screen.getByText('원룸')).toBeInTheDocument();
    });

    it('ReferenceTable 항목 클릭 시 Calculator 필드가 업데이트된다', async () => {
      const user = userEvent.setup();
      render(<App />);

      // 테이블 내의 25평 항목 선택 (버튼과 구별)
      const table = screen.getByRole('table');
      const cells = table.querySelectorAll('tbody tr');
      // 25평은 4번째 행 (10, 15, 20, 25)
      await user.click(cells[3]);

      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;

      expect(pyeongInput.value).toBe('25');
      expect(sqmInput.value).toBe('82.64');
    });
  });
});
