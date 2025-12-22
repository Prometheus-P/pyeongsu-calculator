/**
 * M3 Card 컴포넌트
 * https://m3.material.io/components/cards/overview
 */
import { memo, type ReactNode, type HTMLAttributes } from 'react';

export type CardVariant = 'elevated' | 'filled' | 'outlined';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 카드 변형 */
  variant?: CardVariant;
  /** 자식 요소 */
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  elevated: 'bg-m3-surface shadow-m3-1',
  filled: 'bg-m3-surface-variant',
  outlined: 'bg-m3-surface border border-m3-outline-variant',
};

function CardComponent({
  variant = 'outlined',
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-m3-md
        p-m3-4
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export const Card = memo(CardComponent);
