/**
 * Congress Flow Design System
 * Premium design tokens for an Apple-inspired light theme
 */

// Color Palette - Inspired by Apple's design language
export const colors = {
  // Background layers (lightest to slightly darker)
  background: {
    primary: "#ffffff", // Main app background
    secondary: "#f9fafb", // Card backgrounds
    tertiary: "#f3f4f6", // Elevated surfaces
    elevated: "#ffffff", // Modals, dropdowns
    hover: "#f3f4f6", // Hover states
  },

  // Border colors - Minimal, subtle
  border: {
    subtle: "rgba(0, 0, 0, 0.04)",
    default: "rgba(0, 0, 0, 0.08)",
    strong: "rgba(0, 0, 0, 0.12)",
    focus: "rgba(59, 130, 246, 0.5)",
  },

  // Text hierarchy
  text: {
    primary: "#111827", // Main text
    secondary: "#4b5563", // Secondary text
    tertiary: "#9ca3af", // Muted text
    disabled: "#d1d5db", // Disabled state
    inverse: "#ffffff", // Text on dark backgrounds
  },

  // Affirmative side - Sky blue
  affirmative: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Primary
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49",
    glow: "rgba(14, 165, 233, 0.15)",
    subtle: "rgba(14, 165, 233, 0.08)",
  },

  // Negative side - Rose
  negative: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e", // Primary
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
    950: "#4c0519",
    glow: "rgba(244, 63, 94, 0.15)",
    subtle: "rgba(244, 63, 94, 0.08)",
  },

  // Accent - Blue (Apple-style)
  accent: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Primary
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
    glow: "rgba(59, 130, 246, 0.15)",
  },

  // Refutation - Red
  refutation: {
    500: "#ef4444",
    glow: "rgba(239, 68, 68, 0.15)",
  },

  // Post-it note colors
  postit: {
    affirmative: "#fef3c7", // Warm yellow
    negative: "#dbeafe", // Soft blue
  },

  // Semantic colors
  success: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981", // Primary
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    subtle: "rgba(16, 185, 129, 0.08)",
  },

  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // Primary
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    subtle: "rgba(245, 158, 11, 0.08)",
  },

  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444", // Primary
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    subtle: "rgba(239, 68, 68, 0.08)",
  },
} as const;

// Typography scale
export const typography = {
  fontFamily: {
    sans: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "sans-serif",
    ],
    mono: ["JetBrains Mono", "SF Mono", "Monaco", "Consolas", "monospace"],
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
    "5xl": ["3rem", { lineHeight: "1" }],
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
  },
} as const;

// Spacing scale
export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  11: "2.75rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
  44: "11rem",
  48: "12rem",
  52: "13rem",
  56: "14rem",
  60: "15rem",
  64: "16rem",
  72: "18rem",
  80: "20rem",
  96: "24rem",
} as const;

// Border radius
export const borderRadius = {
  none: "0",
  sm: "0.25rem",
  DEFAULT: "0.5rem",
  md: "0.625rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
  "3xl": "1.5rem",
  full: "9999px",
} as const;

// Shadows - Soft, Apple-style
export const shadows = {
  none: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.04)",
  DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.12)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)",
  // Post-it note shadow
  postit: "0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)",
  // Glow effects for accents
  "glow-blue": "0 0 16px rgba(59, 130, 246, 0.2)",
  "glow-rose": "0 0 16px rgba(244, 63, 94, 0.2)",
  "glow-red": "0 0 16px rgba(239, 68, 68, 0.2)",
} as const;

// Animation durations and easings
export const animation = {
  duration: {
    fastest: "50ms",
    faster: "100ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "400ms",
    slowest: "500ms",
  },
  easing: {
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const;

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Export theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  zIndex,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
