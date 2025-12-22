import { memo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeEvents } from '../utils/analytics';
import { ColorPicker } from './ColorPicker';
import { useDynamicColor } from '../contexts/DynamicColorContext';

// T024: SVG sun/moon icons for theme toggle
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
      clipRule="evenodd"
    />
  </svg>
);

// T021: Theme toggle with m3-state-layer and T024: SVG icons
export default memo(function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const { isCustomTheme, sourceColor } = useDynamicColor();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleToggle = () => {
    toggleTheme();
    ThemeEvents.toggle(isDark ? 'light' : 'dark');
  };

  const handleColorPickerToggle = () => {
    setIsColorPickerOpen((prev) => !prev);
  };

  return (
    <div className="flex items-center gap-m3-2 relative">
      {/* 색상 선택 버튼 */}
      <button
        onClick={handleColorPickerToggle}
        className="m3-state-layer p-m3-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-m3-full bg-m3-surface-variant text-m3-on-surface-variant transition-colors"
        aria-label="테마 색상 변경"
        aria-expanded={isColorPickerOpen}
      >
        {isCustomTheme ? (
          <div
            className="w-5 h-5 rounded-m3-full border-2 border-m3-outline"
            style={{ backgroundColor: sourceColor }}
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 00-3.471 2.987 10.04 10.04 0 014.815 4.815 18.748 18.748 0 002.987-3.472l3.386-5.079A1.902 1.902 0 0020.599 1.5zm-8.3 14.025a18.76 18.76 0 001.896-1.207 8.026 8.026 0 00-4.513-4.513A18.75 18.75 0 008.475 11.7l-.278.5a5.26 5.26 0 013.601 3.602l.5-.278zM6.75 13.5A3.75 3.75 0 003 17.25a1.5 1.5 0 01-1.601 1.497.75.75 0 00-.7 1.123 5.25 5.25 0 009.8-2.62 3.75 3.75 0 00-3.75-3.75z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* 다크모드 토글 */}
      <button
        onClick={handleToggle}
        className="m3-state-layer p-m3-2 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-m3-full bg-m3-surface-variant text-m3-on-surface-variant transition-colors"
        aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* 색상 선택 팝오버 */}
      <ColorPicker isOpen={isColorPickerOpen} onClose={() => setIsColorPickerOpen(false)} />
    </div>
  );
});
