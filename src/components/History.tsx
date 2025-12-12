import { useState, useEffect, memo } from 'react';
import { getHistory, clearHistory as clearStorageHistory } from '../utils/storage';
import type { HistoryItem } from '../utils/storage';
import { HistoryEvents } from '../utils/analytics';

interface HistoryProps {
  onSelect: (pyeong: number) => void;
  historyVersion?: number;
}

export default memo(function History({ onSelect, historyVersion = 0 }: HistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, [historyVersion]);

  const handleClear = () => {
    clearStorageHistory();
    setHistory([]);
    HistoryEvents.clearAll();
  };

  const handleSelect = (pyeong: number) => {
    onSelect(pyeong);
    HistoryEvents.selectItem(pyeong);
  };

  // T014: M3 list item styling
  return (
    <div className="bg-m3-surface rounded-m3-md shadow-m3-1 p-m3-4 max-w-md w-full transition-colors">
      <div className="flex justify-between items-center mb-m3-3">
        <h2 className="text-title-medium text-m3-on-surface">최근 변환 기록</h2>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="text-label-medium text-m3-error hover:opacity-80 transition"
          >
            전체 삭제
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-body-medium text-m3-on-surface-variant text-center py-m3-4">변환 기록이 없습니다</p>
      ) : (
        <div className="space-y-m3-2">
          {history.map((item, index) => (
            <button
              key={`${item.pyeong}-${item.timestamp}-${index}`}
              onClick={() => handleSelect(item.pyeong)}
              className="w-full flex justify-between items-center p-m3-3 bg-m3-surface-variant hover:bg-m3-outline-variant rounded-m3-sm transition-colors"
            >
              <span className="text-label-large text-m3-primary">{item.pyeong}평</span>
              <span className="text-body-medium text-m3-on-surface-variant">{item.sqm}㎡</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
