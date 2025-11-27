import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import History from './History';
import { saveHistory } from '../utils/storage';

describe('History', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    mockOnSelect.mockClear();
  });

  describe('렌더링', () => {
    it('히스토리 제목을 표시한다', () => {
      render(<History onSelect={mockOnSelect} />);
      expect(screen.getByText('최근 변환 기록')).toBeInTheDocument();
    });

    it('히스토리가 없으면 빈 메시지를 표시한다', () => {
      render(<History onSelect={mockOnSelect} />);
      expect(screen.getByText('변환 기록이 없습니다')).toBeInTheDocument();
    });

    it('저장된 히스토리 항목을 표시한다', () => {
      saveHistory({ sqm: 33.06, pyeong: 10, timestamp: Date.now() });
      saveHistory({ sqm: 66.12, pyeong: 20, timestamp: Date.now() });

      render(<History onSelect={mockOnSelect} />);

      expect(screen.getByText('20평')).toBeInTheDocument();
      expect(screen.getByText('66.12㎡')).toBeInTheDocument();
      expect(screen.getByText('10평')).toBeInTheDocument();
      expect(screen.getByText('33.06㎡')).toBeInTheDocument();
    });
  });

  describe('상호작용', () => {
    it('히스토리 항목 클릭 시 onSelect가 호출된다', () => {
      saveHistory({ sqm: 33.06, pyeong: 10, timestamp: Date.now() });

      render(<History onSelect={mockOnSelect} />);

      const historyItem = screen.getByText('10평').closest('button');
      fireEvent.click(historyItem!);

      expect(mockOnSelect).toHaveBeenCalledWith(10);
    });

    it('전체 삭제 버튼 클릭 시 히스토리가 삭제된다', () => {
      saveHistory({ sqm: 33.06, pyeong: 10, timestamp: Date.now() });

      render(<History onSelect={mockOnSelect} />);

      const clearButton = screen.getByRole('button', { name: /삭제/i });
      fireEvent.click(clearButton);

      expect(screen.getByText('변환 기록이 없습니다')).toBeInTheDocument();
    });
  });

  describe('히스토리 업데이트', () => {
    it('historyVersion이 변경되면 히스토리를 다시 불러온다', () => {
      const { rerender } = render(<History onSelect={mockOnSelect} historyVersion={0} />);

      expect(screen.getByText('변환 기록이 없습니다')).toBeInTheDocument();

      saveHistory({ sqm: 33.06, pyeong: 10, timestamp: Date.now() });
      rerender(<History onSelect={mockOnSelect} historyVersion={1} />);

      expect(screen.getByText('10평')).toBeInTheDocument();
    });
  });
});
