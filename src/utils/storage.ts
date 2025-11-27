const STORAGE_KEY = 'pyeong-calculator-history';
const MAX_HISTORY_ITEMS = 10;

export interface HistoryItem {
  sqm: number;
  pyeong: number;
  timestamp: number;
}

/**
 * 히스토리 항목 저장
 * - 새 항목은 맨 앞에 추가
 * - 중복 값은 순서만 업데이트
 * - 최대 10개까지 유지
 */
export function saveHistory(item: HistoryItem): void {
  const history = getHistory();

  // 중복 제거 (같은 pyeong 값)
  const filtered = history.filter((h) => h.pyeong !== item.pyeong);

  // 새 항목을 맨 앞에 추가
  const updated = [item, ...filtered].slice(0, MAX_HISTORY_ITEMS);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/**
 * 저장된 히스토리 조회
 */
export function getHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * 모든 히스토리 삭제
 */
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
