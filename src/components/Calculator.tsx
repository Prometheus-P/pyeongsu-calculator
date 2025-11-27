import { useState, useEffect, useCallback } from 'react';
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
}

export default function Calculator({ initialPyeong, onHistoryUpdate }: CalculatorProps) {
  const [sqm, setSqm] = useState('');
  const [pyeong, setPyeong] = useState('');

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

  // 입력 완료 시 히스토리 저장
  const handleInputBlur = () => {
    if (isValidInput(sqm) && isValidInput(pyeong)) {
      addToHistory(parseFloat(sqm), parseFloat(pyeong));
    }
  };

  // 빠른 선택 시 히스토리 저장
  const handleQuickSelect = (size: number) => {
    updateFieldsFromPyeong(size);
    addToHistory(convertPyeongToSqm(size), size);
  };

  const quickSizes = [10, 15, 20, 25, 30, 35, 40];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">평수 계산기</h1>

      <div className="space-y-4">
        <div>
          <label htmlFor="sqm" className="block text-sm font-medium text-gray-700 mb-1">
            제곱미터 (㎡)
          </label>
          <input
            id="sqm"
            type="text"
            value={sqm}
            onChange={(e) => handleSqmChange(e.target.value)}
            onBlur={handleInputBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="제곱미터 입력"
          />
        </div>

        <div>
          <label htmlFor="pyeong" className="block text-sm font-medium text-gray-700 mb-1">
            평
          </label>
          <input
            id="pyeong"
            type="text"
            value={pyeong}
            onChange={(e) => handlePyeongChange(e.target.value)}
            onBlur={handleInputBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="평수 입력"
          />
        </div>
      </div>

      <button
        onClick={clearFields}
        className="w-full mt-4 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
      >
        초기화
      </button>

      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-2">빠른 선택</p>
        <div className="grid grid-cols-4 gap-2">
          {quickSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleQuickSelect(size)}
              className="py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition"
            >
              {size}평
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
