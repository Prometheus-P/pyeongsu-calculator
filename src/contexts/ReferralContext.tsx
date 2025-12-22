/**
 * Referral Context
 *
 * URL의 ref 파라미터를 전역 상태로 관리
 * - ?ref=partner1 형태로 유입된 파트너 추적
 * - localStorage에 저장하여 세션 유지
 * - Tally 폼에 hidden field로 전달
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface ReferralContextType {
  /** 파트너 레퍼럴 코드 (예: ?ref=partner1) */
  ref: string | null;
  /** 유입 소스 (예: ?source=naver 또는 ?utm_source=naver) */
  source: string | null;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

const STORAGE_KEY = 'pyeongcalc_referral';

export function ReferralProvider({ children }: { children: ReactNode }) {
  const [referralData, setReferralData] = useState<ReferralContextType>({
    ref: null,
    source: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. URL 파라미터 확인 (최우선)
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    const sourceParam = params.get('source') || params.get('utm_source');

    if (refParam || sourceParam) {
      const data: ReferralContextType = {
        ref: refParam,
        source: sourceParam,
      };
      setReferralData(data);

      // localStorage에 저장 (세션 유지)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // localStorage 사용 불가 (private mode 등)
      }
      return;
    }

    // 2. localStorage에서 복원 (URL에 없는 경우)
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ReferralContextType;
        setReferralData(parsed);
      }
    } catch {
      // 파싱 실패 또는 localStorage 사용 불가
    }
  }, []);

  return (
    <ReferralContext.Provider value={referralData}>
      {children}
    </ReferralContext.Provider>
  );
}

/**
 * Referral 정보 접근 훅
 *
 * @example
 * const { ref, source } = useReferral();
 * // ref: 'partner1' (from ?ref=partner1)
 * // source: 'naver' (from ?source=naver)
 */
export function useReferral(): ReferralContextType {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
}
