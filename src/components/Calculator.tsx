import { useState, useEffect, useCallback, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import {
  convertSqmToPyeong,
  convertPyeongToSqm,
  formatNumber,
  isValidInput,
} from '../utils/converter';
import { CalculatorEvents } from '../utils/analytics';
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
      const sqmValue = parseFloat(sqm);
      const pyeongValue = parseFloat(pyeong);
      addToHistory(sqmValue, pyeongValue);
      onValueChange?.(pyeongValue);
      CalculatorEvents.conversion(sqmValue, pyeongValue);
    }
  };

  // 빠른 선택 시 히스토리 저장 및 URL 업데이트
  const handleQuickSelect = (size: number) => {
    updateFieldsFromPyeong(size);
    addToHistory(convertPyeongToSqm(size), size);
    onValueChange?.(size);
    CalculatorEvents.quickSelect(size);
  };

  // 클립보드 복사
  const handleCopy = async () => {
    const text = `${sqm}㎡ = ${pyeong}평`;
    await navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    CalculatorEvents.copyResult(parseFloat(sqm), parseFloat(pyeong));
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
    // Kinetic Minimalism Style
    <div className="dark bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-[4px_8px_16px_rgba(0,0,0,0.2)] p-6 max-w-md w-full">
      <h1 className="text-2xl font-bold text-gray-100 text-center mb-6 tracking-tight">평수 계산기</h1>

      <div className="space-y-4">
        <div>
          <label htmlFor="sqm" className="block text-sm font-medium text-gray-400 mb-1">
            제곱미터 (㎡)
          </label>
          <input
            id="sqm"
            type="text"
            value={sqm}
            onChange={(e) => handleSqmChange(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={(e) => handleKeyDown(e, 'sqm')}
            className="w-full p-4 bg-gray-900 text-gray-100 border-2 border-gray-600 rounded-md focus:border-cyan-400 focus:ring-0 transition-colors placeholder-gray-500 min-h-[48px]"
            placeholder="제곱미터 입력"
          />
        </div>

        <div>
          <label htmlFor="pyeong" className="block text-sm font-medium text-gray-400 mb-1">
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
            className="w-full p-4 bg-gray-900 text-gray-100 border-2 border-gray-600 rounded-md focus:border-cyan-400 focus:ring-0 transition-colors placeholder-gray-500 min-h-[48px]"
            placeholder="평수 입력"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={clearFields}
          className="flex-1 py-3 px-4 min-h-[48px] bg-gray-600 text-gray-100 font-semibold rounded-md hover:bg-gray-500 transition-colors"
        >
          초기화
        </button>
        {hasValue && (
          // Kinetic element: skewed button
          <button
            onClick={handleCopy}
            className="py-3 px-4 min-h-[48px] bg-cyan-500 text-black font-bold rounded-md hover:bg-cyan-400 transition-colors transform -skew-x-12"
          >
            <span className="inline-block transform skew-x-12">복사</span>
          </button>
        )}
      </div>

      {showToast && (
        <div className="mt-2 p-2 bg-cyan-500 text-black text-sm text-center rounded-md">
          복사되었습니다!
        </div>
      )}

      <div className="mt-6">
        <p className="text-base text-gray-400 mb-2">빠른 선택</p>
        <div className="grid grid-cols-4 gap-2">
          {quickSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleQuickSelect(size)}
              className="py-2 px-3 min-h-[48px] bg-gray-700 text-gray-200 rounded-md hover:bg-cyan-500 hover:text-black transition-colors"
            >
              {size}평
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
