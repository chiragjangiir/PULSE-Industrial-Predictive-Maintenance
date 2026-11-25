import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded border';

    const variants = {
      primary:
        'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/20 hover:border-cyan-400 active:bg-cyan-500/30 shadow-sm shadow-cyan-950/50',
      secondary:
        'bg-slate-800/80 text-slate-200 border-slate-700/80 hover:bg-slate-800 hover:text-white hover:border-slate-600 active:bg-slate-700',
      outline:
        'bg-transparent text-slate-300 border-slate-700 hover:bg-slate-800/50 hover:text-white hover:border-slate-600',
      danger:
        'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-400 active:bg-rose-500/30',
      ghost:
        'bg-transparent text-slate-400 border-transparent hover:bg-slate-800/60 hover:text-slate-200',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-sm px-3.5 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
