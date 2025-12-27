/**
 * src/components/MarketTrendBadge.tsx
 * [Urgency/Scarcity Signal]
 * 실시간 시장 트렌드를 표시하여 긴급성을 유발하는 배지
 * - "이 평수 검색량 증가" 등의 메시지
 * - 정적 데이터 기반 (추후 실시간 API 연동 가능)
 */

import { useMemo } from 'react';

interface MarketTrendBadgeProps {
  pyeong: number;
}

// 평수별 트렌드 데이터 (실제 서비스에서는 API로 대체)
const TREND_DATA: Record<number, { change: number; isHot: boolean }> = {
  10: { change: 12, isHot: false },
  15: { change: 18, isHot: false },
  20: { change: 28, isHot: true },
  25: { change: 35, isHot: true },
  30: { change: 23, isHot: true },
  35: { change: 15, isHot: false },
  40: { change: 8, isHot: false },
};

// 가장 가까운 트렌드 데이터 찾기
const findClosestTrend = (pyeong: number) => {
  const keys = Object.keys(TREND_DATA).map(Number);
  const closest = keys.reduce((prev, curr) =>
    Math.abs(curr - pyeong) < Math.abs(prev - pyeong) ? curr : prev
  );
  return { ...TREND_DATA[closest], basePyeong: closest };
};

// 랜덤 변동 추가 (매번 다른 느낌)
const addVariation = (value: number): number => {
  const variation = Math.floor(Math.random() * 10) - 5; // -5 ~ +5
  return Math.max(5, value + variation);
};

export default function MarketTrendBadge({ pyeong }: MarketTrendBadgeProps) {
  const trend = useMemo(() => {
    const base = findClosestTrend(pyeong);
    return {
      ...base,
      displayChange: addVariation(base.change),
    };
  }, [pyeong]);

  // 현재 날짜 기준 "이번 주" 표시
  const weekText = '이번 주';

  return (
    <div className="inline-flex items-center gap-m3-2 px-m3-3 py-m3-2 bg-m3-tertiary-container rounded-m3-full animate-fade-in">
      {/* 아이콘 */}
      <span className="text-base">
        {trend.isHot ? '🔥' : '📈'}
      </span>

      {/* 트렌드 텍스트 */}
      <span className="text-label-medium text-m3-on-tertiary-container">
        {trend.basePyeong}평대 검색량{' '}
        <span className="font-bold text-m3-tertiary">
          {weekText} {trend.displayChange}%↑
        </span>
      </span>

      {/* HOT 배지 */}
      {trend.isHot && (
        <span className="px-m3-2 py-m3-0.5 bg-m3-error text-m3-on-error text-label-small font-bold rounded-m3-full">
          HOT
        </span>
      )}
    </div>
  );
}
