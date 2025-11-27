import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { COMMON_SIZES } from './constants/conversion';

describe('App', () => {
  beforeEach(() => {
    // URL 초기화
    window.history.pushState({}, '', '/');
    localStorage.clear();
  });

  describe('컴포넌트 렌더링', () => {
    it('Calculator와 ReferenceTable을 모두 렌더링한다', () => {
      render(<App />);
      // Calculator
      expect(screen.getByText('평수 계산기')).toBeInTheDocument();
      // ReferenceTable
      expect(screen.getByText('일반적인 평형 참고')).toBeInTheDocument();
    });

    it('모든 타입 정보가 표시된다', () => {
      render(<App />);
      expect(screen.getByText('원룸')).toBeInTheDocument();
      expect(screen.getByText('투룸')).toBeInTheDocument();
      expect(screen.getByText('소형 아파트')).toBeInTheDocument();
      expect(screen.getByText('중소형 아파트')).toBeInTheDocument();
      expect(screen.getByText('중형 아파트')).toBeInTheDocument();
      expect(screen.getByText('중대형 아파트')).toBeInTheDocument();
      expect(screen.getByText('대형 아파트')).toBeInTheDocument();
    });
  });

  describe('Calculator ↔ ReferenceTable 통합', () => {
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

    it('모든 테이블 행 클릭이 Calculator를 업데이트한다', async () => {
      const user = userEvent.setup();

      for (let i = 0; i < COMMON_SIZES.length; i++) {
        const { unmount } = render(<App />);

        const table = screen.getByRole('table');
        const rows = table.querySelectorAll('tbody tr');
        await user.click(rows[i]);

        const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
        expect(pyeongInput.value).toBe(String(COMMON_SIZES[i].pyeong));

        unmount();
      }
    });

    it('테이블 선택 후 수동 입력하면 수동 입력값이 우선된다', async () => {
      const user = userEvent.setup();
      render(<App />);

      // 테이블에서 30평 선택
      const table = screen.getByRole('table');
      const rows = table.querySelectorAll('tbody tr');
      await user.click(rows[4]); // 30평

      // 수동으로 다른 값 입력
      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
      await user.clear(pyeongInput);
      await user.type(pyeongInput, '15');

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;
      expect(sqmInput.value).toBe('49.59');
    });
  });

  describe('사용자 시나리오', () => {
    it('시나리오: 사용자가 제곱미터를 입력하고 평수를 확인한다', async () => {
      const user = userEvent.setup();
      render(<App />);

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;
      await user.type(sqmInput, '85');

      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
      // 85 * 0.3025 = 25.7125 → 25.71
      expect(pyeongInput.value).toBe('25.71');
    });

    it('시나리오: 사용자가 빠른 선택 버튼으로 평수를 선택한다', async () => {
      const user = userEvent.setup();
      render(<App />);

      const button20 = screen.getByRole('button', { name: '20평' });
      await user.click(button20);

      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;

      expect(pyeongInput.value).toBe('20');
      expect(sqmInput.value).toBe('66.12');
    });

    it('시나리오: 사용자가 테이블에서 평형을 선택하고 초기화한다', async () => {
      const user = userEvent.setup();
      render(<App />);

      // 테이블에서 40평 선택
      const table = screen.getByRole('table');
      const rows = table.querySelectorAll('tbody tr');
      await user.click(rows[6]); // 40평

      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
      expect(pyeongInput.value).toBe('40');

      // 초기화
      const resetButton = screen.getByRole('button', { name: /초기화/ });
      await user.click(resetButton);

      expect(pyeongInput.value).toBe('');
    });

    it('시나리오: 연속으로 다른 평형을 선택한다', async () => {
      const user = userEvent.setup();
      render(<App />);

      const table = screen.getByRole('table');
      const rows = table.querySelectorAll('tbody tr');
      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;

      // 10평 선택
      await user.click(rows[0]);
      await waitFor(() => {
        expect(pyeongInput.value).toBe('10');
      });

      // 20평 선택
      await user.click(rows[2]);
      await waitFor(() => {
        expect(pyeongInput.value).toBe('20');
      });

      // 40평 선택
      await user.click(rows[6]);
      await waitFor(() => {
        expect(pyeongInput.value).toBe('40');
      });
    });
  });

  describe('양방향 변환 일관성', () => {
    it('제곱미터 → 평 → 제곱미터 변환이 일관된다', async () => {
      const user = userEvent.setup();
      render(<App />);

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;
      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;

      // 100㎡ 입력
      await user.type(sqmInput, '100');
      const pyeongValue = pyeongInput.value; // 30.25

      // 평 필드에서 다시 입력
      await user.clear(pyeongInput);
      await user.type(pyeongInput, pyeongValue);

      // 제곱미터가 100에 가까워야 함
      expect(parseFloat(sqmInput.value)).toBeCloseTo(100, 0);
    });
  });

  describe('레이아웃', () => {
    it('메인 컨테이너가 렌더링된다', () => {
      const { container } = render(<App />);
      const mainDiv = container.querySelector('.min-h-screen');
      expect(mainDiv).toBeInTheDocument();
    });

    it('그라데이션 배경이 적용된다', () => {
      const { container } = render(<App />);
      const mainDiv = container.querySelector('.bg-gradient-to-br');
      expect(mainDiv).toBeInTheDocument();
    });
  });

  describe('URL 공유', () => {
    it('URL에 pyeong 파라미터가 있으면 해당 값으로 초기화된다', async () => {
      window.history.pushState({}, '', '?pyeong=30');
      render(<App />);

      await waitFor(() => {
        const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
        expect(pyeongInput.value).toBe('30');
      });
    });

    it('빠른 선택 버튼 클릭 시 URL이 업데이트된다', async () => {
      const user = userEvent.setup();
      render(<App />);

      const button25 = screen.getByRole('button', { name: '25평' });
      await user.click(button25);

      expect(window.location.search).toBe('?pyeong=25');
    });

    it('참고표 클릭 시 URL이 업데이트된다', async () => {
      const user = userEvent.setup();
      render(<App />);

      const table = screen.getByRole('table');
      const rows = table.querySelectorAll('tbody tr');
      await user.click(rows[2]); // 20평

      expect(window.location.search).toBe('?pyeong=20');
    });
  });
});
