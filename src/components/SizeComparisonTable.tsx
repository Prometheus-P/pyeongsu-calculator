/**
 * src/components/SizeComparisonTable.tsx
 * [Comparison Feature]
 * 선택한 평수와 인접 평수를 비교하는 테이블
 * - 관리비, 인테리어 비용, 대출 한도 비교
 * - "이 정도 차이면 더 큰 평수도 가능" 넛지 효과
 */

import { INTERIOR_COSTS, LOAN_RATES } from '../constants/costs';
import { formatNumber, convertPyeongToSqm } from '../utils/converter';

interface SizeComparisonTableProps {
  pyeong: number;
  onSizeSelect?: (pyeong: number) => void;
}

// 관리비 계산 (평당 1.5~2만원 중간값 사용)
const calculateManagementFee = (pyeong: number): number => {
  return Math.round(pyeong * 17500 / 10000); // 만원 단위
};

// 인테리어 비용 계산 (기본 리모델링 기준)
const calculateInteriorCost = (pyeong: number): number => {
  return Math.round(pyeong * INTERIOR_COSTS.BASIC.pricePerPyeong / 10000); // 만원 단위
};

// 대출 한도 계산 (평균 시세 기준)
const calculateLoanLimit = (pyeong: number): number => {
  // 평당 시세 가정: 약 1500만원 (서울 외곽/경기 평균)
  const estimatedPrice = pyeong * 1500;
  return Math.round(estimatedPrice * LOAN_RATES.MORTGAGE.ltv);
};

// 인접 평수 생성 (10평 단위로 조정)
const getAdjacentSizes = (pyeong: number): [number, number, number] => {
  const rounded = Math.round(pyeong / 5) * 5; // 5평 단위로 반올림
  const smaller = Math.max(rounded - 8, 10);
  const larger = rounded + 8;
  return [smaller, rounded, larger];
};

export default function SizeComparisonTable({ pyeong, onSizeSelect }: SizeComparisonTableProps) {
  const [smallerSize, currentSize, largerSize] = getAdjacentSizes(pyeong);

  const sizes = [
    { pyeong: smallerSize, isCurrent: false },
    { pyeong: currentSize, isCurrent: true },
    { pyeong: largerSize, isCurrent: false },
  ];

  // 현재 선택과 큰 평수의 차이 계산
  const costDiff = calculateInteriorCost(largerSize) - calculateInteriorCost(currentSize);
  const managementDiff = calculateManagementFee(largerSize) - calculateManagementFee(currentSize);

  return (
    <div className="mt-m3-6 p-m3-4 bg-m3-surface-variant/30 rounded-m3-lg border border-m3-outline-variant">
      {/* 헤더 */}
      <div className="flex items-center gap-m3-2 mb-m3-4">
        <span className="text-xl">📊</span>
        <h3 className="text-title-medium font-semibold text-m3-on-surface">
          평수별 비용 비교
        </h3>
      </div>

      {/* 비교 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr className="border-b border-m3-outline-variant">
              {sizes.map(({ pyeong: size, isCurrent }) => (
                <th
                  key={size}
                  className={`py-m3-3 px-m3-2 ${
                    isCurrent
                      ? 'bg-m3-primary/10 text-m3-primary font-bold'
                      : 'text-m3-on-surface-variant'
                  }`}
                >
                  <div className="text-title-medium">
                    {isCurrent && '⭐ '}{size}평
                  </div>
                  <div className="text-label-small text-m3-on-surface-variant">
                    ({Math.round(convertPyeongToSqm(size))}㎡)
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-body-medium">
            {/* 월 관리비 */}
            <tr className="border-b border-m3-outline-variant/50">
              <td colSpan={3} className="pt-m3-3 pb-m3-1 text-left text-label-medium text-m3-on-surface-variant">
                월 관리비 (난방비 포함)
              </td>
            </tr>
            <tr className="border-b border-m3-outline-variant/50">
              {sizes.map(({ pyeong: size, isCurrent }) => (
                <td
                  key={size}
                  className={`py-m3-2 px-m3-2 ${isCurrent ? 'bg-m3-primary/5 font-medium' : ''}`}
                >
                  {formatNumber(calculateManagementFee(size), 0)}만원
                </td>
              ))}
            </tr>

            {/* 인테리어 비용 */}
            <tr className="border-b border-m3-outline-variant/50">
              <td colSpan={3} className="pt-m3-3 pb-m3-1 text-left text-label-medium text-m3-on-surface-variant">
                기본 인테리어
              </td>
            </tr>
            <tr className="border-b border-m3-outline-variant/50">
              {sizes.map(({ pyeong: size, isCurrent }) => (
                <td
                  key={size}
                  className={`py-m3-2 px-m3-2 ${isCurrent ? 'bg-m3-primary/5 font-medium' : ''}`}
                >
                  {formatNumber(calculateInteriorCost(size), 0)}만원
                </td>
              ))}
            </tr>

            {/* 예상 대출 한도 */}
            <tr className="border-b border-m3-outline-variant/50">
              <td colSpan={3} className="pt-m3-3 pb-m3-1 text-left text-label-medium text-m3-on-surface-variant">
                예상 대출 한도 (LTV 70%)
              </td>
            </tr>
            <tr>
              {sizes.map(({ pyeong: size, isCurrent }) => (
                <td
                  key={size}
                  className={`py-m3-2 px-m3-2 ${isCurrent ? 'bg-m3-primary/5 font-medium' : ''}`}
                >
                  {(calculateLoanLimit(size) / 10000).toFixed(1)}억
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 넛지 메시지 */}
      <div className="mt-m3-4 p-m3-3 bg-m3-tertiary-container/30 rounded-m3-md">
        <p className="text-body-medium text-m3-on-surface">
          <span className="font-medium text-m3-tertiary">💡 Tip:</span>{' '}
          {largerSize}평으로 가면 월 <span className="font-bold">{formatNumber(managementDiff, 0)}만원</span>,
          인테리어 <span className="font-bold">{formatNumber(costDiff, 0)}만원</span> 추가로
          더 넓은 공간을 누릴 수 있어요
        </p>
      </div>

      {/* 선택 버튼 (옵션) */}
      {onSizeSelect && (
        <div className="grid grid-cols-3 gap-m3-2 mt-m3-4">
          {sizes.map(({ pyeong: size, isCurrent }) => (
            <button
              key={size}
              onClick={() => onSizeSelect(size)}
              disabled={isCurrent}
              className={`py-m3-2 px-m3-3 rounded-m3-md text-label-medium transition-all ${
                isCurrent
                  ? 'bg-m3-primary/20 text-m3-primary cursor-default'
                  : 'bg-m3-surface border border-m3-outline hover:bg-m3-surface-variant hover:border-m3-primary text-m3-on-surface m3-state-layer'
              }`}
            >
              {isCurrent ? '현재 선택' : `${size}평 보기`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
