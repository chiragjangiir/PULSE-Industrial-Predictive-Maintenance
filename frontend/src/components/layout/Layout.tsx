import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MachineDetailDrawer } from '../machines/MachineDetailDrawer';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { toasts, removeToast } = useApp();

  return (
    <div className="flex h-screen bg-[#090b0e] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header onMobileMenuOpen={() => setIsMobileOpen(true)} />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto bg-industrial-grid p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Slide-in Machine Inspection Drawer */}
      <MachineDetailDrawer />

      {/* Global Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
            warning: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
            error: <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0" />,
            info: <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />,
          };

          const borders = {
            success: 'border-emerald-800/80 bg-[#0d1614]',
            warning: 'border-amber-800/80 bg-[#17140e]',
            error: 'border-rose-800/80 bg-[#180e12]',
            info: 'border-cyan-800/80 bg-[#0c141a]',
          };

          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto p-3 rounded-lg border shadow-xl flex items-start gap-2.5 text-xs text-slate-200 animate-in slide-in-from-bottom-3 duration-200',
                borders[toast.type]
              )}
            >
              <div className="mt-0.5">{icons[toast.type]}</div>
              <div className="flex-1 leading-relaxed">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-100 p-0.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
