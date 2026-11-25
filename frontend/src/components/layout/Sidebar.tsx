import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  Cpu,
  Layers,
  BarChart3,
  FlaskConical,
  Sparkles,
  AlertTriangle,
  FileSpreadsheet,
  Info,
  ChevronLeft,
  ChevronRight,
  Server,
  Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}) => {
  const { isDemoMode, isBackendHealthy, alerts } = useApp();
  const activeAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  const navGroups: NavGroup[] = [
    {
      group: 'Operations',
      items: [
        { name: 'Command Center', path: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: 'Fleet Monitor', path: '/fleet', icon: <Layers className="w-4 h-4" /> },
        { name: 'Predict & Diagnose', path: '/predict', icon: <Cpu className="w-4 h-4" /> },
        {
          name: 'Maintenance Alerts',
          path: '/alerts',
          icon: <AlertTriangle className="w-4 h-4" />,
          badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
        },
      ],
    },
    {
      group: 'Machine Intelligence',
      items: [
        { name: 'Analytics Studio', path: '/analytics', icon: <BarChart3 className="w-4 h-4" /> },
        { name: 'Model Lab & Eval', path: '/model-lab', icon: <FlaskConical className="w-4 h-4" /> },
        { name: 'Explainability & SHAP', path: '/explainability', icon: <Sparkles className="w-4 h-4" /> },
        { name: 'Batch Data Explorer', path: '/explorer', icon: <FileSpreadsheet className="w-4 h-4" /> },
      ],
    },
    {
      group: 'Documentation',
      items: [
        { name: 'Project & References', path: '/about', icon: <Info className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0b0e14] border-r border-slate-800/90 transition-all duration-200 select-none',
          isCollapsed ? 'w-18' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-[#0d1118]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm shadow-cyan-500/20 flex-shrink-0">
              <Zap className="w-5 h-5 text-black fill-black" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-mono text-base font-bold tracking-wider text-slate-100 leading-tight">
                  PULSE
                </span>
                <span className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">
                  Industrial Intel
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="hidden lg:flex p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  {group.group}
                </div>
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 text-xs font-medium rounded transition-colors relative group',
                      isActive
                        ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/60 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    )
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                  {item.badge !== undefined && !isCollapsed && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40">
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge !== undefined && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* Backend Connectivity Status Widget */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0d1118]">
          <div
            className={cn(
              'rounded p-2 border flex items-center gap-2.5 transition-colors',
              isDemoMode
                ? 'bg-amber-950/20 border-amber-800/40 text-amber-400'
                : isBackendHealthy
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            )}
          >
            <Server className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">
                  {isDemoMode ? 'SIMULATION MODE' : isBackendHealthy ? 'FASTAPI CONNECTED' : 'BACKEND OFFLINE'}
                </span>
                <span className="text-[9px] text-slate-400 font-mono truncate">
                  {isDemoMode ? 'AI4I 2020 Offline Sim' : isBackendHealthy ? 'v1.2.0-xgboost' : 'Falling back to mock'}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
