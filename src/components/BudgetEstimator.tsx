/**
 * src/components/BudgetEstimator.tsx
 * [Cash Generator]
 * 공간에 대한 호기심을 '구매 의사'로 전환하는 컴포넌트
 */
import { useState } from 'react';
import { INTERIOR_COSTS, LOAN_RATES } from '../constants/costs';
import { formatNumber } from '../utils/converter';
import { useLeadForm } from '../hooks/useLeadForm';
import { BudgetEstimatorEvents } from '../utils/analytics';
import { TextField } from './m3/TextField';

interface BudgetEstimatorProps {
  pyeong: number;
  insightLabel: string; // 예: "34평형 (84㎡)"
}

export default function BudgetEstimator({ pyeong, insightLabel }: BudgetEstimatorProps) {
  const [housePrice, setHousePrice] = useState(0); // 사용자가 생각하는 매매가 입력
  const { openForm } = useLeadForm();

  // 견적 계산 로직
  const basicInterior = Math.round(pyeong * INTERIOR_COSTS.BASIC.pricePerPyeong / 10000); // 만원 단위
  const premiumInterior = Math.round(pyeong * INTERIOR_COSTS.PREMIUM.pricePerPyeong / 10000);
  
  // 대출 계산 로직 (간이)
  const maxLoan = housePrice > 0 ? Math.round(housePrice * LOAN_RATES.MORTGAGE.ltv) : 0;
  const needCash = housePrice > 0 ? housePrice - maxLoan : 0;

  return (
    <div className="mt-m3-8 bg-m3-surface-variant/60 rounded-m3-lg p-m3-4">
      <h3 className="text-title-large text-m3-on-surface-variant mb-m3-4 flex items-center gap-m3-2">
        💰 <span className="text-m3-primary">{insightLabel}</span> 내 집 마련 예산 플래너
      </h3>

      {/* 1. 인테리어 섹션 (Proptech Hook) */}
      <div className="mb-m3-6">
        <h4 className="text-title-small text-m3-on-surface-variant font-bold uppercase mb-m3-3 px-m3-1">인테리어 예산 (시공사 직연결 기준)</h4>
        <div className="grid grid-cols-2 gap-m3-3">
          {/* Basic Interior Card */}
          <div className="bg-m3-surface p-m3-4 rounded-m3-md border border-m3-outline-variant hover:border-m3-primary cursor-pointer transition-all group m3-state-layer">
            <div className="text-label-large text-m3-on-surface-variant mb-m3-1">{INTERIOR_COSTS.BASIC.label}</div>
            <div className="text-headline-small font-bold text-m3-on-surface group-hover:text-m3-primary">
              {formatNumber(basicInterior, 0)} <span className="text-title-medium font-normal">만원~</span>
            </div>
            <p className="text-body-small text-m3-on-surface-variant mt-m3-2">{INTERIOR_COSTS.BASIC.description}</p>
          </div>
          {/* Premium Interior Card */}
          <div className="bg-m3-surface p-m3-4 rounded-m3-md border border-m3-outline-variant hover:border-m3-primary cursor-pointer transition-all group m3-state-layer">
            <div className="text-label-large text-m3-on-surface-variant mb-m3-1">{INTERIOR_COSTS.PREMIUM.label}</div>
            <div className="text-headline-small font-bold text-m3-on-surface group-hover:text-m3-primary">
              {formatNumber(premiumInterior, 0)} <span className="text-title-medium font-normal">만원~</span>
            </div>
            <p className="text-body-small text-m3-on-surface-variant mt-m3-2">{INTERIOR_COSTS.PREMIUM.description}</p>
          </div>
        </div>
        <button
          onClick={() => openForm('PARTNER_QUOTE', {
            pyeong,
            insightLabel,
            basicInterior,
            premiumInterior,
          })}
          className="w-full mt-m3-3 py-m3-2 bg-m3-secondary-container text-m3-on-secondary-container text-label-large font-bold rounded-m3-full flex justify-center items-center gap-m3-2 m3-state-layer hover:shadow-m3-1 transition-shadow"
        >
          ✅ 검증된 파트너사에게 '정직한 견적' 받기
        </button>
      </div>

      {/* 2. 대출 섹션 (Fintech Hook) */}
      <div className="pt-m3-6 border-t border-m3-outline-variant">
        <h4 className="text-title-small text-m3-on-surface-variant font-bold uppercase mb-m3-3 px-m3-1">자금 조달 계획 (LTV {LOAN_RATES.MORTGAGE.ltv * 100}%)</h4>
        
        <TextField
          label="매매 목표가"
          type="number"
          suffix="억"
          placeholder="5"
          supportingText="예: 5억 = 5 입력"
          containerClassName="mb-m3-4"
          onChange={(e) => {
            const priceInManwon = Number(e.target.value) * 10000;
            setHousePrice(priceInManwon);
            if (priceInManwon > 0) {
              BudgetEstimatorEvents.priceInput(priceInManwon, pyeong);
            }
          }}
        />

        {housePrice > 0 && (
          <div className="bg-m3-surface/50 p-m3-4 rounded-m3-md mb-m3-4 border border-m3-outline-variant/70">
            <div className="flex justify-between text-body-medium mb-m3-2">
              <span className="text-m3-on-surface-variant">대출 가능액 (예상)</span>
              <span className="text-m3-tertiary font-bold">{formatNumber(maxLoan, 0)} 만원</span>
            </div>
            <div className="flex justify-between text-body-medium">
              <span className="text-m3-on-surface-variant">필요 현금</span>
              <span className="text-m3-on-surface font-bold">{formatNumber(needCash + basicInterior, 0)} 만원</span>
            </div>
            <div className="text-label-small text-right text-m3-on-surface-variant/70 mt-m3-1">(인테리어 기본 비용 포함)</div>
          </div>
        )}

        <button
          onClick={() => openForm('LOAN_CONSULTATION', {
            pyeong,
            insightLabel,
            housePrice,
            maxLoan,
            needCash: needCash + basicInterior,
          })}
          className="w-full py-m3-3 bg-m3-tertiary text-m3-on-tertiary font-bold text-label-large rounded-m3-full shadow-m3-1 hover:shadow-m3-2 transform active:scale-95 transition-all m3-state-layer"
        >
          📈 1분 만에 알아보는 내 최적 대출 조건
        </button>
      </div>
    </div>
  );
}