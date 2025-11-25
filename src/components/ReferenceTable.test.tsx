import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReferenceTable from './ReferenceTable';

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
  });
});
