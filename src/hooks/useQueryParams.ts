import { useMemo, useCallback } from 'react';

export function useQueryParams() {
  // URL에서 pyeong 파라미터 읽기
  const pyeongFromUrl = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const pyeongParam = params.get('pyeong');

    if (!pyeongParam) return null;

    const value = parseFloat(pyeongParam);
    if (isNaN(value) || value < 0) return null;

    return value;
  }, []);

  // URL 업데이트 함수
  const updateUrl = useCallback((pyeong: number | null) => {
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
