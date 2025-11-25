import { useState, useEffect } from 'react';
import { convertSqmToPyeong, convertPyeongToSqm, formatNumber, isValidInput } from '../utils/converter';

interface CalculatorProps {
  initialPyeong?: number | null;
}

export default function Calculator({ initialPyeong }: CalculatorProps) {
  const [sqm, setSqm] = useState('');
  const [pyeong, setPyeong] = useState('');

  useEffect(() => {
    if (initialPyeong !== null && initialPyeong !== undefined) {
      setPyeong(String(initialPyeong));
      const converted = convertPyeongToSqm(initialPyeong);
      setSqm(formatNumber(converted));
    }
  }, [initialPyeong]);

  const handleSqmChange = (value: string) => {
    setSqm(value);
    if (isValidInput(value)) {
      const converted = convertSqmToPyeong(parseFloat(value));
      setPyeong(formatNumber(converted));
    } else {
      setPyeong('');
    }
  };

  const handlePyeongChange = (value: string) => {
    setPyeong(value);
    if (isValidInput(value)) {
      const converted = convertPyeongToSqm(parseFloat(value));
      setSqm(formatNumber(converted));
    } else {
      setSqm('');
    }
  };

  const handleReset = () => {
    setSqm('');
    setPyeong('');
  };

  const handleQuickSelect = (pyeongValue: number) => {
    setPyeong(String(pyeongValue));
    const converted = convertPyeongToSqm(pyeongValue);
    setSqm(formatNumber(converted));
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="평수 입력"
          />
        </div>
      </div>

      <button
        onClick={handleReset}
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
