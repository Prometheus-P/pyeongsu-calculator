import { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import {
  convertSqmToPyeong,
  convertPyeongToSqm,
  formatNumber,
  isValidInput,
  PROPRIETARY_INSIGHTS,
  type InsightKey
} from '../utils/converter';
import SpaceVisualizer from './SpaceVisualizer'; // Visual Moat Import
import BudgetEstimator from './BudgetEstimator'; // Cashflow Protocol Import
import { CalculatorEvents } from '../utils/analytics';

export default function Calculator() {
  const [sqm, setSqm] = useState('');
  const [pyeong, setPyeong] = useState('');
  const [insight, setInsight] = useState<typeof PROPRIETARY_INSIGHTS[InsightKey] | null>(null);
  
  const pyeongInputRef = useRef<HTMLInputElement>(null);

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

  const updateFieldsFromSqm = (sqmValue: number) => {
    setSqm(String(sqmValue));
    setPyeong(formatNumber(convertSqmToPyeong(sqmValue)));
    findInsight(sqmValue);
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
  const quickSizes = [59, 74, 84, 110];

  return (
    <div className="dark bg-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-800">
      {/* 1. Monopoly Title: 타겟 명확화 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight mb-1">
          아파트 공간 시뮬레이터
        </h1>
        <p className="text-sm text-cyan-400 font-medium">
          "숫자가 아닌, 당신의 라이프스타일을 계산합니다"
        </p>
      </div>

      {/* 2. Input Fields */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">전용면적 (㎡)</label>
          <input
            type="text"
            value={sqm}
            onChange={(e) => handleSqmChange(e.target.value)}
            className="w-full bg-gray-800 text-white text-xl font-bold p-3 rounded border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-center"
            placeholder="84"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">평수 (평)</label>
          <input
            ref={pyeongInputRef}
            type="text"
            value={pyeong}
            onChange={(e) => handlePyeongChange(e.target.value)}
            className="w-full bg-gray-800 text-white text-xl font-bold p-3 rounded border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-center"
            placeholder="25.4"
          />
        </div>
      </div>

      {/* 3. Proprietary Insight Card: 독점 콘텐츠 표시 */}
      {insight && (
        <div className="mb-6 bg-gradient-to-r from-gray-800 to-gray-800 border-l-4 border-cyan-500 p-4 rounded-r shadow-lg animate-fade-in">
          <h3 className="text-lg font-bold text-white mb-1">{insight.label}</h3>
          <p className="text-cyan-400 font-bold text-sm mb-3">"{insight.verdict}"</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-green-400 font-bold min-w-[30px]">장점</span>
              <span className="text-gray-300">{insight.pros}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-red-400 font-bold min-w-[30px]">주의</span>
              <span className="text-gray-300">{insight.cons}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
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

      {/* 5. Quick Select & Vertical Integration */}
      <div className="mt-8">
        <p className="text-xs text-gray-500 mb-2 font-bold uppercase">주요 평형 바로보기</p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {quickSizes.map((size) => (
            <button
              key={size}
              onClick={() => updateFieldsFromSqm(size)}
              className={`py-2 px-1 text-sm font-bold rounded transition-colors ${
                Math.abs(parseFloat(sqm) - size) < 1 
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {size}㎡
            </button>
          ))}
        </div>

        {/* Vertical Integration: Next Step Button */}
        <button 
          onClick={() => alert('Vertical Integration: 인테리어/이사 견적 파트너사 연결 예정')}
          className="w-full py-4 bg-white text-gray-900 font-black rounded text-sm hover:bg-gray-100 transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <span>🔨 이 평수 인테리어 견적 미리보기</span>
          <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">HOT</span>
        </button>
      </div>
    </div>
  );
}