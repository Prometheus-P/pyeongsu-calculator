import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQueryParams } from './useQueryParams';

describe('useQueryParams', () => {
  beforeEach(() => {
    // URL을 초기화
    window.history.pushState({}, '', '/');
  });

  describe('getPyeongFromUrl', () => {
    it('URL에 pyeong 파라미터가 있으면 숫자를 반환한다', () => {
      window.history.pushState({}, '', '?pyeong=30');

      const { result } = renderHook(() => useQueryParams());

      expect(result.current.pyeongFromUrl).toBe(30);
    });

    it('URL에 pyeong 파라미터가 없으면 null을 반환한다', () => {
      window.history.pushState({}, '', '/');

      const { result } = renderHook(() => useQueryParams());

      expect(result.current.pyeongFromUrl).toBeNull();
    });

    it('pyeong 파라미터가 유효하지 않은 숫자면 null을 반환한다', () => {
      window.history.pushState({}, '', '?pyeong=abc');

      const { result } = renderHook(() => useQueryParams());

      expect(result.current.pyeongFromUrl).toBeNull();
    });

    it('pyeong 파라미터가 음수면 null을 반환한다', () => {
      window.history.pushState({}, '', '?pyeong=-10');

      const { result } = renderHook(() => useQueryParams());

      expect(result.current.pyeongFromUrl).toBeNull();
    });

    it('소수점 값도 처리한다', () => {
      window.history.pushState({}, '', '?pyeong=25.5');

      const { result } = renderHook(() => useQueryParams());

      expect(result.current.pyeongFromUrl).toBe(25.5);
    });
  });

  describe('updateUrl', () => {
    it('pyeong 값으로 URL을 업데이트한다', () => {
      const { result } = renderHook(() => useQueryParams());

      result.current.updateUrl(30);

      expect(window.location.search).toBe('?pyeong=30');
    });

    it('null 값이면 pyeong 파라미터를 제거한다', () => {
      window.history.pushState({}, '', '?pyeong=30');
      const { result } = renderHook(() => useQueryParams());

      result.current.updateUrl(null);

      expect(window.location.search).toBe('');
    });

    it('0 값도 유효하게 처리한다', () => {
      const { result } = renderHook(() => useQueryParams());

      result.current.updateUrl(0);

      expect(window.location.search).toBe('?pyeong=0');
    });
  });
});
