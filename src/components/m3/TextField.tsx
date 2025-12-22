/**
 * M3 TextField 컴포넌트 (Outlined variant)
 * https://m3.material.io/components/text-fields/overview
 */
import { memo, forwardRef, type InputHTMLAttributes, useId } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 라벨 */
  label: string;
  /** 지원 텍스트 */
  supportingText?: string;
  /** 에러 상태 */
  error?: boolean;
  /** 에러 메시지 */
  errorText?: string;
  /** 접두사 텍스트 */
  prefix?: string;
  /** 접미사 텍스트 */
  suffix?: string;
  /** 컨테이너 클래스 */
  containerClassName?: string;
}

const TextFieldComponent = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      supportingText,
      error = false,
      errorText,
      prefix,
      suffix,
      containerClassName = '',
      className = '',
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    const borderColor = error
      ? 'border-m3-error focus-within:border-m3-error'
      : 'border-m3-outline focus-within:border-m3-primary';

    const labelColor = error
      ? 'text-m3-error'
      : 'text-m3-on-surface-variant group-focus-within:text-m3-primary';

    return (
      <div className={`relative ${containerClassName}`}>
        <div
          className={`
            group relative
            border ${borderColor} rounded-m3-xs
            bg-m3-surface
            transition-colors duration-200
            focus-within:ring-1 ${error ? 'focus-within:ring-m3-error' : 'focus-within:ring-m3-primary'}
          `}
        >
          {/* Floating Label */}
          <label
            htmlFor={id}
            className={`
              absolute left-m3-4 -top-m3-2
              px-m3-1 bg-m3-surface
              text-label-small ${labelColor}
              transition-colors duration-200
              pointer-events-none
            `}
          >
            {label}
          </label>

          {/* Input Container */}
          <div className="flex items-center px-m3-4">
            {prefix && (
              <span className="text-body-large text-m3-on-surface-variant mr-m3-1">
                {prefix}
              </span>
            )}
            <input
              ref={ref}
              id={id}
              className={`
                w-full py-m3-4
                bg-transparent
                text-body-large text-m3-on-surface
                placeholder:text-m3-on-surface-variant/50
                outline-none
                ${className}
              `}
              aria-invalid={error}
              aria-describedby={supportingText || errorText ? `${id}-supporting` : undefined}
              {...props}
            />
            {suffix && (
              <span className="text-body-large text-m3-on-surface-variant ml-m3-1">
                {suffix}
              </span>
            )}
          </div>
        </div>

        {/* Supporting/Error Text */}
        {(supportingText || errorText) && (
          <p
            id={`${id}-supporting`}
            className={`
              mt-m3-1 px-m3-4
              text-label-small
              ${error ? 'text-m3-error' : 'text-m3-on-surface-variant'}
            `}
          >
            {error && errorText ? errorText : supportingText}
          </p>
        )}
      </div>
    );
  }
);

TextFieldComponent.displayName = 'TextField';

export const TextField = memo(TextFieldComponent);
