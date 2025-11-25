import { useState } from 'react';
import { convertSqmToPyeong, formatNumber, isValidInput } from '../utils/converter';

export default function Calculator() {
  const [sqm, setSqm] = useState('');
  const [pyeong, setPyeong] = useState('');

  const handleSqmChange = (value: string) => {
    setSqm(value);
    if (isValidInput(value)) {
      const converted = convertSqmToPyeong(parseFloat(value));
      setPyeong(formatNumber(converted));
    } else {
      setPyeong('');
    }
  };

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
        <input id="pyeong" type="text" value={pyeong} readOnly />
      </div>
    </div>
  );
}
