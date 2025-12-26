import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from './Calculator';
import { ReferralProvider } from '../contexts/ReferralContext';

const renderCalculator = () => {
  return render(
    <ReferralProvider>
      <Calculator />
    </ReferralProvider>
  );
};

describe('Space Simulator (Calculator)', () => {
  describe('Monopoly Features', () => {
    it('"평수 계산기" 제목과 서브타이틀을 렌더링한다', () => {
      renderCalculator();
      expect(screen.getByRole('heading', { name: '평수 계산기' })).toBeInTheDocument();
      expect(screen.getByText('제곱미터와 평, 쉽게 변환하세요')).toBeInTheDocument();
    });

    it('주요 평형(10, 15, 20, 25, 30, 35, 40평) 버튼을 렌더링한다', () => {
      renderCalculator();
      expect(screen.getByRole('button', { name: /10평/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /15평/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /20평/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /25평/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /30평/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /35평/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /40평/ })).toBeInTheDocument();
    });

    it('"이 공간, 어떻게 변신할 수 있을까요? (견적)" 라는 수직 통합 버튼을 렌더링한다', () => {
      renderCalculator();
      expect(screen.getByRole('button', { name: /견적/ })).toBeInTheDocument();
    });
  });

  describe('Core Functionality', () => {
    it('제곱미터 입력 시 평 필드가 자동 업데이트된다', async () => {
      const user = userEvent.setup();
      renderCalculator();

      const sqmInput = screen.getByPlaceholderText('84');
      await user.type(sqmInput, '84');

      const pyeongInput = screen.getByPlaceholderText('25.4') as HTMLInputElement;
      expect(pyeongInput.value).toBe('25.41');
    });

    it('평 입력 시 제곱미터 필드가 자동 업데이트된다', async () => {
      const user = userEvent.setup();
      renderCalculator();

      const pyeongInput = screen.getByPlaceholderText('25.4');
      await user.type(pyeongInput, '25.41');

      const sqmInput = screen.getByPlaceholderText('84') as HTMLInputElement;
      expect(sqmInput.value).toBe('84.00');
    });
  });

  describe('Insight and Visualization', () => {
    it('84㎡ 입력 시 "국민 평형" 인사이트 카드를 표시한다', async () => {
      const user = userEvent.setup();
      renderCalculator();

      const sqmInput = screen.getByPlaceholderText('84');
      await user.type(sqmInput, '84');

      expect(screen.getByText(/국민 평형/)).toBeInTheDocument();
      expect(screen.getByText(/매물이 많아 비교가 쉽고/)).toBeInTheDocument();
    });

    it('59㎡ 입력 시 "25평형" 인사이트 카드를 표시한다', async () => {
      const user = userEvent.setup();
      renderCalculator();

      const sqmInput = screen.getByPlaceholderText('84');
      await user.type(sqmInput, '59');

      expect(screen.getByText(/신혼부부와 1~2인 가구/)).toBeInTheDocument();
      expect(screen.getByText(/수납공간이 부족할 수 있고/)).toBeInTheDocument();
    });

    it('입력값이 없으면 인사이트 카드가 표시되지 않는다', () => {
      renderCalculator();
      expect(screen.queryByText(/국민 평형/)).not.toBeInTheDocument();
    });

    it('유효한 값을 입력하면 공간 시뮬레이터가 표시된다', async () => {
      const user = userEvent.setup();
      renderCalculator();

      expect(screen.queryByText('👁️ 공간 시뮬레이터')).not.toBeInTheDocument();

      const sqmInput = screen.getByPlaceholderText('84');
      await user.type(sqmInput, '84');

      expect(screen.getByText('👁️ 공간 시뮬레이터')).toBeInTheDocument();
    });
  });
});