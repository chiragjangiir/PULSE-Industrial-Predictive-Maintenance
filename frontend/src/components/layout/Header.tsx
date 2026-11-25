import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { Menu, Bell, RefreshCw, Cpu, Activity, Database, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuOpen }) => {
  const location = useLocation();
  const { isDemoMode, toggleDemoMode, isBackendHealthy, refreshHealth, alerts } = useApp();
  const [timeStr, setTimeStr] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString(undefined, {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC'
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshHealth();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Fleet Command Center', category: 'Operations' };
      case '/fleet':
        return { title: 'Fleet Telemetry Monitor', category: 'Operations' };
      case '/predict':
        return { title: 'Machine Intelligence & Prediction', category: 'Operations' };
      case '/alerts':
        return { title: 'Maintenance & Alerts Hub', category: 'Operations' };
      case '/analytics':
        return { title: 'Analytics Studio & Sensor Relations', category: 'Machine Intelligence' };
      case '/model-lab':
        return { title: 'Model Lab & Validation Benchmarks', category: 'Machine Intelligence' };
      case '/explainability':
        return { title: 'Explainability & TreeSHAP Attribution', category: 'Machine Intelligence' };
      case '/explorer':
        return { title: 'Batch Data Explorer & CSV Preds', category: 'Machine Intelligence' };
      case '/about':
        return { title: 'System Architecture & References', category: 'Platform' };
      default:
        return { title: 'Industrial Intelligence', category: 'Platform' };
    }
  };

  const pageInfo = getPageInfo();
  const unreadAlerts = alerts.filter((a) => a.status === 'ACTIVE').length;

  return (
    <header className="h-16 bg-[#0c1017] border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between z-30 select-none">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span>PULSE</span>
            <span>/</span>
            <span className="text-slate-400">{pageInfo.category}</span>
          </div>
          <h1 className="text-base font-semibold text-slate-100 tracking-tight leading-none mt-0.5">
            {pageInfo.title}
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Real-time Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{timeStr || 'LIVE TELEMETRY'}</span>
        </div>

        {/* Demo Mode Toggle */}
        <button
          onClick={toggleDemoMode}
          title="Toggle Simulation vs Live FastAPI backend connection"
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-medium transition-all',
            isDemoMode
              ? 'bg-amber-950/40 text-amber-300 border-amber-700/60 hover:bg-amber-900/50'
              : 'bg-emerald-950/40 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/50'
          )}
        >
          {isDemoMode ? <AlertOctagon className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isDemoMode ? 'SIMULATION MODE' : 'LIVE API'}</span>
        </button>

        {/* Manual Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 transition-colors"
          title="Refresh health and telemetry"
        >
          <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin text-cyan-400')} />
        </button>

        {/* Alerts Bell */}
        <Link
          to="/alerts"
          className="relative p-2 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 transition-colors"
          title="Active Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadAlerts > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-mono font-bold text-white flex items-center justify-center animate-pulse">
              {unreadAlerts}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};
