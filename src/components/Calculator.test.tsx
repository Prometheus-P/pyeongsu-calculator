import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from './Calculator';

describe('Space Simulator (Calculator)', () => {
  describe('Monopoly Features', () => {
    it('"아파트 공간 시뮬레이터" 라는 독점적 제목을 렌더링한다', () => {
      render(<Calculator />);
      expect(screen.getByRole('heading', { name: '아파트 공간 시뮬레이터' })).toBeInTheDocument();
      expect(screen.getByText('"평수 뒤에 숨은, 당신의 삶의 질을 계산합니다"')).toBeInTheDocument();
    });

    it('주요 평형(59, 74, 84, 110㎡) 버튼을 렌더링한다', () => {
      render(<Calculator />);
      expect(screen.getByRole('button', { name: /59/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /74/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /84/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /110/ })).toBeInTheDocument();
    });

    it('"이 공간, 어떻게 변신할 수 있을까요? (견적)" 라는 수직 통합 버튼을 렌더링한다', () => {
      render(<Calculator />);
      expect(screen.getByRole('button', { name: /견적/ })).toBeInTheDocument();
    });
  });

  describe('Core Functionality', () => {
    it('제곱미터 입력 시 평 필드가 자동 업데이트된다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const sqmInput = screen.getByPlaceholderText('84');
      await user.type(sqmInput, '84');

      const pyeongInput = screen.getByPlaceholderText('25.4') as HTMLInputElement;
      expect(pyeongInput.value).toBe('25.41');
    });

    it('평 입력 시 제곱미터 필드가 자동 업데이트된다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const pyeongInput = screen.getByPlaceholderText('25.4');
      await user.type(pyeongInput, '25.41');

      const sqmInput = screen.getByPlaceholderText('84') as HTMLInputElement;
      expect(sqmInput.value).toBe('84.00');
    });
  });

  describe('Insight and Visualization', () => {
    it('84㎡ 입력 시 "국민 평형" 인사이트 카드를 표시한다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const sqmInput = screen.getByPlaceholderText('84');
      await user.type(sqmInput, '84');

      expect(screen.getByText(/시장을 지배하는 국민 평형/)).toBeInTheDocument();
      expect(screen.getByText(/높은 환금성/)).toBeInTheDocument();
    });

    it('59㎡ 입력 시 "신혼부부 국민 평형" 인사이트 카드를 표시한다', async () => {
        const user = userEvent.setup();
        render(<Calculator />);

        const sqmInput = screen.getByPlaceholderText('84');
        await user.type(sqmInput, '59');

        expect(screen.getByText(/신혼부부 국민 평형/)).toBeInTheDocument();
        expect(screen.getByText(/공간 확장이 필요/)).toBeInTheDocument();
      });

    it('입력값이 없으면 인사이트 카드가 표시되지 않는다', () => {
      render(<Calculator />);
      expect(screen.queryByText(/시장을 지배하는 국민 평형/)).not.toBeInTheDocument();
    });

    it('유효한 값을 입력하면 공간 시뮬레이터가 표시된다', async () => {
      const user = userEvent.setup();
      render(<Calculator />);
      
      expect(screen.queryByText('👁️ 공간 시뮬레이터')).not.toBeInTheDocument();

      const sqmInput = screen.getByPlaceholderText('84');
      await user.type(sqmInput, '84');

      expect(screen.getByText('👁️ 공간 시뮬레이터')).toBeInTheDocument();
    });
  });
});