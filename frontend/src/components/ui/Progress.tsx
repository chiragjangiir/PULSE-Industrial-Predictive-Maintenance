import React from 'react';
import { cn } from '@/utils/cn';

export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  threshold?: number; // e.g. 42 for 0.42
  variant?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'risk';
  showValue?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  threshold,
  variant = 'cyan',
  showValue = false,
  className,
  size = 'md',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  let barColor = 'bg-cyan-500';
  if (variant === 'risk') {
    if (percentage >= 70) barColor = 'bg-rose-500';
    else if (percentage >= 42) barColor = 'bg-amber-500';
    else barColor = 'bg-emerald-500';
  } else if (variant === 'emerald') {
    barColor = 'bg-emerald-500';
  } else if (variant === 'amber') {
    barColor = 'bg-amber-500';
  } else if (variant === 'rose') {
    barColor = 'bg-rose-500';
  }

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('relative w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800', heights[size])}>
        <div
          className={cn('h-full transition-all duration-300 rounded-full', barColor)}
          style={{ width: `${percentage}%` }}
        />
        {threshold !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-400 z-10"
            style={{ left: `${(threshold / max) * 100}%` }}
            title={`Threshold: ${threshold}%`}
          />
        )}
      </div>
      {showValue && (
        <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-1">
          <span>0%</span>
          <span className="font-semibold text-slate-200">{percentage.toFixed(1)}%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
};
