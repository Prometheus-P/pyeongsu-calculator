/**
 * src/utils/dynamicColor.ts
 * M3 Dynamic Color 시스템 - 소스 컬러로부터 전체 테마 팔레트 생성
 */
import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
  type Theme,
} from '@material/material-color-utilities';

// 기본 소스 컬러 (현재 M3 primary)
export const DEFAULT_SOURCE_COLOR = '#1976D2';

// M3 색상 역할 타입
export type M3ColorRole =
  | 'primary'
  | 'onPrimary'
  | 'primaryContainer'
  | 'onPrimaryContainer'
  | 'secondary'
  | 'onSecondary'
  | 'secondaryContainer'
  | 'onSecondaryContainer'
  | 'tertiary'
  | 'onTertiary'
  | 'tertiaryContainer'
  | 'onTertiaryContainer'
  | 'error'
  | 'onError'
  | 'errorContainer'
  | 'onErrorContainer'
  | 'background'
  | 'onBackground'
  | 'surface'
  | 'onSurface'
  | 'surfaceVariant'
  | 'onSurfaceVariant'
  | 'outline'
  | 'outlineVariant'
  | 'shadow'
  | 'scrim'
  | 'inverseSurface'
  | 'inverseOnSurface'
  | 'inversePrimary';

export interface DynamicColorTheme {
  light: Record<M3ColorRole, string>;
  dark: Record<M3ColorRole, string>;
}

/**
 * 소스 컬러로부터 M3 테마 생성
 */
export function generateTheme(sourceColor: string): Theme {
  const argb = argbFromHex(sourceColor);
  return themeFromSourceColor(argb);
}

/**
 * M3 Theme 객체에서 색상 역할별 hex 값 추출
 */
function extractSchemeColors(
  scheme: Theme['schemes']['light'] | Theme['schemes']['dark']
): Record<M3ColorRole, string> {
  return {
    primary: hexFromArgb(scheme.primary),
    onPrimary: hexFromArgb(scheme.onPrimary),
    primaryContainer: hexFromArgb(scheme.primaryContainer),
    onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),
    secondary: hexFromArgb(scheme.secondary),
    onSecondary: hexFromArgb(scheme.onSecondary),
    secondaryContainer: hexFromArgb(scheme.secondaryContainer),
    onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),
    tertiary: hexFromArgb(scheme.tertiary),
    onTertiary: hexFromArgb(scheme.onTertiary),
    tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
    onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),
    error: hexFromArgb(scheme.error),
    onError: hexFromArgb(scheme.onError),
    errorContainer: hexFromArgb(scheme.errorContainer),
    onErrorContainer: hexFromArgb(scheme.onErrorContainer),
    background: hexFromArgb(scheme.background),
    onBackground: hexFromArgb(scheme.onBackground),
    surface: hexFromArgb(scheme.surface),
    onSurface: hexFromArgb(scheme.onSurface),
    surfaceVariant: hexFromArgb(scheme.surfaceVariant),
    onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),
    outline: hexFromArgb(scheme.outline),
    outlineVariant: hexFromArgb(scheme.outlineVariant),
    shadow: hexFromArgb(scheme.shadow),
    scrim: hexFromArgb(scheme.scrim),
    inverseSurface: hexFromArgb(scheme.inverseSurface),
    inverseOnSurface: hexFromArgb(scheme.inverseOnSurface),
    inversePrimary: hexFromArgb(scheme.inversePrimary),
  };
}

/**
 * 소스 컬러로부터 라이트/다크 테마 색상 추출
 */
export function generateDynamicTheme(sourceColor: string): DynamicColorTheme {
  const theme = generateTheme(sourceColor);
  return {
    light: extractSchemeColors(theme.schemes.light),
    dark: extractSchemeColors(theme.schemes.dark),
  };
}

/**
 * CSS 변수명 매핑 (M3 역할 → CSS 변수명)
 */
const CSS_VAR_MAP: Record<M3ColorRole, string> = {
  primary: '--md-sys-color-primary',
  onPrimary: '--md-sys-color-on-primary',
  primaryContainer: '--md-sys-color-primary-container',
  onPrimaryContainer: '--md-sys-color-on-primary-container',
  secondary: '--md-sys-color-secondary',
  onSecondary: '--md-sys-color-on-secondary',
  secondaryContainer: '--md-sys-color-secondary-container',
  onSecondaryContainer: '--md-sys-color-on-secondary-container',
  tertiary: '--md-sys-color-tertiary',
  onTertiary: '--md-sys-color-on-tertiary',
  tertiaryContainer: '--md-sys-color-tertiary-container',
  onTertiaryContainer: '--md-sys-color-on-tertiary-container',
  error: '--md-sys-color-error',
  onError: '--md-sys-color-on-error',
  errorContainer: '--md-sys-color-error-container',
  onErrorContainer: '--md-sys-color-on-error-container',
  background: '--md-sys-color-background',
  onBackground: '--md-sys-color-on-background',
  surface: '--md-sys-color-surface',
  onSurface: '--md-sys-color-on-surface',
  surfaceVariant: '--md-sys-color-surface-variant',
  onSurfaceVariant: '--md-sys-color-on-surface-variant',
  outline: '--md-sys-color-outline',
  outlineVariant: '--md-sys-color-outline-variant',
  shadow: '--md-sys-color-shadow',
  scrim: '--md-sys-color-scrim',
  inverseSurface: '--md-sys-color-inverse-surface',
  inverseOnSurface: '--md-sys-color-inverse-on-surface',
  inversePrimary: '--md-sys-color-inverse-primary',
};

/**
 * 동적 테마를 CSS 변수로 문서에 적용
 */
export function applyThemeToDocument(
  theme: DynamicColorTheme,
  isDark: boolean
): void {
  const scheme = isDark ? theme.dark : theme.light;
  const root = document.documentElement;

  (Object.entries(scheme) as [M3ColorRole, string][]).forEach(([role, color]) => {
    const cssVar = CSS_VAR_MAP[role];
    if (cssVar) {
      root.style.setProperty(cssVar, color);
    }
  });
}

/**
 * 동적 테마 CSS 변수 제거 (기본 테마로 복원)
 */
export function removeThemeFromDocument(): void {
  const root = document.documentElement;
  Object.values(CSS_VAR_MAP).forEach((cssVar) => {
    root.style.removeProperty(cssVar);
  });
}

/**
 * 프리셋 컬러 팔레트
 */
export const PRESET_COLORS = [
  { name: 'Blue', color: '#1976D2' },
  { name: 'Purple', color: '#6750A4' },
  { name: 'Green', color: '#388E3C' },
  { name: 'Teal', color: '#00796B' },
  { name: 'Orange', color: '#E65100' },
  { name: 'Pink', color: '#C2185B' },
  { name: 'Red', color: '#D32F2F' },
  { name: 'Indigo', color: '#303F9F' },
] as const;

/**
 * 유효한 hex 색상인지 확인
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * LocalStorage 키
 */
export const STORAGE_KEYS = {
  sourceColor: 'pyeong-calc-source-color',
  isCustomTheme: 'pyeong-calc-custom-theme',
} as const;
