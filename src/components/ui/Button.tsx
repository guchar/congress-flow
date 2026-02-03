import React, { forwardRef } from "react";

/**
 * Button variants for different use cases
 */
type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "affirmative"
  | "negative";

/**
 * Button sizes
 */
type ButtonSize = "sm" | "md" | "lg" | "icon";

/**
 * Button component props
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Icon to display before the label */
  leftIcon?: React.ReactNode;
  /** Icon to display after the label */
  rightIcon?: React.ReactNode;
  /** Make the button take full width */
  fullWidth?: boolean;
}

/**
 * Variant styles mapping - Light theme
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--color-accent)]
    text-white
    shadow-sm
    hover:bg-[var(--color-accent)]/90
    hover:shadow-md
    active:bg-[var(--color-accent)]/80
    focus-visible:ring-[var(--color-accent)]
  `,
  secondary: `
    bg-[var(--color-bg-tertiary)]
    text-[var(--color-text-primary)]
    hover:bg-[var(--color-bg-hover)]
    active:bg-[var(--color-bg-tertiary)]
    focus-visible:ring-[var(--color-accent)]
  `,
  ghost: `
    bg-transparent
    text-[var(--color-text-secondary)]
    hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]
    active:bg-[var(--color-bg-tertiary)]
    focus-visible:ring-[var(--color-accent)]
  `,
  destructive: `
    bg-[var(--color-error)]
    text-white
    shadow-sm
    hover:bg-[var(--color-error)]/90
    hover:shadow-md
    active:bg-[var(--color-error)]/80
    focus-visible:ring-[var(--color-error)]
  `,
  affirmative: `
    bg-[var(--color-affirmative)]
    text-white
    shadow-sm
    hover:bg-[var(--color-affirmative)]/90
    hover:shadow-md
    active:bg-[var(--color-affirmative)]/80
    focus-visible:ring-[var(--color-affirmative)]
  `,
  negative: `
    bg-[var(--color-negative)]
    text-white
    shadow-sm
    hover:bg-[var(--color-negative)]/90
    hover:shadow-md
    active:bg-[var(--color-negative)]/80
    focus-visible:ring-[var(--color-negative)]
  `,
};

/**
 * Size styles mapping
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-lg",
  icon: "h-10 w-10 rounded-lg p-0",
};

/**
 * Loading spinner component
 */
const LoadingSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const spinnerSize =
    size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";

  return (
    <svg
      className={`${spinnerSize} animate-spin`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

/**
 * Premium Button Component
 *
 * A versatile button component with multiple variants and sizes,
 * designed for a premium, modern aesthetic.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 *
 * <Button variant="affirmative" leftIcon={<CheckIcon />}>
 *   Approve
 * </Button>
 *
 * <Button variant="destructive" isLoading>
 *   Deleting...
 * </Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center
      font-medium
      transition-all duration-200 ease-out
      transform active:scale-[0.98]
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      focus-visible:ring-offset-background-primary
      disabled:opacity-50 disabled:pointer-events-none disabled:transform-none
      select-none
    `;

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${widthStyles}
          ${className}
        `
          .trim()
          .replace(/\s+/g, " ")}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size={size} />
            {children && <span className="ml-1.5">{children}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
export default Button;
