import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  unit?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, unit, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-mono text-slate-300 mb-1.5 font-medium">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-[#0a0d13] border rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none transition-colors',
              unit ? 'pr-14' : 'pr-3',
              error
                ? 'border-rose-500/70 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
                : 'border-slate-800 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50',
              className
            )}
            {...props}
          />
          {unit && (
            <div className="absolute right-3 text-xs font-mono text-slate-400 select-none pointer-events-none">
              {unit}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-rose-400 font-mono">{error}</p>}
        {!error && helperText && <p className="mt-1 text-[11px] text-slate-400">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
