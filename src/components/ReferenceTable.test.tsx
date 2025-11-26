import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReferenceTable from './ReferenceTable';
import { COMMON_SIZES } from '../constants/conversion';

describe('ReferenceTable', () => {
  describe('참고표 렌더링', () => {
    it('7개의 평형 목록을 렌더링한다', () => {
      render(<ReferenceTable onSelect={() => {}} />);
      const rows = screen.getAllByRole('row');
      // 헤더 1개 + 데이터 7개 = 8개
      expect(rows.length).toBe(8);
    });

    it('각 항목에 평, 제곱미터, 타입을 표시한다', () => {
      render(<ReferenceTable onSelect={() => {}} />);
      expect(screen.getByText('10평')).toBeInTheDocument();
      expect(screen.getByText('33.06㎡')).toBeInTheDocument();
      expect(screen.getByText('원룸')).toBeInTheDocument();
    });

    it('테이블 제목을 렌더링한다', () => {
      render(<ReferenceTable onSelect={() => {}} />);
      expect(screen.getByText('일반적인 평형 참고')).toBeInTheDocument();
    });

    it('테이블 헤더를 렌더링한다', () => {
      render(<ReferenceTable onSelect={() => {}} />);
      expect(screen.getByText('평형')).toBeInTheDocument();
      expect(screen.getByText('면적')).toBeInTheDocument();
      expect(screen.getByText('타입')).toBeInTheDocument();
    });

    it('모든 COMMON_SIZES 항목을 렌더링한다', () => {
      render(<ReferenceTable onSelect={() => {}} />);
      COMMON_SIZES.forEach((item) => {
        expect(screen.getByText(item.label)).toBeInTheDocument();
        expect(screen.getByText(item.type)).toBeInTheDocument();
      });
    });
  });

  describe('참고표 클릭 동작', () => {
    it('항목 클릭 시 onSelect 콜백이 호출된다', async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();
      render(<ReferenceTable onSelect={handleSelect} />);

      const row25 = screen.getByText('25평').closest('tr')!;
      await user.click(row25);

      expect(handleSelect).toHaveBeenCalledWith(25);
    });

    it.each(COMMON_SIZES)('$label 클릭 시 onSelect($pyeong) 호출', async (item) => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();
      render(<ReferenceTable onSelect={handleSelect} />);

      const row = screen.getByText(item.label).closest('tr')!;
      await user.click(row);

      expect(handleSelect).toHaveBeenCalledWith(item.pyeong);
    });
  });

  describe('키보드 접근성', () => {
    it('행에 tabIndex가 설정되어 있다', () => {
      render(<ReferenceTable onSelect={() => {}} />);
      const row = screen.getByText('10평').closest('tr')!;
      expect(row).toHaveAttribute('tabIndex', '0');
    });

    it('Enter 키로 항목을 선택할 수 있다', () => {
      const handleSelect = vi.fn();
      render(<ReferenceTable onSelect={handleSelect} />);

      const row = screen.getByText('20평').closest('tr')!;
      fireEvent.keyDown(row, { key: 'Enter' });

      expect(handleSelect).toHaveBeenCalledWith(20);
    });

    it('Space 키로 항목을 선택할 수 있다', () => {
      const handleSelect = vi.fn();
      render(<ReferenceTable onSelect={handleSelect} />);

      const row = screen.getByText('30평').closest('tr')!;
      fireEvent.keyDown(row, { key: ' ' });

      expect(handleSelect).toHaveBeenCalledWith(30);
    });

    it('다른 키는 onSelect를 호출하지 않는다', () => {
      const handleSelect = vi.fn();
      render(<ReferenceTable onSelect={handleSelect} />);

      const row = screen.getByText('15평').closest('tr')!;
      fireEvent.keyDown(row, { key: 'a' });
      fireEvent.keyDown(row, { key: 'Tab' });
      fireEvent.keyDown(row, { key: 'Escape' });

      expect(handleSelect).not.toHaveBeenCalled();
    });
  });

  describe('스타일 및 hover', () => {
    it('행에 커서 포인터 스타일이 있다', () => {
      render(<ReferenceTable onSelect={() => {}} />);
      const row = screen.getByText('10평').closest('tr')!;
      expect(row).toHaveClass('cursor-pointer');
    });

    it('행에 hover 효과가 있다', () => {
      render(<ReferenceTable onSelect={() => {}} />);
      const row = screen.getByText('10평').closest('tr')!;
      expect(row).toHaveClass('hover:bg-blue-50');
    });

    it('행에 transition 효과가 있다', () => {
      render(<ReferenceTable onSelect={() => {}} />);
      const row = screen.getByText('10평').closest('tr')!;
      expect(row).toHaveClass('transition');
    });
  });
});
