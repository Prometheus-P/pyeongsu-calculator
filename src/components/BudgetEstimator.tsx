/**
 * src/components/BudgetEstimator.tsx
 * [Cash Generator]
 * 공간에 대한 호기심을 '구매 의사'로 전환하는 컴포넌트
 */
import { useState } from 'react';
import { INTERIOR_COSTS, LOAN_RATES } from '../constants/costs';
import { formatNumber } from '../utils/converter';

interface BudgetEstimatorProps {
  pyeong: number;
  insightLabel: string; // 예: "34평형 (84㎡)"
}

export default function BudgetEstimator({ pyeong, insightLabel }: BudgetEstimatorProps) {
  const [housePrice, setHousePrice] = useState(0); // 사용자가 생각하는 매매가 입력

  // 견적 계산 로직
  const basicInterior = Math.round(pyeong * INTERIOR_COSTS.BASIC.pricePerPyeong / 10000); // 만원 단위
  const premiumInterior = Math.round(pyeong * INTERIOR_COSTS.PREMIUM.pricePerPyeong / 10000);
  
  // 대출 계산 로직 (간이)
  const maxLoan = housePrice > 0 ? Math.round(housePrice * LOAN_RATES.MORTGAGE.ltv) : 0;
  const needCash = housePrice > 0 ? housePrice - maxLoan : 0;

  return (
    <div className="mt-8 bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-2xl">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        💰 <span className="text-yellow-400">{insightLabel}</span> 현실 견적서
      </h3>

      {/* 1. 인테리어 섹션 (Proptech Hook) */}
      <div className="mb-8">
        <h4 className="text-sm text-gray-400 font-bold uppercase mb-3">인테리어 예산 (시공사 직연결 기준)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-cyan-500 cursor-pointer transition-all group">
            <div className="text-gray-300 text-sm mb-1">{INTERIOR_COSTS.BASIC.label}</div>
            <div className="text-2xl font-bold text-white group-hover:text-cyan-400">
              {formatNumber(basicInterior, 0)} <span className="text-sm font-normal">만원~</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">{INTERIOR_COSTS.BASIC.description}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 cursor-pointer transition-all group">
            <div className="text-gray-300 text-sm mb-1">{INTERIOR_COSTS.PREMIUM.label}</div>
            <div className="text-2xl font-bold text-white group-hover:text-purple-400">
              {formatNumber(premiumInterior, 0)} <span className="text-sm font-normal">만원~</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">{INTERIOR_COSTS.PREMIUM.description}</p>
          </div>
        </div>
        <button 
          onClick={() => window.alert("지인 시공사 연결 폼(Typeform/Tally) 연동 예정")}
          className="w-full mt-3 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-bold rounded flex justify-center items-center gap-2"
        >
          👷 호구 당하지 않는 '실적 견적' 받기
        </button>
      </div>

      {/* 2. 대출 섹션 (Fintech Hook) */}
      <div className="pt-6 border-t border-gray-700">
        <h4 className="text-sm text-gray-400 font-bold uppercase mb-3">자금 조달 계획 (LTV {LOAN_RATES.MORTGAGE.ltv * 100}%)</h4>
        
        <div className="flex gap-4 items-center mb-4">
          <input 
            type="number" 
            placeholder="매매 목표가 (억 단위)" 
            className="flex-1 bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-400 outline-none"
            onChange={(e) => setHousePrice(Number(e.target.value) * 10000)} // 억 단위 입력 가정
          />
          <span className="text-white font-bold">만원</span>
        </div>

        {housePrice > 0 && (
          <div className="bg-gray-800/50 p-4 rounded mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">대출 가능액 (예상)</span>
              <span className="text-yellow-400 font-bold">{formatNumber(maxLoan, 0)} 만원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">필요 현금</span>
              <span className="text-white font-bold">{formatNumber(needCash + basicInterior, 0)} 만원</span>
            </div>
            <div className="text-xs text-right text-gray-500 mt-1">(인테리어 기본 비용 포함)</div>
          </div>
        )}

        <button 
          onClick={() => window.alert("대출 상담사 연결 폼 연동 예정")}
          className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded shadow-lg transform active:scale-95 transition-all"
        >
          📞 내 조건 최저금리 & 한도 확인하기
        </button>
      </div>
    </div>
  );
}
