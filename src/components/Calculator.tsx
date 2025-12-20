// Allow for custom element types in JSX
declare namespace JSX {
  interface IntrinsicElements {
    'md-outlined-text-field': any;
    'md-filled-tonal-button': any;
    'md-filled-button': any;
  }
}

import { useState, useRef } from 'react';
import {
  convertSqmToPyeong,
  convertPyeongToSqm,
  formatNumber,
  isValidInput,
  PROPRIETARY_INSIGHTS,
  type InsightKey,
} from '../utils/converter';
import SpaceVisualizer from './SpaceVisualizer';
import BudgetEstimator from './BudgetEstimator';

export default function Calculator() {
  const [sqm, setSqm] = useState('');
  const [pyeong, setPyeong] = useState('');
  const [insight, setInsight] = useState<
    (typeof PROPRIETARY_INSIGHTS)[InsightKey] | null
  >(null);

  const pyeongInputRef = useRef<HTMLInputElement>(null);

  const findInsight = (sqmValue: number) => {
    const targets = Object.keys(PROPRIETARY_INSIGHTS).map(Number);
    const closest = targets.reduce((prev, curr) =>
      Math.abs(curr - sqmValue) < Math.abs(prev - sqmValue) ? curr : prev
    );

    if (Math.abs(closest - sqmValue) <= closest * 0.15) {
      setInsight(PROPRIETARY_INSIGHTS[closest as InsightKey]);
    } else {
      setInsight(null);
    }
  };

  const updateFieldsFromSqm = (sqmValue: number) => {
    setSqm(String(sqmValue));
    setPyeong(formatNumber(convertSqmToPyeong(sqmValue)));
    findInsight(sqmValue);
  };

  const handleSqmChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setSqm(value);
    if (isValidInput(value)) {
      const num = parseFloat(value);
      setPyeong(formatNumber(convertSqmToPyeong(num)));
      findInsight(num);
    } else {
      setPyeong('');
      setInsight(null);
    }
  };

  const handlePyeongChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setPyeong(value);
    if (isValidInput(value)) {
      const num = parseFloat(value);
      const calculatedSqm = convertPyeongToSqm(num);
      setSqm(formatNumber(calculatedSqm));
      findInsight(calculatedSqm);
    } else {
      setSqm('');
      setInsight(null);
    }
  };

  const quickSizes = [59, 74, 84, 110];

  return (
    <div className="p-4 md:p-6 max-w-lg w-full flex flex-col gap-6">
      <div className="text-center">
        <h1 className="md-typescale-display-small">아파트 공간 시뮬레이터</h1>
        <p className="md-typescale-title-medium text-m3-on-surface-variant">
          "숫자가 아닌, 당신의 라이프스타일을 계산합니다"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <md-outlined-text-field
          label="전용면적 (㎡)"
          value={sqm}
          onInput={handleSqmChange}
          type="number"
          class="w-full"
        ></md-outlined-text-field>
        <md-outlined-text-field
          label="평수 (평)"
          value={pyeong}
          onInput={handlePyeongChange}
          type="number"
          class="w-full"
        ></md-outlined-text-field>
      </div>
      
      <div>
        <p className="md-typescale-title-small mb-2">주요 평형 바로보기</p>
        <div className="flex flex-wrap gap-2">
          {quickSizes.map((size) => (
            <md-filled-tonal-button
              key={size}
              onClick={() => updateFieldsFromSqm(size)}
            >
              {size}㎡
            </md-filled-tonal-button>
          ))}
        </div>
      </div>

      {insight && (
        <div className="flex flex-col p-4 rounded-xl bg-m3-surface-container-low">
          <h3 className="md-typescale-headline-small mb-1">{insight.label}</h3>
          <p className="md-typescale-title-medium text-m3-primary mb-3">"{insight.verdict}"</p>
          
          <div className="flex flex-col gap-2">
            <p className="md-typescale-body-medium">
              <span className="font-bold">장점:</span> {insight.pros}
            </p>
            <p className="md-typescale-body-medium">
              <span className="font-bold">주의:</span> {insight.cons}
            </p>
            <p className="md-typescale-label-small text-m3-on-surface-variant mt-2">
              {insight.benchmark}
            </p>
          </div>
        </div>
      )}

      {isValidInput(sqm) && <SpaceVisualizer sqm={parseFloat(sqm)} />}
      
      {insight && isValidInput(pyeong) && (
        <BudgetEstimator pyeong={parseFloat(pyeong)} insightLabel={insight.label} />
      )}
      
      <md-filled-button
        class="w-full"
        onClick={() => window.alert('Vertical Integration: 인테리어/이사 견적 파트너사 연결 예정')}
      >
        🔨 이 평수 인테리어 견적 미리보기
      </md-filled-button>
    </div>
  );
}
