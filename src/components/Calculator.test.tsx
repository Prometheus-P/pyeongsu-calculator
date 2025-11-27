import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from './Calculator';

describe('Calculator', () => {
  beforeEach(() => {
    localStorage.clear();
  });

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

    it('초기화 버튼을 렌더링한다', () => {
      render(<Calculator />);
      expect(screen.getByRole('button', { name: /초기화/ })).toBeInTheDocument();
    });

    it('빠른 선택 레이블을 렌더링한다', () => {
      render(<Calculator />);
      expect(screen.getByText('빠른 선택')).toBeInTheDocument();
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

    it('0 입력 시 0평으로 변환된다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/);
      await user.type(sqmInput, '0');

      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
      expect(pyeongInput.value).toBe('0.00');
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

    it('0 입력 시 0㎡로 변환된다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const pyeongInput = screen.getByLabelText(/평/);
      await user.type(pyeongInput, '0');

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;
      expect(sqmInput.value).toBe('0.00');
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

    it.each([
      [10, '33.06'],
      [15, '49.59'],
      [20, '66.12'],
      [25, '82.64'], // 25 * 3.3058 = 82.645 → 반올림 82.64
      [30, '99.17'],
      [35, '115.70'],
      [40, '132.23'],
    ])('%i평 버튼 클릭 시 %s㎡로 변환된다', async (pyeong, expectedSqm) => {
      const user = userEvent.setup();
      render(<Calculator />);

      const button = screen.getByRole('button', { name: `${pyeong}평` });
      await user.click(button);

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;
      expect(sqmInput.value).toBe(expectedSqm);
    });
  });

  describe('initialPyeong prop', () => {
    it('initialPyeong이 주어지면 해당 값으로 초기화된다', async () => {
      render(<Calculator initialPyeong={25} />);

      await waitFor(() => {
        const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
        const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;

        expect(pyeongInput.value).toBe('25');
        expect(sqmInput.value).toBe('82.64'); // 25 * 3.3058 = 82.645 → 반올림 82.64
      });
    });

    it('initialPyeong이 null이면 필드가 비어있다', () => {
      render(<Calculator initialPyeong={null} />);

      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;

      expect(pyeongInput.value).toBe('');
      expect(sqmInput.value).toBe('');
    });

    it('initialPyeong이 undefined면 필드가 비어있다', () => {
      render(<Calculator initialPyeong={undefined} />);

      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;

      expect(pyeongInput.value).toBe('');
      expect(sqmInput.value).toBe('');
    });
  });

  describe('잘못된 입력 처리', () => {
    it('유효하지 않은 입력 시 반대쪽 필드가 비워진다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;
      await user.type(sqmInput, '.');

      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
      expect(pyeongInput.value).toBe('');
    });

    it('빈 입력으로 변경 시 반대쪽 필드도 비워진다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;
      await user.type(sqmInput, '33');
      await user.clear(sqmInput);

      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;
      expect(pyeongInput.value).toBe('');
    });
  });

  describe('접근성', () => {
    it('입력 필드에 적절한 label이 연결되어 있다', () => {
      render(<Calculator />);

      const sqmInput = screen.getByLabelText(/제곱미터/);
      const pyeongInput = screen.getByLabelText(/평/);

      expect(sqmInput).toHaveAttribute('id', 'sqm');
      expect(pyeongInput).toHaveAttribute('id', 'pyeong');
    });

    it('입력 필드에 placeholder가 있다', () => {
      render(<Calculator />);

      expect(screen.getByPlaceholderText('제곱미터 입력')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('평수 입력')).toBeInTheDocument();
    });
  });

  describe('키보드 접근성', () => {
    it('제곱미터 필드에서 Enter 키 입력 시 평 필드로 포커스 이동', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/);
      const pyeongInput = screen.getByLabelText(/평/);

      await user.click(sqmInput);
      await user.keyboard('{Enter}');

      expect(pyeongInput).toHaveFocus();
    });

    it('평 필드에서 Enter 키 입력 시 포커스가 유지된다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const pyeongInput = screen.getByLabelText(/평/);

      await user.click(pyeongInput);
      await user.keyboard('{Enter}');

      expect(pyeongInput).toHaveFocus();
    });

    it('Escape 키 입력 시 모든 필드가 초기화된다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;
      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;

      await user.type(sqmInput, '33.06');
      expect(pyeongInput.value).toBe('10.00');

      await user.keyboard('{Escape}');

      expect(sqmInput.value).toBe('');
      expect(pyeongInput.value).toBe('');
    });

    it('평 필드에서 Escape 키 입력 시에도 초기화된다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/) as HTMLInputElement;
      const pyeongInput = screen.getByLabelText(/평/) as HTMLInputElement;

      await user.type(pyeongInput, '10');
      expect(sqmInput.value).toBe('33.06');

      await user.keyboard('{Escape}');

      expect(sqmInput.value).toBe('');
      expect(pyeongInput.value).toBe('');
    });
  });

  describe('클립보드 복사', () => {
    it('복사 버튼을 렌더링한다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const sqmInput = screen.getByLabelText(/제곱미터|㎡/);
      await user.type(sqmInput, '33.06');

      expect(screen.getByRole('button', { name: /복사/i })).toBeInTheDocument();
    });

    it('값이 없으면 복사 버튼이 표시되지 않는다', () => {
      render(<Calculator />);

      expect(screen.queryByRole('button', { name: /복사/i })).not.toBeInTheDocument();
    });

    it('복사 버튼 클릭 시 클립보드에 값이 복사된다', async () => {
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');
      const user = userEvent.setup();
      render(<Calculator />);

      const pyeongInput = screen.getByLabelText(/평/);
      await user.type(pyeongInput, '10');

      const copyButton = screen.getByRole('button', { name: /복사/i });
      await user.click(copyButton);

      expect(writeTextSpy).toHaveBeenCalled();
      writeTextSpy.mockRestore();
    });

    it('복사 완료 시 토스트 메시지가 표시된다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const pyeongInput = screen.getByLabelText(/평/);
      await user.type(pyeongInput, '10');

      const copyButton = screen.getByRole('button', { name: /복사/i });
      await user.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText(/복사되었습니다/i)).toBeInTheDocument();
      });
    });

    it('토스트 메시지가 일정 시간 후 사라진다', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Calculator />);

      const pyeongInput = screen.getByLabelText(/평/);
      await user.type(pyeongInput, '10');

      const copyButton = screen.getByRole('button', { name: /복사/i });
      await user.click(copyButton);

      expect(screen.getByText(/복사되었습니다/i)).toBeInTheDocument();

      await vi.advanceTimersByTimeAsync(2100);

      expect(screen.queryByText(/복사되었습니다/i)).not.toBeInTheDocument();

      vi.useRealTimers();
    });
  });
});
