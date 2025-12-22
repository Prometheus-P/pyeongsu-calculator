/**
 * M3 Dialog 컴포넌트
 * https://m3.material.io/components/dialogs/overview
 *
 * 모달 다이얼로그로 사용자 주의를 끌고 중요한 정보를 표시하거나 결정을 요청
 */
import {
  memo,
  useEffect,
  useCallback,
  type ReactNode,
  type MouseEvent,
  type KeyboardEvent,
} from 'react';

export interface DialogAction {
  /** 버튼 레이블 */
  label: string;
  /** 클릭 핸들러 */
  onClick: () => void;
  /** 버튼 변형 (기본: text) */
  variant?: 'text' | 'filled' | 'tonal';
  /** 비활성화 상태 */
  disabled?: boolean;
}

export interface DialogProps {
  /** 다이얼로그 열림 상태 */
  open: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 제목 */
  title: string;
  /** 내용 */
  children: ReactNode;
  /** 아이콘 (선택) */
  icon?: ReactNode;
  /** 액션 버튼들 */
  actions?: DialogAction[];
  /** 스크림 클릭으로 닫기 허용 (기본: true) */
  dismissible?: boolean;
  /** 너비 (기본: 'md') */
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'max-w-xs',
  md: 'max-w-sm',
  lg: 'max-w-md',
};

const actionVariantStyles = {
  text: 'text-m3-primary hover:bg-m3-primary/10',
  filled: 'bg-m3-primary text-m3-on-primary hover:shadow-m3-1',
  tonal: 'bg-m3-secondary-container text-m3-on-secondary-container hover:shadow-m3-1',
};

function DialogComponent({
  open,
  onClose,
  title,
  children,
  icon,
  actions = [],
  dismissible = true,
  size = 'md',
}: DialogProps) {
  // ESC 키로 닫기
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape' && dismissible) {
        onClose();
      }
    },
    [onClose, dismissible]
  );

  // 스크림 클릭으로 닫기
  const handleScrimClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && dismissible) {
      onClose();
    }
  };

  // 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-m3-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onKeyDown={handleKeyDown}
    >
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-m3-scrim/40 animate-fade-in"
        onClick={handleScrimClick}
        aria-hidden="true"
      />

      {/* Dialog Container */}
      <div
        className={`
          relative w-full ${sizeStyles[size]}
          bg-m3-surface-container-high
          rounded-m3-xl
          shadow-m3-3
          p-m3-6
          animate-scale-in
        `}
      >
        {/* Icon (optional) */}
        {icon && (
          <div className="flex justify-center mb-m3-4 text-m3-secondary">
            {icon}
          </div>
        )}

        {/* Title */}
        <h2
          id="dialog-title"
          className={`
            text-headline-small text-m3-on-surface
            ${icon ? 'text-center' : ''}
            mb-m3-4
          `}
        >
          {title}
        </h2>

        {/* Content */}
        <div className="text-body-medium text-m3-on-surface-variant mb-m3-6">
          {children}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex justify-end gap-m3-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`
                  px-m3-4 py-m3-2
                  text-label-large font-medium
                  rounded-m3-full
                  transition-all
                  m3-state-layer
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${actionVariantStyles[action.variant || 'text']}
                `}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const Dialog = memo(DialogComponent);
