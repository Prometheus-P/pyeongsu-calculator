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
    <div>
      <h1>평수 계산기</h1>
      <div>
        <label htmlFor="sqm">제곱미터 (㎡)</label>
        <input
          id="sqm"
          type="text"
          value={sqm}
          onChange={(e) => handleSqmChange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="pyeong">평</label>
        <input
          id="pyeong"
          type="text"
          value={pyeong}
          onChange={(e) => handlePyeongChange(e.target.value)}
        />
      </div>
      <button onClick={handleReset}>초기화</button>
      <div>
        {quickSizes.map((size) => (
          <button key={size} onClick={() => handleQuickSelect(size)}>
            {size}평
          </button>
        ))}
      </div>
    </div>
  );
}
