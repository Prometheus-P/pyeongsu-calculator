import { useState, useEffect, useCallback, useRef, KeyboardEvent } from 'react';
import {
  convertSqmToPyeong,
  convertPyeongToSqm,
  formatNumber,
  isValidInput,
} from '../utils/converter';
import { saveHistory } from '../utils/storage';

interface CalculatorProps {
  initialPyeong?: number | null;
  onHistoryUpdate?: () => void;
  onValueChange?: (pyeong: number | null) => void;
}

export default function Calculator({ initialPyeong, onHistoryUpdate, onValueChange }: CalculatorProps) {
  const [sqm, setSqm] = useState('');
  const [pyeong, setPyeong] = useState('');
  const [showToast, setShowToast] = useState(false);
  const pyeongInputRef = useRef<HTMLInputElement>(null);

  // 히스토리 저장 함수
  const addToHistory = useCallback(
    (sqmValue: number, pyeongValue: number) => {
      saveHistory({
        sqm: parseFloat(formatNumber(sqmValue)),
        pyeong: parseFloat(formatNumber(pyeongValue)),
        timestamp: Date.now(),
      });
      onHistoryUpdate?.();
    },
    [onHistoryUpdate]
  );

  // 헬퍼: 평 값으로 양쪽 필드 업데이트
  const updateFieldsFromPyeong = (pyeongValue: number) => {
    setPyeong(String(pyeongValue));
    setSqm(formatNumber(convertPyeongToSqm(pyeongValue)));
  };

  // 헬퍼: 필드 초기화
  const clearFields = () => {
    setSqm('');
    setPyeong('');
  };

  useEffect(() => {
    if (initialPyeong === null || initialPyeong === undefined) {
      clearFields();
      return;
    }
    updateFieldsFromPyeong(initialPyeong);
  }, [initialPyeong]);

  const handleSqmChange = (value: string) => {
    setSqm(value);
    if (isValidInput(value)) {
      setPyeong(formatNumber(convertSqmToPyeong(parseFloat(value))));
    } else {
      setPyeong('');
    }
  };

  const handlePyeongChange = (value: string) => {
    setPyeong(value);
    if (isValidInput(value)) {
      setSqm(formatNumber(convertPyeongToSqm(parseFloat(value))));
    } else {
      setSqm('');
    }
  };

  // 입력 완료 시 히스토리 저장 및 URL 업데이트
  const handleInputBlur = () => {
    if (isValidInput(sqm) && isValidInput(pyeong)) {
      const pyeongValue = parseFloat(pyeong);
      addToHistory(parseFloat(sqm), pyeongValue);
      onValueChange?.(pyeongValue);
    }
  };

  // 빠른 선택 시 히스토리 저장 및 URL 업데이트
  const handleQuickSelect = (size: number) => {
    updateFieldsFromPyeong(size);
    addToHistory(convertPyeongToSqm(size), size);
    onValueChange?.(size);
  };

  // 클립보드 복사
  const handleCopy = async () => {
    const text = `${sqm}㎡ = ${pyeong}평`;
    await navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, field: 'sqm' | 'pyeong') => {
    if (e.key === 'Escape') {
      clearFields();
    } else if (e.key === 'Enter' && field === 'sqm') {
      pyeongInputRef.current?.focus();
    }
  };

  const hasValue = isValidInput(sqm) && isValidInput(pyeong);
  const quickSizes = [10, 15, 20, 25, 30, 35, 40];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full transition-colors">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">평수 계산기</h1>

      <div className="space-y-4">
        <div>
          <label htmlFor="sqm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            제곱미터 (㎡)
          </label>
          <input
            id="sqm"
            type="text"
            value={sqm}
            onChange={(e) => handleSqmChange(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={(e) => handleKeyDown(e, 'sqm')}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="제곱미터 입력"
          />
        </div>

        <div>
          <label htmlFor="pyeong" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            평
          </label>
          <input
            ref={pyeongInputRef}
            id="pyeong"
            type="text"
            value={pyeong}
            onChange={(e) => handlePyeongChange(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={(e) => handleKeyDown(e, 'pyeong')}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="평수 입력"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={clearFields}
          className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition"
        >
          초기화
        </button>
        {hasValue && (
          <button
            onClick={handleCopy}
            className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
          >
            복사
          </button>
        )}
      </div>

      {showToast && (
        <div className="mt-2 p-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm text-center rounded-lg">
          복사되었습니다!
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">빠른 선택</p>
        <div className="grid grid-cols-4 gap-2">
          {quickSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleQuickSelect(size)}
              className="py-2 px-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition"
            >
              {size}평
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
