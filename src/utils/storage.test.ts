import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveHistory, getHistory, clearHistory } from './storage';
import type { HistoryItem } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('saveHistory', () => {
    it('히스토리 항목을 저장한다', () => {
      const item: HistoryItem = { sqm: 33.06, pyeong: 10, timestamp: Date.now() };
      saveHistory(item);

      const history = getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].sqm).toBe(33.06);
      expect(history[0].pyeong).toBe(10);
    });

    it('새 항목이 맨 앞에 추가된다', () => {
      const item1: HistoryItem = { sqm: 33.06, pyeong: 10, timestamp: Date.now() };
      const item2: HistoryItem = { sqm: 66.12, pyeong: 20, timestamp: Date.now() + 1000 };

      saveHistory(item1);
      saveHistory(item2);

      const history = getHistory();
      expect(history).toHaveLength(2);
      expect(history[0].pyeong).toBe(20);
      expect(history[1].pyeong).toBe(10);
    });

    it('최대 10개까지만 저장한다', () => {
      for (let i = 1; i <= 15; i++) {
        saveHistory({ sqm: i * 3.306, pyeong: i, timestamp: Date.now() + i });
      }

      const history = getHistory();
      expect(history).toHaveLength(10);
      expect(history[0].pyeong).toBe(15);
      expect(history[9].pyeong).toBe(6);
    });

    it('중복된 값은 저장하지 않고 순서만 업데이트한다', () => {
      const item1: HistoryItem = { sqm: 33.06, pyeong: 10, timestamp: Date.now() };
      const item2: HistoryItem = { sqm: 66.12, pyeong: 20, timestamp: Date.now() + 1000 };
      const item3: HistoryItem = { sqm: 33.06, pyeong: 10, timestamp: Date.now() + 2000 };

      saveHistory(item1);
      saveHistory(item2);
      saveHistory(item3);

      const history = getHistory();
      expect(history).toHaveLength(2);
      expect(history[0].pyeong).toBe(10);
      expect(history[1].pyeong).toBe(20);
    });
  });

  describe('getHistory', () => {
    it('빈 히스토리를 반환한다', () => {
      const history = getHistory();
      expect(history).toEqual([]);
    });

    it('저장된 히스토리를 반환한다', () => {
      const item: HistoryItem = { sqm: 33.06, pyeong: 10, timestamp: Date.now() };
      saveHistory(item);

      const history = getHistory();
      expect(history).toHaveLength(1);
    });

    it('손상된 데이터는 빈 배열을 반환한다', () => {
      localStorage.setItem('pyeong-calculator-history', 'invalid-json');

      const history = getHistory();
      expect(history).toEqual([]);
    });
  });

  describe('clearHistory', () => {
    it('모든 히스토리를 삭제한다', () => {
      saveHistory({ sqm: 33.06, pyeong: 10, timestamp: Date.now() });
      saveHistory({ sqm: 66.12, pyeong: 20, timestamp: Date.now() });

      clearHistory();

      const history = getHistory();
      expect(history).toEqual([]);
    });
  });
});
