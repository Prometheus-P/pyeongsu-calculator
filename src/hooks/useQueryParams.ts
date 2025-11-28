import { useMemo, useCallback, useState, useEffect } from 'react';

export function useQueryParams() {
  const [pyeongFromUrl, setPyeongFromUrl] = useState<number | null>(null);

  // 클라이언트에서 마운트 후 URL 파라미터 읽기
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const pyeongParam = params.get('pyeong');

    if (!pyeongParam) {
      setPyeongFromUrl(null);
      return;
    }

    const value = parseFloat(pyeongParam);
    if (isNaN(value) || value < 0) {
      setPyeongFromUrl(null);
      return;
    }

    setPyeongFromUrl(value);
  }, []);

  // URL 업데이트 함수
  const updateUrl = useCallback((pyeong: number | null) => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);

    if (pyeong === null) {
      params.delete('pyeong');
    } else {
      params.set('pyeong', String(pyeong));
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
  }, []);

  return { pyeongFromUrl, updateUrl };
}
