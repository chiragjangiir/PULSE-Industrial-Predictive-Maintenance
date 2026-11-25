import React from 'react';
import { cn } from '../../utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  accentColor?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'cyan',
  className,
}) => {
  const accentBorders = {
    cyan: 'border-l-sky-500/70',
    emerald: 'border-l-emerald-500/70',
    amber: 'border-l-amber-500/70',
    rose: 'border-l-rose-500/80',
    slate: 'border-l-slate-600',
  };

  const accentIcons = {
    cyan: 'text-sky-400 bg-slate-900 border-slate-800',
    emerald: 'text-emerald-400 bg-slate-900 border-slate-800',
    amber: 'text-amber-400 bg-slate-900 border-slate-800',
    rose: 'text-rose-400 bg-slate-900 border-slate-800',
    slate: 'text-slate-400 bg-slate-900 border-slate-800',
  };

  return (
    <div
      className={cn(
        'relative bg-[#111622] border border-slate-800/90 border-l-2 rounded p-3.5 shadow-xs transition-colors hover:border-slate-700',
        accentBorders[accentColor],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{title}</span>
          <div className="text-xl font-bold font-mono tracking-tight text-slate-100 mt-0.5 tabular-nums">{value}</div>
        </div>
        {icon && (
          <div className={cn('p-1.5 rounded border', accentIcons[accentColor])}>
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px]">
          {subtitle && <span className="text-slate-400 truncate">{subtitle}</span>}
          {trend && (
            <span
              className={cn(
                'font-mono text-[10px] font-medium tabular-nums flex items-center gap-0.5',
                trend.isNeutral
                  ? 'text-slate-400'
                  : trend.isPositive
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
