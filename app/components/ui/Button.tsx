"use client";

import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0B1B3A]/40";

const variants = {
  primary:
    "inline-flex items-center justify-center rounded-full font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] " +
    focusRing,
  secondary:
    "inline-flex items-center justify-center rounded-full font-semibold border-2 border-white/30 text-white transition-all duration-200 hover:bg-white hover:text-[#0B1B3A] " +
    focusRing,
  ghost:
    "inline-flex items-center justify-center rounded-full font-semibold text-slate-700 transition-colors duration-200 hover:text-[#0B1B3A] " +
    focusRing,
} as const;

type ButtonVariant = keyof typeof variants;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** For primary: pass e.g. style={{ backgroundColor: BRAND.pink }} */
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", type = "button", className, children, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";

/** Focus ring class for CTA links (use with rounded-full, etc.). */
export const focusRingClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0B1B3A]/40";
