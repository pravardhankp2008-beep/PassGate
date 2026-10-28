import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'cyber' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-6 py-2.5 gap-2.5 h-12'
  };

  const variantStyles = {
    // Tactile Cyan Pill (DESIGN.md Primary)
    primary: 'bg-gradient-to-r from-[#00c2e8] to-[#0098b8] hover:from-[#00b4d8] hover:to-[#008ba8] text-white shadow-[0_8px_20px_-2px_rgba(0,194,232,0.42)] hover:shadow-[0_12px_28px_-2px_rgba(0,194,232,0.55)] border border-white/50 hover:-translate-y-0.5',
    // Hydro-Glass Pill (DESIGN.md Secondary)
    secondary: 'bg-white/85 hover:bg-white text-[#0d0e1e] border border-cyan-400/30 hover:border-cyan-400/60 shadow-[0_4px_14px_rgba(45,49,78,0.06)] hover:shadow-[0_8px_20px_rgba(0,194,232,0.16)] hover:-translate-y-0.5 backdrop-blur-md',
    // Electric Lilac / Cyber Tactile
    cyber: 'bg-gradient-to-r from-[#8b52ec] via-[#7135d1] to-[#00c2e8] hover:brightness-105 text-white shadow-[0_8px_20px_-2px_rgba(139,82,236,0.38)] hover:shadow-[0_12px_28px_-2px_rgba(139,82,236,0.5)] border border-white/40 hover:-translate-y-0.5',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_8px_20px_-2px_rgba(225,29,72,0.35)] focus:ring-rose-400',
    ghost: 'bg-transparent hover:bg-indigo-50/80 text-[#2d314e] hover:text-[#0d0e1e]',
    outline: 'bg-white/60 border border-cyan-500/40 hover:border-cyan-500 text-[#00677d] hover:bg-cyan-50/60 shadow-sm'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
