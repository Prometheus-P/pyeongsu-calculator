import { useState, useEffect, memo } from 'react';
import { getHistory, clearHistory as clearStorageHistory, HistoryItem } from '../utils/storage';

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
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 max-w-md w-full transition-colors">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">최근 변환 기록</h2>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
          >
            전체 삭제
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">변환 기록이 없습니다</p>
      ) : (
        <div className="space-y-2">
          {history.map((item, index) => (
            <button
              key={`${item.pyeong}-${item.timestamp}-${index}`}
              onClick={() => onSelect(item.pyeong)}
              className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition"
            >
              <span className="font-medium text-blue-600 dark:text-blue-400">{item.pyeong}평</span>
              <span className="text-gray-600 dark:text-gray-300">{item.sqm}㎡</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
