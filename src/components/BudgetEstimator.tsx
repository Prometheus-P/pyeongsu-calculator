// Allow for custom element types in JSX
declare namespace JSX {
  interface IntrinsicElements {
    'md-outlined-button': any;
    'md-filled-button': any;
    'md-outlined-text-field': any;
  }
}

import { useState } from 'react';
import { INTERIOR_COSTS, LOAN_RATES } from '../constants/costs';
import { formatNumber } from '../utils/converter';

interface BudgetEstimatorProps {
  pyeong: number;
  insightLabel: string;
}

export default function BudgetEstimator({ pyeong, insightLabel }: BudgetEstimatorProps) {
  const [housePrice, setHousePrice] = useState(0);

  const basicInterior = Math.round((pyeong * INTERIOR_COSTS.BASIC.pricePerPyeong) / 10000);
  const premiumInterior = Math.round((pyeong * INTERIOR_COSTS.PREMIUM.pricePerPyeong) / 10000);

  const maxLoan = housePrice > 0 ? Math.round(housePrice * LOAN_RATES.MORTGAGE.ltv) : 0;
  const needCash = housePrice > 0 ? housePrice - maxLoan : 0;

  return (
    <div className="p-4 rounded-xl bg-m3-surface-container-low flex flex-col gap-6">
      <h3 className="md-typescale-headline-small flex items-center gap-2">
        💰 <span className="text-m3-primary">{insightLabel}</span> 현실 견적서
      </h3>

      {/* Interior Section */}
      <div className="flex flex-col gap-4">
        <h4 className="md-typescale-title-medium">인테리어 예산</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-m3-surface-container">
            <p className="md-typescale-label-large text-m3-on-surface-variant">{INTERIOR_COSTS.BASIC.label}</p>
            <p className="md-typescale-headline-medium text-m3-on-surface">
              {formatNumber(basicInterior, 0)}<span className="md-typescale-body-large">만원~</span>
            </p>
            <p className="md-typescale-body-small text-m3-on-surface-variant mt-1">{INTERIOR_COSTS.BASIC.description}</p>
          </div>
          <div className="p-4 rounded-lg bg-m3-surface-container">
            <p className="md-typescale-label-large text-m3-on-surface-variant">{INTERIOR_COSTS.PREMIUM.label}</p>
            <p className="md-typescale-headline-medium text-m3-on-surface">
              {formatNumber(premiumInterior, 0)}<span className="md-typescale-body-large">만원~</span>
            </p>
            <p className="md-typescale-body-small text-m3-on-surface-variant mt-1">{INTERIOR_COSTS.PREMIUM.description}</p>
          </div>
        </div>
        <md-outlined-button
          onClick={() => window.alert("지인 시공사 연결 폼(Typeform/Tally) 연동 예정")}
        >
          👷 실적 기반 견적 받기
        </md-outlined-button>
      </div>

      {/* Loan Section */}
      <div className="flex flex-col gap-4 pt-6 border-t border-m3-outline-variant">
        <h4 className="md-typescale-title-medium">자금 조달 계획 (LTV {LOAN_RATES.MORTGAGE.ltv * 100}%)</h4>
        <md-outlined-text-field
          label="매매 목표가 (억 단위)"
          type="number"
          onInput={(e: Event) => setHousePrice(Number((e.target as HTMLInputElement).value) * 10000)}
        >
        </md-outlined-text-field>

        {housePrice > 0 && (
          <div className="p-4 rounded-lg bg-m3-surface-container flex flex-col gap-2">
            <div className="flex justify-between md-typescale-body-large">
              <span className="text-m3-on-surface-variant">대출 가능액 (예상)</span>
              <span className="font-bold text-m3-primary">{formatNumber(maxLoan, 0)} 만원</span>
            </div>
            <div className="flex justify-between md-typescale-body-large">
              <span className="text-m3-on-surface-variant">필요 현금</span>
              <span className="font-bold text-m3-on-surface">{formatNumber(needCash + basicInterior, 0)} 만원</span>
            </div>
            <div className="md-typescale-label-small text-right text-m3-on-surface-variant mt-1">(인테리어 기본 비용 포함)</div>
          </div>
        )}

        <md-filled-button
          onClick={() => window.alert("대출 상담사 연결 폼 연동 예정")}
        >
          📞 내 조건 최저금리 & 한도 확인하기
        </md-filled-button>
      </div>
    </div>
  );
}