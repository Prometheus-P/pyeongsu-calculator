/**
 * useLeadForm Hook
 *
 * Tally 폼 열기와 GA 이벤트 추적을 통합하는 훅
 * - ref 파라미터 자동 전달
 * - 계산 데이터 hidden fields로 전달
 * - 폼 열기/제출/닫기 이벤트 추적
 */

import { useCallback } from 'react';
import { useReferral } from '../contexts/ReferralContext';
import { openTallyForm, type TallyFormType, type TallyPopupOptions } from '../utils/tally';
import { LeadFormEvents } from '../utils/analytics';

/**
 * 리드 폼에 전달할 데이터
 */
export interface LeadFormData {
  /** 평수 */
  pyeong?: number;
  /** 제곱미터 */
  sqm?: number;
  /** 인사이트 라벨 (예: "34평형 (84㎡)") */
  insightLabel?: string;
  /** 기본 인테리어 비용 (만원) */
  basicInterior?: number;
  /** 프리미엄 인테리어 비용 (만원) */
  premiumInterior?: number;
  /** 매매 목표가 (만원) */
  housePrice?: number;
  /** 대출 가능액 (만원) */
  maxLoan?: number;
  /** 필요 현금 (만원) */
  needCash?: number;
}

/**
 * useLeadForm 훅 반환 타입
 */
interface UseLeadFormReturn {
  /**
   * Tally 폼 열기
   *
   * @param formType - 폼 타입
   * @param formData - 폼에 전달할 데이터
   * @param options - Tally 추가 옵션
   */
  openForm: (
    formType: TallyFormType,
    formData: LeadFormData,
    options?: Partial<TallyPopupOptions>
  ) => void;
}

/**
 * 리드 폼 열기 훅
 *
 * @example
 * const { openForm } = useLeadForm();
 *
 * // 인테리어 견적 폼 열기
 * openForm('INTERIOR_QUOTE', {
 *   pyeong: 34,
 *   sqm: 84,
 *   insightLabel: '국민 평형 (84㎡)',
 * });
 */
export function useLeadForm(): UseLeadFormReturn {
  const { ref, source } = useReferral();

  const openForm = useCallback(
    (
      formType: TallyFormType,
      formData: LeadFormData,
      options?: Partial<TallyPopupOptions>
    ) => {
      // 1. Hidden fields 구성
      const hiddenFields: Record<string, string | number> = {
        // 레퍼럴 정보
        ...(ref && { ref }),
        ...(source && { source }),
        // 메타 정보
        origin_page: typeof window !== 'undefined' ? window.location.pathname : '/',
        timestamp: new Date().toISOString(),
      };

      // 2. 폼 데이터 추가
      if (formData.pyeong !== undefined) {
        hiddenFields.pyeong = formData.pyeong;
      }
      if (formData.sqm !== undefined) {
        hiddenFields.sqm = formData.sqm;
      }
      if (formData.insightLabel) {
        hiddenFields.insight_label = formData.insightLabel;
      }
      if (formData.basicInterior !== undefined) {
        hiddenFields.basic_interior = formData.basicInterior;
      }
      if (formData.premiumInterior !== undefined) {
        hiddenFields.premium_interior = formData.premiumInterior;
      }
      if (formData.housePrice !== undefined) {
        hiddenFields.house_price = formData.housePrice;
      }
      if (formData.maxLoan !== undefined) {
        hiddenFields.max_loan = formData.maxLoan;
      }
      if (formData.needCash !== undefined) {
        hiddenFields.need_cash = formData.needCash;
      }

      // 3. GA 이벤트 - 폼 열기
      LeadFormEvents.open(formType, formData.pyeong);

      // 4. Tally 폼 열기 (콜백 포함)
      openTallyForm(formType, hiddenFields, {
        ...options,
        onSubmit: (payload) => {
          // GA 이벤트 - 폼 제출
          LeadFormEvents.submit(formType, payload.submissionId);
          options?.onSubmit?.(payload);
        },
        onClose: () => {
          // GA 이벤트 - 폼 닫기
          LeadFormEvents.close(formType);
          options?.onClose?.();
        },
      });
    },
    [ref, source]
  );

  return { openForm };
}
