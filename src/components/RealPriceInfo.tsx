/**
 * src/components/RealPriceInfo.tsx
 * 실거래가 정보 표시 컴포넌트
 *
 * [Plan 2 핵심 기능]
 * 평수 계산 결과와 연동하여 해당 평형의 시세 정보를 제공
 */

import { useState, useEffect, useCallback } from 'react';
import {
  fetchRealPrices,
  calculatePriceSummary,
  getCurrentYearMonth,
  isApiMockMode,
} from '../services/realEstateApi';
import type { RegionPriceSummary, PriceSummaryBySize } from '../types/realEstate';
import { POPULAR_REGIONS, type RegionCode } from '../constants/regions';
import { formatNumber } from '../utils/converter';

interface RealPriceInfoProps {
  /** 현재 선택/입력된 평수 */
  pyeong: number;
  /** 현재 선택/입력된 제곱미터 */
  sqm: number;
}

export default function RealPriceInfo({ pyeong, sqm }: RealPriceInfoProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionCode>(POPULAR_REGIONS[0]);
  const [summary, setSummary] = useState<RegionPriceSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const dealYmd = getCurrentYearMonth();
      const response = await fetchRealPrices({
        lawdCd: selectedRegion.code,
        dealYmd,
      });

      if (!response.success) {
        setError(response.errorMessage || '데이터를 불러올 수 없습니다.');
        setSummary(null);
        return;
      }

      const priceSummary = calculatePriceSummary(
        response.data,
        selectedRegion.code,
        dealYmd.substring(0, 4) + '년 ' + parseInt(dealYmd.substring(4)) + '월'
      );

      setSummary(priceSummary);
    } catch {
      setError('데이터 조회 중 오류가 발생했습니다.');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [selectedRegion]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 현재 평형과 가장 가까운 시세 찾기
  const findClosestSize = (bySize: PriceSummaryBySize[]): PriceSummaryBySize | null => {
    if (bySize.length === 0) return null;

    return bySize.reduce((prev, curr) =>
      Math.abs(curr.pyeong - pyeong) < Math.abs(prev.pyeong - pyeong) ? curr : prev
    );
  };

  const closestSize = summary ? findClosestSize(summary.bySize) : null;
  const isExactMatch = closestSize && Math.abs(closestSize.pyeong - pyeong) <= 2;

  return (
    <div className="mt-m3-8 bg-m3-tertiary-container/30 rounded-m3-lg p-m3-4 border border-m3-outline-variant">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-m3-4">
        <h3 className="text-title-large text-m3-on-surface flex items-center gap-m3-2">
          📊 <span className="text-m3-tertiary">실거래가</span> 시세 정보
          {isApiMockMode() && (
            <span className="text-label-small bg-m3-error-container text-m3-on-error-container px-m3-2 py-m3-1 rounded-m3-full">
              DEMO
            </span>
          )}
        </h3>

        {/* 새로고침 버튼 */}
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-m3-2 rounded-m3-full m3-state-layer hover:bg-m3-surface-variant transition-colors disabled:opacity-50"
          title="새로고침"
        >
          <svg
            className={`w-5 h-5 text-m3-on-surface-variant ${loading ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* 지역 선택 */}
      <div className="flex flex-wrap gap-m3-2 mb-m3-4">
        {POPULAR_REGIONS.map((region) => (
          <button
            key={region.code}
            onClick={() => setSelectedRegion(region)}
            className={`px-m3-3 py-m3-1 text-label-medium rounded-m3-full transition-all m3-state-layer ${
              selectedRegion.code === region.code
                ? 'bg-m3-tertiary text-m3-on-tertiary shadow-m3-1'
                : 'bg-m3-surface text-m3-on-surface-variant border border-m3-outline-variant hover:border-m3-tertiary'
            }`}
          >
            {region.name}
          </button>
        ))}
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="py-m3-8 text-center">
          <div className="inline-block w-8 h-8 border-4 border-m3-tertiary/30 border-t-m3-tertiary rounded-full animate-spin" />
          <p className="mt-m3-2 text-body-medium text-m3-on-surface-variant">
            시세 정보를 불러오는 중...
          </p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && !loading && (
        <div className="py-m3-4 px-m3-3 bg-m3-error-container rounded-m3-md">
          <p className="text-body-medium text-m3-on-error-container">{error}</p>
        </div>
      )}

      {/* 시세 정보 */}
      {summary && !loading && !error && (
        <>
          {/* 지역 및 기간 정보 */}
          <div className="mb-m3-4 pb-m3-3 border-b border-m3-outline-variant/50">
            <p className="text-label-medium text-m3-on-surface-variant">
              {summary.regionName} · {summary.period} 기준 · 총 {summary.totalTransactions}건
            </p>
          </div>

          {/* 현재 평형 시세 하이라이트 */}
          {closestSize && (
            <div
              className={`mb-m3-4 p-m3-4 rounded-m3-md ${
                isExactMatch
                  ? 'bg-m3-primary-container'
                  : 'bg-m3-surface-variant'
              }`}
            >
              <div className="flex items-center gap-m3-2 mb-m3-2">
                <span className="text-title-medium text-m3-on-surface font-bold">
                  {Math.round(pyeong)}평 ({Math.round(sqm)}㎡)
                </span>
                {isExactMatch ? (
                  <span className="text-label-small bg-m3-primary text-m3-on-primary px-m3-2 py-m3-1 rounded-m3-full">
                    정확 매칭
                  </span>
                ) : (
                  <span className="text-label-small bg-m3-outline text-m3-on-surface-variant px-m3-2 py-m3-1 rounded-m3-full">
                    {closestSize.pyeong}평 기준
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-m3-4">
                <div>
                  <p className="text-label-small text-m3-on-surface-variant mb-m3-1">평균 매매가</p>
                  <p className="text-headline-small text-m3-on-surface font-bold">
                    {formatNumber(closestSize.avgPrice, 0)}
                    <span className="text-title-small font-normal"> 만원</span>
                  </p>
                </div>
                <div>
                  <p className="text-label-small text-m3-on-surface-variant mb-m3-1">평당 가격</p>
                  <p className="text-headline-small text-m3-tertiary font-bold">
                    {formatNumber(closestSize.pricePerPyeong, 0)}
                    <span className="text-title-small font-normal"> 만원/평</span>
                  </p>
                </div>
              </div>

              <div className="mt-m3-3 pt-m3-3 border-t border-m3-outline-variant/50 flex justify-between text-body-small text-m3-on-surface-variant">
                <span>
                  최저 {formatNumber(closestSize.minPrice, 0)}만 ~ 최고 {formatNumber(closestSize.maxPrice, 0)}만
                </span>
                <span>{closestSize.transactionCount}건 거래</span>
              </div>
            </div>
          )}

          {/* 평형대별 시세 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full text-body-small">
              <thead>
                <tr className="border-b border-m3-outline-variant">
                  <th className="py-m3-2 px-m3-2 text-left text-m3-on-surface-variant font-medium">
                    평형
                  </th>
                  <th className="py-m3-2 px-m3-2 text-right text-m3-on-surface-variant font-medium">
                    평균가
                  </th>
                  <th className="py-m3-2 px-m3-2 text-right text-m3-on-surface-variant font-medium">
                    평당가
                  </th>
                  <th className="py-m3-2 px-m3-2 text-right text-m3-on-surface-variant font-medium">
                    건수
                  </th>
                </tr>
              </thead>
              <tbody>
                {summary.bySize.map((size) => {
                  const isHighlighted =
                    closestSize && size.sizeRange === closestSize.sizeRange;

                  return (
                    <tr
                      key={size.sizeRange}
                      className={`border-b border-m3-outline-variant/30 ${
                        isHighlighted ? 'bg-m3-primary-container/30' : ''
                      }`}
                    >
                      <td className="py-m3-2 px-m3-2 text-m3-on-surface">
                        <span className="font-medium">{size.pyeong}평</span>
                        <span className="text-m3-on-surface-variant ml-m3-1">
                          ({size.sizeRange}㎡)
                        </span>
                      </td>
                      <td className="py-m3-2 px-m3-2 text-right text-m3-on-surface font-medium">
                        {formatNumber(size.avgPrice, 0)}만
                      </td>
                      <td className="py-m3-2 px-m3-2 text-right text-m3-tertiary font-medium">
                        {formatNumber(size.pricePerPyeong, 0)}만
                      </td>
                      <td className="py-m3-2 px-m3-2 text-right text-m3-on-surface-variant">
                        {size.transactionCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-m3-surface-variant/50">
                  <td className="py-m3-2 px-m3-2 font-bold text-m3-on-surface">전체 평균</td>
                  <td className="py-m3-2 px-m3-2 text-right text-m3-on-surface">-</td>
                  <td className="py-m3-2 px-m3-2 text-right text-m3-tertiary font-bold">
                    {formatNumber(summary.overallPricePerPyeong, 0)}만
                  </td>
                  <td className="py-m3-2 px-m3-2 text-right text-m3-on-surface-variant">
                    {summary.totalTransactions}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* 안내 메시지 */}
          {isApiMockMode() && (
            <p className="mt-m3-4 text-label-small text-center text-m3-on-surface-variant/70 bg-m3-surface-variant/50 py-m3-2 rounded-m3-md">
              * 데모 데이터입니다. 실제 시세와 다를 수 있습니다.
              <br />
              공공데이터포털 API 연동 시 실시간 데이터가 제공됩니다.
            </p>
          )}
        </>
      )}
    </div>
  );
}
