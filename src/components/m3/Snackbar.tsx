/**
 * M3 Snackbar 컴포넌트
 * https://m3.material.io/components/snackbar/overview
 *
 * 화면 하단에 짧은 메시지를 표시하여 사용자에게 피드백 제공
 */
import { memo, useEffect, type ReactNode } from 'react';

export interface SnackbarProps {
  /** 스낵바 열림 상태 */
  open: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 메시지 내용 */
  message: string;
  /** 액션 버튼 (선택) */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** 닫기 아이콘 표시 여부 (기본: false) */
  showCloseIcon?: boolean;
  /** 자동 닫힘 시간 (ms, 0이면 자동 닫힘 없음, 기본: 4000) */
  autoHideDuration?: number;
  /** 아이콘 (선택) */
  icon?: ReactNode;
  /** 변형 */
  variant?: 'single-line' | 'two-line';
}

function SnackbarComponent({
  open,
  onClose,
  message,
  action,
  showCloseIcon = false,
  autoHideDuration = 4000,
  icon,
  variant = 'single-line',
}: SnackbarProps) {
  // 자동 닫힘
  useEffect(() => {
    if (open && autoHideDuration > 0) {
      const timer = setTimeout(onClose, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-m3-4 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <div
        className={`
          pointer-events-auto
          flex items-center gap-m3-3
          bg-m3-inverse-surface
          text-m3-inverse-on-surface
          rounded-m3-xs
          shadow-m3-3
          px-m3-4
          ${variant === 'two-line' ? 'py-m3-3' : 'py-m3-3'}
          max-w-lg
          animate-slide-up
        `}
      >
        {/* Icon (optional) */}
        {icon && <div className="flex-shrink-0">{icon}</div>}

        {/* Message */}
        <span
          className={`
            flex-1
            text-body-medium
            ${variant === 'two-line' ? 'line-clamp-2' : 'line-clamp-1'}
          `}
        >
          {message}
        </span>

        {/* Action Button (optional) */}
        {action && (
          <button
            onClick={() => {
              action.onClick();
              onClose();
            }}
            className="
              flex-shrink-0
              text-m3-inverse-primary
              text-label-large font-medium
              px-m3-2 py-m3-1
              rounded-m3-xs
              m3-state-layer
              hover:bg-m3-inverse-primary/10
              transition-colors
            "
          >
            {action.label}
          </button>
        )}

        {/* Close Icon (optional) */}
        {showCloseIcon && (
          <button
            onClick={onClose}
            className="
              flex-shrink-0
              p-m3-1
              rounded-full
              m3-state-layer
              hover:bg-m3-inverse-on-surface/10
              transition-colors
            "
            aria-label="닫기"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export const Snackbar = memo(SnackbarComponent);
