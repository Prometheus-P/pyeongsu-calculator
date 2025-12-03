import { useState, useEffect, useCallback, useRef } from 'react';
import type { KeyboardEvent } from 'react';
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
    // T012: M3 card elevation (level 2)
    <div className="bg-m3-surface rounded-m3-md shadow-m3-2 p-m3-6 max-w-md w-full transition-colors">
      {/* T013: M3 typography - headline-medium for title */}
      <h1 className="text-headline-small text-m3-on-surface text-center mb-m3-6">평수 계산기</h1>

      <div className="space-y-m3-4">
        <div>
          {/* T013: M3 typography - label-large for labels */}
          <label htmlFor="sqm" className="block text-label-large text-m3-on-surface-variant mb-m3-1">
            제곱미터 (㎡)
          </label>
          {/* T010: M3 outlined input style */}
          <input
            id="sqm"
            type="text"
            value={sqm}
            onChange={(e) => handleSqmChange(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={(e) => handleKeyDown(e, 'sqm')}
            className="m3-outlined-input w-full"
            placeholder="제곱미터 입력"
          />
        </div>

        <div>
          <label htmlFor="pyeong" className="block text-label-large text-m3-on-surface-variant mb-m3-1">
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
            className="m3-outlined-input w-full"
            placeholder="평수 입력"
          />
        </div>
      </div>

      {/* T011, T018, T020: M3 button styles with state layer and 48px touch target */}
      <div className="flex gap-m3-2 mt-m3-4">
        <button
          onClick={clearFields}
          className="m3-state-layer flex-1 py-m3-3 px-m3-4 min-h-[48px] bg-m3-surface-variant text-m3-on-surface-variant rounded-m3-sm text-label-large transition-colors"
        >
          초기화
        </button>
        {hasValue && (
          <button
            onClick={handleCopy}
            className="m3-state-layer py-m3-3 px-m3-4 min-h-[48px] bg-m3-primary text-m3-on-primary rounded-m3-sm text-label-large transition-colors"
          >
            복사
          </button>
        )}
      </div>

      {showToast && (
        <div className="mt-m3-2 p-m3-2 bg-m3-tertiary-container text-m3-on-tertiary-container text-body-small text-center rounded-m3-xs">
          복사되었습니다!
        </div>
      )}

      <div className="mt-m3-6">
        <p className="text-body-medium text-m3-on-surface-variant mb-m3-2">빠른 선택</p>
        {/* T018, T020: Quick select buttons with state layer and 48px touch target */}
        <div className="grid grid-cols-4 gap-m3-2">
          {quickSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleQuickSelect(size)}
              className="m3-state-layer py-m3-2 px-m3-3 min-h-[48px] bg-m3-primary-container text-m3-on-primary-container rounded-m3-sm text-label-medium transition-colors"
            >
              {size}평
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
