import React, { forwardRef, useId } from "react";

/**
 * Input variants
 */
type InputVariant = "default" | "filled" | "ghost";

/**
 * Input sizes
 */
type InputSize = "sm" | "md" | "lg";

/**
 * Input component props
 */
interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /** Visual style variant */
  variant?: InputVariant;
  /** Size of the input */
  size?: InputSize;
  /** Label text */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message (also sets error state) */
  error?: string;
  /** Icon to display at the start */
  leftIcon?: React.ReactNode;
  /** Icon or element to display at the end */
  rightElement?: React.ReactNode;
  /** Make the input take full width */
  fullWidth?: boolean;
}

/**
 * Variant styles mapping - Light theme
 */
const variantStyles: Record<InputVariant, string> = {
  default: `
    bg-white
    border border-[var(--color-border-default)]
    hover:border-[var(--color-border-strong)]
    focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20
  `,
  filled: `
    bg-[var(--color-bg-tertiary)]
    border border-transparent
    hover:bg-[var(--color-bg-hover)]
    focus:bg-white focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20
  `,
  ghost: `
    bg-transparent
    border border-transparent
    hover:bg-[var(--color-bg-hover)]
    focus:bg-white focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20
  `,
};

/**
 * Size styles mapping
 */
const sizeStyles: Record<
  InputSize,
  { input: string; label: string; helper: string }
> = {
  sm: {
    input: "h-8 text-sm px-3 rounded-md",
    label: "text-xs mb-1",
    helper: "text-xs mt-1",
  },
  md: {
    input: "h-10 text-sm px-4 rounded-lg",
    label: "text-sm mb-1.5",
    helper: "text-xs mt-1.5",
  },
  lg: {
    input: "h-12 text-base px-4 rounded-lg",
    label: "text-sm mb-2",
    helper: "text-sm mt-2",
  },
};

/**
 * Error state styles - Light theme
 */
const errorStyles = `
  border-[var(--color-error)]
  hover:border-[var(--color-error)]
  focus:border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]/20
`;

/**
 * Premium Input Component
 *
 * A styled text input component with variants, icons, and validation states,
 * designed for a premium, modern aesthetic.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   helperText="We'll never share your email"
 * />
 *
 * <Input
 *   variant="filled"
 *   leftIcon={<SearchIcon />}
 *   placeholder="Search..."
 * />
 *
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password is required"
 * />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      size = "md",
      label,
      helperText,
      error,
      leftIcon,
      rightElement,
      fullWidth = true,
      className = "",
      disabled,
      id: providedId,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;

    const hasError = !!error;
    const sizeClasses = sizeStyles[size];

    const baseInputStyles = `
      w-full
      text-[var(--color-text-primary)]
      placeholder:text-[var(--color-text-tertiary)]
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none
    `;

    const iconPadding = leftIcon ? "pl-10" : "";
    const rightPadding = rightElement ? "pr-10" : "";

    return (
      <div className={`${fullWidth ? "w-full" : "inline-block"}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`
              block font-medium text-[var(--color-text-secondary)]
              ${sizeClasses.label}
              ${disabled ? "opacity-50" : ""}
            `.trim()}
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input element */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              ${baseInputStyles}
              ${variantStyles[variant]}
              ${sizeClasses.input}
              ${iconPadding}
              ${rightPadding}
              ${hasError ? errorStyles : ""}
              ${className}
            `
              .trim()
              .replace(/\s+/g, " ")}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />

          {/* Right element */}
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
              {rightElement}
            </div>
          )}
        </div>

        {/* Error message */}
        {hasError && (
          <p
            id={`${inputId}-error`}
            className={`text-[var(--color-error)] ${sizeClasses.helper}`}
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className={`text-[var(--color-text-tertiary)] ${sizeClasses.helper}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

/**
 * Textarea component props
 */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visual style variant */
  variant?: InputVariant;
  /** Label text */
  label?: string;
  /** Helper text displayed below the textarea */
  helperText?: string;
  /** Error message (also sets error state) */
  error?: string;
  /** Make the textarea take full width */
  fullWidth?: boolean;
}

/**
 * Premium Textarea Component
 *
 * A styled textarea component matching the Input design.
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = "default",
      label,
      helperText,
      error,
      fullWidth = true,
      className = "",
      disabled,
      id: providedId,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = providedId || generatedId;

    const hasError = !!error;

    const baseStyles = `
      w-full min-h-[120px] p-4
      text-sm text-[var(--color-text-primary)]
      placeholder:text-[var(--color-text-tertiary)]
      rounded-lg resize-y
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none
    `;

    return (
      <div className={`${fullWidth ? "w-full" : "inline-block"}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={`
              block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5
              ${disabled ? "opacity-50" : ""}
            `.trim()}
          >
            {label}
          </label>
        )}

        {/* Textarea element */}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={`
            ${baseStyles}
            ${variantStyles[variant]}
            ${hasError ? errorStyles : ""}
            ${className}
          `
            .trim()
            .replace(/\s+/g, " ")}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${textareaId}-error`
              : helperText
                ? `${textareaId}-helper`
                : undefined
          }
          {...props}
        />

        {/* Error message */}
        {hasError && (
          <p
            id={`${textareaId}-error`}
            className="text-xs text-[var(--color-error)] mt-1.5"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {!hasError && helperText && (
          <p
            id={`${textareaId}-helper`}
            className="text-xs text-[var(--color-text-tertiary)] mt-1.5"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export {
  Input,
  Textarea,
  type InputProps,
  type TextareaProps,
  type InputVariant,
  type InputSize,
};

export default Input;
