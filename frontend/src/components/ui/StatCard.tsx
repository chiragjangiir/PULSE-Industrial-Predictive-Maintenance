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
    cyan: 'border-l-cyan-500',
    emerald: 'border-l-emerald-500',
    amber: 'border-l-amber-500',
    rose: 'border-l-rose-500',
    slate: 'border-l-slate-600',
  };

  const accentIcons = {
    cyan: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40',
    emerald: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
    amber: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
    rose: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
    slate: 'text-slate-400 bg-slate-900 border-slate-800',
  };

  return (
    <div
      className={cn(
        'relative bg-[#12161f] border border-slate-800/90 border-l-4 rounded-lg p-4 shadow-sm transition-all hover:border-slate-700/80',
        accentBorders[accentColor],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">{title}</span>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-100 mt-1">{value}</div>
        </div>
        {icon && (
          <div className={cn('p-2 rounded border', accentIcons[accentColor])}>
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-400 truncate">{subtitle}</span>}
          {trend && (
            <span
              className={cn(
                'font-mono text-[11px] font-semibold flex items-center gap-0.5',
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
