import React, { forwardRef } from "react";

/**
 * Card variants for different visual styles
 */
type CardVariant =
  | "default"
  | "glass"
  | "elevated"
  | "outline"
  | "affirmative"
  | "negative";

/**
 * Card padding sizes
 */
type CardPadding = "none" | "sm" | "md" | "lg";

/**
 * Card component props
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: CardVariant;
  /** Padding size */
  padding?: CardPadding;
  /** Whether the card is interactive (hoverable) */
  interactive?: boolean;
  /** Whether the card has a subtle gradient border on hover */
  gradientBorder?: boolean;
  /** As which element to render */
  as?: "div" | "article" | "section";
}

/**
 * Variant styles mapping - Light theme, minimal borders
 */
const variantStyles: Record<CardVariant, string> = {
  default: `
    bg-white
    shadow-[var(--shadow-card)]
  `,
  glass: `
    bg-white/80
    backdrop-blur-xl
    shadow-[var(--shadow-card)]
  `,
  elevated: `
    bg-white
    shadow-[var(--shadow-card-hover)]
  `,
  outline: `
    bg-transparent
    border border-[var(--color-border-default)]
  `,
  affirmative: `
    bg-[var(--color-postit-affirmative)]
    shadow-[var(--shadow-postit)]
  `,
  negative: `
    bg-[var(--color-postit-negative)]
    shadow-[var(--shadow-postit)]
  `,
};

/**
 * Padding styles mapping
 */
const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4 sm:p-5",
  lg: "p-5 sm:p-6 lg:p-8",
};

/**
 * Interactive styles - Light theme
 */
const interactiveStyles = `
  cursor-pointer
  transition-all duration-200 ease-out
  hover:shadow-[var(--shadow-card-hover)]
  hover:-translate-y-0.5
  active:translate-y-0
  active:shadow-[var(--shadow-card)]
`;

/**
 * Gradient border effect (for premium feel) - Light theme
 */
const gradientBorderStyles = `
  relative
  before:absolute before:inset-0 before:rounded-[inherit] before:p-[1px]
  before:bg-gradient-to-br before:from-black/5 before:via-transparent before:to-black/2
  before:opacity-0 before:transition-opacity before:duration-300
  before:-z-10 before:pointer-events-none
  hover:before:opacity-100
`;

/**
 * Card Header component
 */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional title */
  title?: string;
  /** Optional description */
  description?: string;
  /** Action element (e.g., button) */
  action?: React.ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, description, action, children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-start justify-between gap-4 ${className}`}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-lg font-semibold text-foreground-primary truncate">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-foreground-tertiary line-clamp-2">
              {description}
            </p>
          )}
          {children}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

/**
 * Card Content component
 */
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div ref={ref} className={`${className}`} {...props}>
        {children}
      </div>
    );
  },
);

CardContent.displayName = "CardContent";

/**
 * Card Footer component
 */
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Align items */
  align?: "left" | "center" | "right" | "between";
}

const alignStyles: Record<string, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
  between: "justify-between",
};

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ align = "right", children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          flex items-center gap-3 pt-4
          ${alignStyles[align]}
          ${className}
        `
          .trim()
          .replace(/\s+/g, " ")}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardFooter.displayName = "CardFooter";

/**
 * Premium Card Component
 *
 * A versatile card component with glass-morphism effects and subtle gradients,
 * designed for a premium, modern aesthetic.
 *
 * @example
 * ```tsx
 * <Card variant="glass" padding="md" interactive>
 *   <CardHeader title="Card Title" description="Card description" />
 *   <CardContent>
 *     Card content goes here
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      interactive = false,
      gradientBorder = false,
      as: Component = "div",
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles = "rounded-xl overflow-hidden";

    return (
      <Component
        ref={ref}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${interactive ? interactiveStyles : ""}
          ${gradientBorder ? gradientBorderStyles : ""}
          ${className}
        `
          .trim()
          .replace(/\s+/g, " ")}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Card.displayName = "Card";

// Compound component exports
export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  type CardProps,
  type CardHeaderProps,
  type CardContentProps,
  type CardFooterProps,
  type CardVariant,
  type CardPadding,
};

export default Card;
