import React from 'react';
import { cn } from '@/utils/cn';
import { RiskLevel } from '@/types/api';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-mono font-medium rounded border transition-colors';

  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    cyan: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/80',
    emerald: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80',
    amber: 'bg-amber-950/60 text-amber-400 border-amber-800/80',
    rose: 'bg-rose-950/60 text-rose-400 border-rose-800/80',
    slate: 'bg-slate-900 text-slate-400 border-slate-800',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 leading-tight',
    md: 'text-xs px-2.5 py-1 leading-normal',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};

export const RiskBadge: React.FC<{ level: RiskLevel; size?: 'sm' | 'md' }> = ({ level, size = 'md' }) => {
  switch (level) {
    case 'CRITICAL':
      return (
        <Badge variant="rose" size={size} className="gap-1.5 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          CRITICAL
        </Badge>
      );
    case 'HIGH':
      return (
        <Badge variant="amber" size={size} className="gap-1.5 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          HIGH RISK
        </Badge>
      );
    case 'MEDIUM':
      return (
        <Badge variant="amber" size={size} className="gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
          MEDIUM RISK
        </Badge>
      );
    case 'LOW':
    default:
      return (
        <Badge variant="emerald" size={size} className="gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          LOW RISK
        </Badge>
      );
  }
};

export const MachineStatusBadge: React.FC<{ status: 'OPERATIONAL' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE' }> = ({
  status,
}) => {
  switch (status) {
    case 'CRITICAL':
      return (
        <Badge variant="rose" size="sm" className="font-semibold gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          CRITICAL
        </Badge>
      );
    case 'WARNING':
      return (
        <Badge variant="amber" size="sm" className="gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          WARNING
        </Badge>
      );
    case 'MAINTENANCE':
      return (
        <Badge variant="cyan" size="sm" className="gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          MAINTENANCE
        </Badge>
      );
    case 'OPERATIONAL':
    default:
      return (
        <Badge variant="emerald" size="sm" className="gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          OPERATIONAL
        </Badge>
      );
  }
};
