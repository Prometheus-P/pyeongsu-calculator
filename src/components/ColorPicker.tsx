/**
 * src/components/ColorPicker.tsx
 * M3 Dynamic Color 선택 컴포넌트
 */
import { useState, useRef, useEffect, memo } from 'react';
import { useDynamicColor } from '../contexts/DynamicColorContext';
import { PRESET_COLORS, isValidHexColor, DEFAULT_SOURCE_COLOR } from '../utils/dynamicColor';

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

function ColorPickerComponent({ isOpen, onClose }: ColorPickerProps) {
  const { sourceColor, setSourceColor, isCustomTheme, resetToDefault } = useDynamicColor();
  const [customColor, setCustomColor] = useState(sourceColor);
  const popoverRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // ESC 키로 닫기
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  const handlePresetClick = (color: string) => {
    setSourceColor(color);
    setCustomColor(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomColor(value);
    if (isValidHexColor(value)) {
      setSourceColor(value);
    }
  };

  const handleReset = () => {
    resetToDefault();
    setCustomColor(DEFAULT_SOURCE_COLOR);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute top-full right-0 mt-m3-2 w-64 bg-m3-surface border border-m3-outline-variant rounded-m3-lg shadow-m3-3 p-m3-4 z-50"
      role="dialog"
      aria-label="테마 색상 선택"
    >
      <div className="mb-m3-4">
        <h3 className="text-label-large font-semibold text-m3-on-surface mb-m3-2">
          테마 색상
        </h3>
        <p className="text-label-small text-m3-on-surface-variant">
          원하는 색상을 선택하세요
        </p>
      </div>

      {/* 프리셋 컬러 */}
      <div className="grid grid-cols-4 gap-m3-2 mb-m3-4">
        {PRESET_COLORS.map(({ name, color }) => (
          <button
            key={color}
            onClick={() => handlePresetClick(color)}
            className={`
              w-10 h-10 rounded-m3-full transition-all m3-state-layer
              ${sourceColor === color ? 'ring-2 ring-m3-primary ring-offset-2 ring-offset-m3-surface' : ''}
            `}
            style={{ backgroundColor: color }}
            title={name}
            aria-label={`${name} 색상 선택`}
          />
        ))}
      </div>

      {/* 커스텀 컬러 입력 */}
      <div className="mb-m3-4">
        <label className="text-label-medium text-m3-on-surface-variant mb-m3-1 block">
          커스텀 색상
        </label>
        <div className="flex gap-m3-2">
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              setSourceColor(e.target.value);
            }}
            className="w-10 h-10 rounded-m3-sm border border-m3-outline cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={handleCustomColorChange}
            placeholder="#1976D2"
            className="flex-1 px-m3-3 py-m3-2 text-body-small text-m3-on-surface bg-m3-surface border border-m3-outline rounded-m3-sm focus:border-m3-primary focus:ring-1 focus:ring-m3-primary outline-none"
          />
        </div>
      </div>

      {/* 리셋 버튼 */}
      {isCustomTheme && (
        <button
          onClick={handleReset}
          className="w-full py-m3-2 text-label-large text-m3-on-surface-variant hover:text-m3-on-surface hover:bg-m3-surface-variant rounded-m3-sm transition-colors"
        >
          기본 테마로 복원
        </button>
      )}
    </div>
  );
}

export const ColorPicker = memo(ColorPickerComponent);
