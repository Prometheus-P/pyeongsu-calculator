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
    <section className="mt-m3-8 bg-m3-surface-variant/50 rounded-m3-lg p-m3-5">
      <h3 className="text-title-medium text-m3-on-surface mb-m3-5">
        예산 계획
      </h3>

      {/* 인테리어 예산 */}
      <div className="mb-m3-6">
        <p className="text-body-medium text-m3-on-surface-variant mb-m3-3">
          {insightLabel} 기준 인테리어 비용
        </p>
        <div className="grid grid-cols-2 gap-m3-3">
          <div className="bg-m3-surface p-m3-4 rounded-m3-md border border-m3-outline-variant">
            <p className="text-label-medium text-m3-on-surface-variant mb-m3-2">
              {INTERIOR_COSTS.BASIC.label}
            </p>
            <p className="text-title-large font-medium text-m3-on-surface">
              {formatNumber(basicInterior, 0)}
              <span className="text-body-medium font-normal text-m3-on-surface-variant"> 만원~</span>
            </p>
            <p className="text-body-small text-m3-on-surface-variant mt-m3-2 leading-relaxed">
              {INTERIOR_COSTS.BASIC.description}
            </p>
          </div>
          <div className="bg-m3-surface p-m3-4 rounded-m3-md border border-m3-outline-variant">
            <p className="text-label-medium text-m3-on-surface-variant mb-m3-2">
              {INTERIOR_COSTS.PREMIUM.label}
            </p>
            <p className="text-title-large font-medium text-m3-on-surface">
              {formatNumber(premiumInterior, 0)}
              <span className="text-body-medium font-normal text-m3-on-surface-variant"> 만원~</span>
            </p>
            <p className="text-body-small text-m3-on-surface-variant mt-m3-2 leading-relaxed">
              {INTERIOR_COSTS.PREMIUM.description}
            </p>
          </div>
        </div>
        <button
          onClick={() => openForm('PARTNER_QUOTE', {
            pyeong,
            insightLabel,
            basicInterior,
            premiumInterior,
          })}
          className="w-full mt-m3-4 py-m3-3 bg-m3-secondary-container text-m3-on-secondary-container text-label-large font-medium rounded-m3-full m3-state-layer hover:shadow-m3-1 transition-shadow"
        >
          인테리어 견적 문의하기
        </button>
      </div>

      {/* 대출 계산 */}
      <div className="pt-m3-5 border-t border-m3-outline-variant/50">
        <p className="text-body-medium text-m3-on-surface-variant mb-m3-3">
          예상 대출 한도 계산 (LTV {LOAN_RATES.MORTGAGE.ltv * 100}% 기준)
        </p>

        <TextField
          label="희망 매매가"
          type="number"
          suffix="억원"
          placeholder="5"
          supportingText="억원 단위로 입력 (예: 5억 → 5, 7억5천 → 7.5)"
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
          <div className="bg-m3-surface p-m3-4 rounded-m3-md mb-m3-4 space-y-m3-2">
            <div className="flex justify-between text-body-medium">
              <span className="text-m3-on-surface-variant">예상 대출 한도</span>
              <span className="text-m3-primary font-medium">{formatNumber(maxLoan, 0)} 만원</span>
            </div>
            <div className="flex justify-between text-body-medium">
              <span className="text-m3-on-surface-variant">필요 자기자본</span>
              <span className="text-m3-on-surface font-medium">{formatNumber(needCash + basicInterior, 0)} 만원</span>
            </div>
            <p className="text-label-small text-m3-on-surface-variant/70 pt-m3-1">
              기본 인테리어 비용 포함
            </p>
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
          className="w-full py-m3-3 bg-m3-tertiary text-m3-on-tertiary font-medium text-label-large rounded-m3-full shadow-m3-1 hover:shadow-m3-2 active:scale-[0.98] transition-all m3-state-layer"
        >
          대출 상담 신청하기
        </button>

        <p className="text-label-small text-m3-error mt-m3-3 text-center">
          2025년 기준금리 변동 예고 - 지금 한도를 확인하세요
        </p>
      </div>
    </section>
  );
}