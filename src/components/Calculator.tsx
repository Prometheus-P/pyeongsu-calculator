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
import { getProvocativeMessage, getShareableText, type FamilyType } from '../utils/insightGenerator';
import SpaceVisualizer from './SpaceVisualizer'; // Visual Moat Import
import BudgetEstimator from './BudgetEstimator'; // Cashflow Protocol Import
import RealPriceInfo from './RealPriceInfo'; // Plan 2: 실거래가 연동
import { TextField, Chip, Card } from './m3'; // M3 컴포넌트

const FAMILY_OPTIONS: { type: FamilyType; label: string }[] = [
  { type: 'single', label: '1인' },
  { type: 'couple', label: '2인' },
  { type: 'family_3', label: '3인' },
  { type: 'family_4', label: '4인+' },
];

export default function Calculator() {
  const [sqm, setSqm] = useState('');
  const [pyeong, setPyeong] = useState('');
  const [insight, setInsight] = useState<typeof PROPRIETARY_INSIGHTS[InsightKey] | null>(null);
  const [familyType, setFamilyType] = useState<FamilyType>('couple');

  const pyeongInputRef = useRef<HTMLInputElement>(null);
  const { openForm } = useLeadForm();

  // 트리거 메시지 계산
  const triggerResult = isValidInput(pyeong)
    ? getProvocativeMessage(parseFloat(pyeong), familyType)
    : null;

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
      {/* 1. 헤더 */}
      <header className="text-center mb-m3-8">
        <h1 className="text-headline-medium text-m3-on-surface tracking-tight mb-m3-2">
          평수 계산기
        </h1>
        <p className="text-body-large text-m3-on-surface-variant">
          제곱미터와 평, 쉽게 변환하세요
        </p>
      </header>

      {/* 2. M3 Input Fields */}
      <div className="grid grid-cols-2 gap-m3-4 mb-m3-6">
        <TextField
          id="sqm-input"
          label="제곱미터 (㎡)"
          type="text"
          inputMode="decimal"
          value={sqm}
          onChange={(e) => handleSqmChange(e.target.value)}
          placeholder="84"
          className="text-center text-title-large font-bold"
        />
        <TextField
          id="pyeong-input"
          ref={pyeongInputRef}
          label="평"
          type="text"
          inputMode="decimal"
          value={pyeong}
          onChange={(e) => handlePyeongChange(e.target.value)}
          placeholder="25.4"
          className="text-center text-title-large font-bold"
        />
      </div>

      {/* 3. 가구원 수 선택 */}
      <section className="mb-m3-4">
        <p className="text-body-medium text-m3-on-surface-variant mb-m3-2">
          몇 명이 사시나요?
        </p>
        <div className="grid grid-cols-4 gap-m3-2">
          {FAMILY_OPTIONS.map(({ type, label }) => (
            <Chip
              key={type}
              variant="filter"
              selected={familyType === type}
              onClick={() => setFamilyType(type)}
            >
              {label}
            </Chip>
          ))}
        </div>
      </section>

      {/* 4. 트리거 메시지 - 도발적 진단 */}
      {triggerResult && (
        <div
          className={`mb-m3-6 p-m3-4 rounded-m3-md border-l-4 animate-fade-in ${
            triggerResult.level === 'danger'
              ? 'bg-red-50 dark:bg-red-950/30 border-red-500 text-red-800 dark:text-red-200'
              : triggerResult.level === 'warning'
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 text-amber-800 dark:text-amber-200'
              : triggerResult.level === 'success'
              ? 'bg-green-50 dark:bg-green-950/30 border-green-500 text-green-800 dark:text-green-200'
              : 'bg-purple-50 dark:bg-purple-950/30 border-purple-500 text-purple-800 dark:text-purple-200'
          }`}
        >
          <p className="text-body-large font-medium">
            {triggerResult.icon} {triggerResult.message}
          </p>
          <button
            onClick={() => {
              const shareText = getShareableText(parseFloat(pyeong), familyType);
              const shareUrl = window.location.href;
              if (navigator.share) {
                navigator.share({ text: shareText, url: shareUrl });
              } else {
                navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                alert('링크가 복사되었습니다!');
              }
            }}
            className="mt-m3-3 text-label-medium underline opacity-70 hover:opacity-100 transition-opacity"
          >
            친구에게 공유하기 →
          </button>
        </div>
      )}

      {/* 5. 빠른 선택 */}
      <section className="mb-m3-6">
        <div className="flex justify-between items-center mb-m3-3">
          <p className="text-body-medium text-m3-on-surface-variant">
            자주 찾는 평형
          </p>
          <button
            onClick={handleReset}
            className="text-label-medium text-m3-error hover:text-m3-on-error-container m3-state-layer px-m3-2 py-m3-1 rounded-m3-sm transition-all"
          >
            초기화
          </button>
        </div>
        <div className="grid grid-cols-4 gap-m3-2">
          {quickSizes.map((size) => (
            <Chip
              key={size}
              variant="filter"
              selected={Math.abs(parseFloat(pyeong) - size) < 1}
              onClick={() => updateFieldsFromPyeong(size)}
            >
              {size}평
            </Chip>
          ))}
        </div>
      </section>

      {/* 4. 평형 인사이트 */}
      {insight && (
        <Card
          variant="filled"
          className="mb-m3-6 bg-m3-secondary-container text-m3-on-secondary-container border-l-4 border-m3-secondary animate-fade-in"
        >
          <p className="text-label-medium text-m3-on-secondary-container/70 mb-m3-1">
            이 평형은요
          </p>
          <h3 className="text-title-large font-medium mb-m3-2">{insight.label}</h3>
          <p className="text-body-large leading-relaxed mb-m3-4">{insight.verdict}</p>

          <div className="space-y-m3-3">
            <div>
              <p className="text-label-small text-green-600 dark:text-green-400 font-medium mb-m3-1">
                좋은 점
              </p>
              <p className="text-body-medium text-m3-on-secondary-container/90 leading-relaxed">
                {insight.pros}
              </p>
            </div>
            <div>
              <p className="text-label-small text-amber-600 dark:text-amber-400 font-medium mb-m3-1">
                참고하세요
              </p>
              <p className="text-body-medium text-m3-on-secondary-container/90 leading-relaxed">
                {insight.cons}
              </p>
            </div>
          </div>

          <div className="mt-m3-4 pt-m3-3 border-t border-m3-outline-variant/30">
            <p className="text-label-small text-m3-on-secondary-container/60 mb-m3-1">
              시세 참고
            </p>
            <p className="text-body-small text-m3-on-secondary-container/80">
              {insight.benchmark}
            </p>
          </div>
        </Card>
      )}

      {/* 4. Visual Moat: 공간 시뮬레이터 */}
      {isValidInput(sqm) && <SpaceVisualizer sqm={parseFloat(sqm)} />}

      {/* 💰 Cashflow Protocol: The Venom */}
      {insight && isValidInput(pyeong) && (
        <BudgetEstimator pyeong={parseFloat(pyeong)} insightLabel={insight.label} />
      )}

      {/* 📊 Plan 2: 실거래가 시세 정보 */}
      {isValidInput(pyeong) && isValidInput(sqm) && (
        <RealPriceInfo pyeong={parseFloat(pyeong)} sqm={parseFloat(sqm)} />
      )}

      {/* CTA 버튼 */}
      <section className="mt-m3-8">
        <button
          onClick={() => openForm('INTERIOR_QUOTE', {
            pyeong: parseFloat(pyeong) || undefined,
            sqm: parseFloat(sqm) || undefined,
            insightLabel: insight?.label,
          })}
          className="w-full py-m3-4 bg-m3-primary text-m3-on-primary font-medium rounded-m3-full text-label-large m3-state-layer hover:shadow-m3-2 transition-all active:scale-[0.98]"
        >
          인테리어 견적 받아보기
        </button>
      </section>
    </div>
  );
}