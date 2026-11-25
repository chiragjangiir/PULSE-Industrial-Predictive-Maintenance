import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  glow?: 'cyan' | 'amber' | 'red' | 'none';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', glow = 'none', children, ...props }, ref) => {
    const baseStyles = 'rounded-lg border text-slate-100 transition-colors';

    const variants = {
      default: 'bg-[#12161f] border-slate-800/90 shadow-sm',
      elevated: 'bg-[#161c26] border-slate-700/80 shadow-md',
      bordered: 'bg-transparent border-slate-800',
    };

    const glowStyles = {
      none: '',
      cyan: 'glow-cyan border-cyan-500/40',
      amber: 'glow-amber border-amber-500/40',
      red: 'glow-red border-rose-500/40',
    };

    return (
      <div ref={ref} className={cn(baseStyles, variants[variant], glowStyles[glow], className)} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={cn('px-5 py-4 border-b border-slate-800/80 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => {
  return (
    <h3 className={cn('text-sm font-semibold tracking-wide uppercase text-slate-200 flex items-center gap-2', className)} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => {
  return (
    <p className={cn('text-xs text-slate-400 mt-0.5', className)} {...props}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={cn('px-5 py-3 border-t border-slate-800/80 bg-slate-900/30 text-xs text-slate-400 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
};
