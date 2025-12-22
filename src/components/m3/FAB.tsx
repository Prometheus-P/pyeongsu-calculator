/**
 * M3 FAB (Floating Action Button) 컴포넌트
 * https://m3.material.io/components/floating-action-button/overview
 */
import { memo, type ReactNode, type ButtonHTMLAttributes } from 'react';

export type FABSize = 'small' | 'medium' | 'large';
export type FABVariant = 'surface' | 'primary' | 'secondary' | 'tertiary';

interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** FAB 크기 */
  size?: FABSize;
  /** FAB 변형 */
  variant?: FABVariant;
  /** 아이콘 */
  icon: ReactNode;
  /** 라벨 (extended FAB용) */
  label?: string;
}

const sizeStyles: Record<FABSize, string> = {
  small: 'w-[40px] h-[40px] rounded-m3-md',
  medium: 'w-[56px] h-[56px] rounded-m3-lg',
  large: 'w-[96px] h-[96px] rounded-m3-xl',
};

const iconSizes: Record<FABSize, string> = {
  small: 'w-5 h-5',
  medium: 'w-6 h-6',
  large: 'w-9 h-9',
};

const variantStyles: Record<FABVariant, string> = {
  surface: 'bg-m3-surface-variant text-m3-on-surface-variant shadow-m3-3',
  primary: 'bg-m3-primary-container text-m3-on-primary-container shadow-m3-3',
  secondary: 'bg-m3-secondary-container text-m3-on-secondary-container shadow-m3-3',
  tertiary: 'bg-m3-tertiary-container text-m3-on-tertiary-container shadow-m3-3',
};

function FABComponent({
  size = 'medium',
  variant = 'primary',
  icon,
  label,
  className = '',
  ...props
}: FABProps) {
  const isExtended = !!label;

  return (
    <button
      type="button"
      className={`
        m3-state-layer
        inline-flex items-center justify-center gap-m3-3
        transition-all duration-200
        hover:shadow-m3-4
        active:shadow-m3-2
        ${isExtended ? `px-m3-4 h-[56px] rounded-m3-lg` : sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      <span className={isExtended ? 'w-6 h-6' : iconSizes[size]}>{icon}</span>
      {label && <span className="text-label-large font-medium pr-m3-1">{label}</span>}
    </button>
  );
}

export const FAB = memo(FABComponent);
