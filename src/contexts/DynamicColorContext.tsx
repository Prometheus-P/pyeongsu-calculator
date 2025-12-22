/**
 * src/contexts/DynamicColorContext.tsx
 * M3 Dynamic Color 컨텍스트 - 사용자 선호 색상 기반 테마 생성 및 관리
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  DEFAULT_SOURCE_COLOR,
  generateDynamicTheme,
  applyThemeToDocument,
  removeThemeFromDocument,
  isValidHexColor,
  STORAGE_KEYS,
  type DynamicColorTheme,
} from '../utils/dynamicColor';
import { useTheme } from './ThemeContext';

interface DynamicColorContextType {
  /** 현재 소스 컬러 */
  sourceColor: string;
  /** 소스 컬러 변경 */
  setSourceColor: (color: string) => void;
  /** 커스텀 테마 사용 여부 */
  isCustomTheme: boolean;
  /** 기본 테마로 복원 */
  resetToDefault: () => void;
  /** 생성된 테마 */
  theme: DynamicColorTheme | null;
}

const DynamicColorContext = createContext<DynamicColorContextType | undefined>(
  undefined
);

interface DynamicColorProviderProps {
  children: ReactNode;
}

export function DynamicColorProvider({ children }: DynamicColorProviderProps) {
  const { isDark } = useTheme();
  const [sourceColor, setSourceColorState] = useState<string>(DEFAULT_SOURCE_COLOR);
  const [isCustomTheme, setIsCustomTheme] = useState<boolean>(false);
  const [theme, setTheme] = useState<DynamicColorTheme | null>(null);

  // 초기화: localStorage에서 저장된 설정 로드
  useEffect(() => {
    const savedColor = localStorage.getItem(STORAGE_KEYS.sourceColor);
    const savedIsCustom = localStorage.getItem(STORAGE_KEYS.isCustomTheme);

    if (savedColor && isValidHexColor(savedColor) && savedIsCustom === 'true') {
      setSourceColorState(savedColor);
      setIsCustomTheme(true);
    }
  }, []);

  // 테마 생성 및 적용
  useEffect(() => {
    if (isCustomTheme && sourceColor) {
      const newTheme = generateDynamicTheme(sourceColor);
      setTheme(newTheme);
      applyThemeToDocument(newTheme, isDark);
    } else {
      setTheme(null);
      removeThemeFromDocument();
    }
  }, [sourceColor, isCustomTheme, isDark]);

  // 소스 컬러 변경
  const setSourceColor = useCallback((color: string) => {
    if (!isValidHexColor(color)) {
      console.warn('Invalid hex color:', color);
      return;
    }

    setSourceColorState(color);
    setIsCustomTheme(true);
    localStorage.setItem(STORAGE_KEYS.sourceColor, color);
    localStorage.setItem(STORAGE_KEYS.isCustomTheme, 'true');
  }, []);

  // 기본 테마로 복원
  const resetToDefault = useCallback(() => {
    setSourceColorState(DEFAULT_SOURCE_COLOR);
    setIsCustomTheme(false);
    localStorage.removeItem(STORAGE_KEYS.sourceColor);
    localStorage.removeItem(STORAGE_KEYS.isCustomTheme);
    removeThemeFromDocument();
  }, []);

  return (
    <DynamicColorContext.Provider
      value={{
        sourceColor,
        setSourceColor,
        isCustomTheme,
        resetToDefault,
        theme,
      }}
    >
      {children}
    </DynamicColorContext.Provider>
  );
}

export function useDynamicColor(): DynamicColorContextType {
  const context = useContext(DynamicColorContext);
  if (context === undefined) {
    throw new Error('useDynamicColor must be used within a DynamicColorProvider');
  }
  return context;
}
