/**
 * Tally.so Form Integration Utility
 *
 * Tally 팝업 폼을 위한 타입 정의 및 유틸리티 함수
 *
 * @see https://tally.so/help/developer-resources
 * @see https://tally.so/help/popup-forms
 */

declare global {
  interface Window {
    Tally?: {
      openPopup: (formId: string, options?: TallyPopupOptions) => void;
      closePopup: (formId: string) => void;
    };
  }
}

export interface TallyPopupOptions {
  /** 고유 키 (동일 폼의 여러 인스턴스 구분용) */
  key?: string;
  /** 레이아웃 타입 */
  layout?: 'default' | 'modal';
  /** 폼 너비 (픽셀) */
  width?: number;
  /** 왼쪽 정렬 여부 */
  alignLeft?: boolean;
  /** 제목 숨김 여부 */
  hideTitle?: boolean;
  /** 오버레이 표시 여부 */
  overlay?: boolean;
  /** 자동 닫힘 시간 (ms) */
  autoClose?: number;
  /** 한 번만 표시 */
  showOnce?: boolean;
  /** 제출 후 다시 표시 안함 */
  doNotShowAfterSubmit?: boolean;
  /** Hidden fields (폼에 자동 입력) */
  hiddenFields?: Record<string, string | number>;
  /** 폼 열림 콜백 */
  onOpen?: () => void;
  /** 폼 닫힘 콜백 */
  onClose?: () => void;
  /** 페이지 변경 콜백 */
  onPageView?: (page: number) => void;
  /** 제출 완료 콜백 */
  onSubmit?: (payload: TallySubmissionPayload) => void;
}

export interface TallySubmissionPayload {
  formId: string;
  formName: string;
  submissionId: string;
  fields: Array<{ key: string; value: unknown }>;
}

/**
 * Tally 폼 ID 상수
 *
 * TODO: Tally.so에서 실제 폼 생성 후 ID 업데이트 필요
 * 폼 URL이 https://tally.so/r/ABC123 이면 ID는 'ABC123'
 */
export const TALLY_FORMS = {
  /** 인테리어/이사 견적 폼 (Calculator.tsx CTA) */
  INTERIOR_QUOTE: 'INTERIOR_FORM_ID',
  /** 파트너사 견적 폼 (BudgetEstimator 인테리어) */
  PARTNER_QUOTE: 'PARTNER_FORM_ID',
  /** 대출 상담 폼 (BudgetEstimator 대출) */
  LOAN_CONSULTATION: 'LOAN_FORM_ID',
} as const;

export type TallyFormType = keyof typeof TALLY_FORMS;

/**
 * Tally 위젯 로드 여부 확인
 */
export function isTallyLoaded(): boolean {
  return typeof window !== 'undefined' && !!window.Tally;
}

/**
 * Tally 팝업 폼 열기
 *
 * @param formType - 폼 타입 (INTERIOR_QUOTE, PARTNER_QUOTE, LOAN_CONSULTATION)
 * @param hiddenFields - 폼에 자동 입력될 hidden fields
 * @param options - 추가 옵션
 */
export function openTallyForm(
  formType: TallyFormType,
  hiddenFields: Record<string, string | number>,
  options?: Partial<TallyPopupOptions>
): void {
  if (!isTallyLoaded()) {
    console.warn('[Tally] Tally widget not loaded. Make sure TallyScript is included.');
    // 폴백: 직접 Tally 페이지로 이동
    const formId = TALLY_FORMS[formType];
    const params = new URLSearchParams();
    Object.entries(hiddenFields).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    window.open(`https://tally.so/r/${formId}?${params.toString()}`, '_blank');
    return;
  }

  const formId = TALLY_FORMS[formType];

  window.Tally!.openPopup(formId, {
    layout: 'modal',
    hideTitle: false,
    overlay: true,
    hiddenFields,
    ...options,
  });
}

/**
 * Tally 팝업 폼 닫기
 */
export function closeTallyForm(formType: TallyFormType): void {
  if (!isTallyLoaded()) return;

  const formId = TALLY_FORMS[formType];
  window.Tally!.closePopup(formId);
}
