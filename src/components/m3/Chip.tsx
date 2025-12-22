/**
 * M3 Chip 컴포넌트
 * https://m3.material.io/components/chips/overview
 */
import { memo, type ReactNode, type ButtonHTMLAttributes } from 'react';

export type ChipVariant = 'assist' | 'filter' | 'input' | 'suggestion';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 칩 변형 */
  variant?: ChipVariant;
  /** 선택 상태 (filter/input 칩) */
  selected?: boolean;
  /** 아이콘 (선택) */
  icon?: ReactNode;
  /** 레이블 */
  children: ReactNode;
}

const variantStyles: Record<ChipVariant, { base: string; selected: string }> = {
  assist: {
    base: 'bg-m3-surface border border-m3-outline text-m3-on-surface',
    selected: 'bg-m3-secondary-container border-transparent text-m3-on-secondary-container',
  },
  filter: {
    base: 'bg-m3-surface-variant border border-m3-outline-variant text-m3-on-surface-variant',
    selected: 'bg-m3-secondary-container border-transparent text-m3-on-secondary-container',
  },
  input: {
    base: 'bg-m3-surface border border-m3-outline text-m3-on-surface',
    selected: 'bg-m3-secondary-container border-transparent text-m3-on-secondary-container',
  },
  suggestion: {
    base: 'bg-m3-surface-variant border border-m3-outline-variant text-m3-on-surface-variant',
    selected: 'bg-m3-primary-container border-transparent text-m3-on-primary-container',
  },
};

function ChipComponent({
  variant = 'suggestion',
  selected = false,
  icon,
  children,
  className = '',
  ...props
}: ChipProps) {
  const styles = variantStyles[variant];

  return (
    <button
      type="button"
      className={`
        m3-state-layer
        inline-flex items-center justify-center gap-m3-2
        px-m3-4 py-m3-2 min-h-[32px]
        rounded-m3-sm
        text-label-large font-medium
        transition-all duration-200
        ${selected ? styles.selected : styles.base}
        ${className}
      `}
      aria-pressed={selected}
      {...props}
    >
      {icon && <span className="w-[18px] h-[18px] -ml-m3-1">{icon}</span>}
      {children}
    </button>
  );
}

export const Chip = memo(ChipComponent);
