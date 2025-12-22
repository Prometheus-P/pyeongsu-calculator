import { useState, useRef } from 'react';

import {
  convertSqmToPyeong,
  convertPyeongToSqm,
  formatNumber,
  isValidInput,
  PROPRIETARY_INSIGHTS,
  type InsightKey
} from '../utils/converter';
import { CalculatorEvents } from '../utils/analytics';
import { useLeadForm } from '../hooks/useLeadForm';
import SpaceVisualizer from './SpaceVisualizer'; // Visual Moat Import
import BudgetEstimator from './BudgetEstimator'; // Cashflow Protocol Import


export default function Calculator() {
  const [sqm, setSqm] = useState('');
  const [pyeong, setPyeong] = useState('');
  const [insight, setInsight] = useState<typeof PROPRIETARY_INSIGHTS[InsightKey] | null>(null);
  
  const pyeongInputRef = useRef<HTMLInputElement>(null);
  const { openForm } = useLeadForm();

  // Insight Finder: 입력값과 가장 가까운 독점 데이터 매칭 (오차 범위 ±5%)
  const findInsight = (sqmValue: number) => {
    const targets = Object.keys(PROPRIETARY_INSIGHTS).map(Number);
    // 가장 가까운 평형대 찾기
    const closest = targets.reduce((prev, curr) => 
      Math.abs(curr - sqmValue) < Math.abs(prev - sqmValue) ? curr : prev
    );

    // 오차 범위 10% 이내일 때만 인사이트 표시 (너무 동떨어진 값 방지)
    if (Math.abs(closest - sqmValue) <= closest * 0.15) {
      setInsight(PROPRIETARY_INSIGHTS[closest as InsightKey]);
    } else {
      setInsight(null);
    }
  };

  const handleSqmChange = (value: string) => {
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

  const handlePyeongChange = (value: string) => {
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

  // 빠른 선택 버튼 (주요 아파트 평형)
  const quickSizes = [10, 15, 20, 25, 30, 35, 40];

  const handleReset = () => {
    setSqm('');
    setPyeong('');
    setInsight(null);
    CalculatorEvents.clear();
  };

  const updateFieldsFromPyeong = (pyeongValue: number) => {
    setPyeong(String(pyeongValue));
    const sqmValue = convertPyeongToSqm(pyeongValue);
    setSqm(formatNumber(sqmValue));
    findInsight(sqmValue);
    CalculatorEvents.quickSelect(pyeongValue);
  };

  return (
    <div className="bg-m3-surface text-m3-on-surface rounded-m3-lg shadow-m3-1 p-m3-6 max-w-md w-full">
      {/* 1. M3 Title */}
      <div className="text-center mb-m3-6">
        <h1 className="text-headline-small text-m3-on-surface tracking-tight mb-m3-1">
          평수 계산기
        </h1>
        <p className="text-title-medium text-m3-primary">
          "평수 뒤에 숨은, 당신의 삶의 질을 계산합니다"
        </p>
      </div>

      {/* 2. M3 Input Fields */}
      <div className="grid grid-cols-2 gap-m3-4 mb-m3-6">
        <div className="space-y-m3-2">
          <label htmlFor="sqm-input" className="text-label-large text-m3-on-surface-variant px-m3-1">제곱미터 (㎡)</label>
          <input
            id="sqm-input"
            type="text"
            value={sqm}
            onChange={(e) => handleSqmChange(e.target.value)}
            className="w-full bg-m3-surface text-m3-on-surface text-title-large font-bold p-m3-4 rounded-m3-sm border border-m3-outline focus:border-m3-primary focus:ring-2 focus:ring-m3-primary/30 outline-none transition-all text-center"
            placeholder="84"
          />
        </div>
        <div className="space-y-m3-2">
          <label htmlFor="pyeong-input" className="text-label-large text-m3-on-surface-variant px-m3-1">평</label>
          <input
            id="pyeong-input"
            ref={pyeongInputRef}
            type="text"
            value={pyeong}
            onChange={(e) => handlePyeongChange(e.target.value)}
            className="w-full bg-m3-surface text-m3-on-surface text-title-large font-bold p-m3-4 rounded-m3-sm border border-m3-outline focus:border-m3-primary focus:ring-2 focus:ring-m3-primary/30 outline-none transition-all text-center"
            placeholder="25.4"
          />
        </div>
      </div>

      {/* 3. M3 Insight Card */}
      {insight && (
        <div className="mb-m3-6 bg-m3-secondary-container text-m3-on-secondary-container border-l-4 border-m3-secondary p-m3-4 rounded-m3-md shadow-m3-1 animate-fade-in">
          <h3 className="text-title-large mb-m3-1">{insight.label}</h3>
          <p className="text-m3-secondary font-bold text-body-large mb-m3-3">"{insight.verdict}"</p>
          
          <div className="space-y-m3-2 text-body-medium">
            <div className="flex gap-m3-2">
              <span className="text-green-400 dark:text-green-300 font-bold min-w-[30px]">장점</span>
              <span className="text-m3-on-secondary-container/90">{insight.pros}</span>
            </div>
            <div className="flex gap-m3-2">
              <span className="text-red-400 dark:text-red-300 font-bold min-w-[30px]">주의</span>
              <span className="text-m3-on-secondary-container/90">{insight.cons}</span>
            </div>
            <div className="mt-m3-2 pt-m3-2 border-t border-m3-outline-variant/50 text-label-medium text-m3-on-secondary-container/70 flex justify-between">
              <span>시장 기준</span>
              <span>{insight.benchmark}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Visual Moat: 공간 시뮬레이터 */}
      {isValidInput(sqm) && <SpaceVisualizer sqm={parseFloat(sqm)} />}

      {/* 💰 Cashflow Protocol: The Venom */}
      {insight && isValidInput(pyeong) && (
        <BudgetEstimator pyeong={parseFloat(pyeong)} insightLabel={insight.label} />
      )}

      {/* 5. M3 Quick Select & Reset */}
      <div className="mt-m3-8">
        <div className="flex justify-between items-center mb-m3-2 px-m3-1">
          <p className="text-label-medium text-m3-on-surface-variant">주요 평형 바로보기</p>
          <button
            onClick={handleReset}
            className="text-label-medium text-m3-error hover:text-m3-on-error-container m3-state-layer px-m3-2 py-m3-1 rounded-m3-sm transition-all"
          >
            초기화
          </button>
        </div>
        <div className="grid grid-cols-4 gap-m3-2 mb-m3-6">
          {quickSizes.map((size) => (
            <button
              key={size}
              onClick={() => updateFieldsFromPyeong(size)}
              className={`py-m3-2 px-m3-1 text-label-large font-bold rounded-m3-full transition-all m3-state-layer ${
                Math.abs(parseFloat(pyeong) - size) < 1
                  ? 'bg-m3-primary text-m3-on-primary shadow-m3-2'
                  : 'bg-m3-secondary-container text-m3-on-secondary-container hover:shadow-m3-1'
              }`}
            >
              {size}평
            </button>
          ))}
        </div>

        {/* M3 Vertical Integration Button */}
        <button
          onClick={() => openForm('INTERIOR_QUOTE', {
            pyeong: parseFloat(pyeong) || undefined,
            sqm: parseFloat(sqm) || undefined,
            insightLabel: insight?.label,
          })}
          className="w-full py-m3-3 bg-m3-tertiary-container text-m3-on-tertiary-container font-bold rounded-m3-full text-label-large m3-state-layer hover:shadow-m3-1 transition-all active:scale-95 flex items-center justify-center gap-m3-2"
        >
          <span>✨ 이 공간, 어떻게 변신할 수 있을까요? (견적)</span>
          <span className="text-label-small bg-m3-error text-m3-on-error px-m3-2 py-m3-1 rounded-m3-full animate-pulse">HOT</span>
        </button>
      </div>
    </div>
  );
}