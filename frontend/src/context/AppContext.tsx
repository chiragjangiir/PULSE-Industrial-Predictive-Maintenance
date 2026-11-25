import React, { createContext, useContext, useState, useEffect } from 'react';
import { HealthResponse, AlertItem } from '@/types/api';
import { pulseApi } from '@/services/api/pulseApi';
import { mockAlerts, FleetMachineRecord } from '@/services/mock/mockData';

interface Toast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  isBackendHealthy: boolean;
  healthData: HealthResponse | null;
  refreshHealth: () => Promise<void>;
  alerts: AlertItem[];
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  selectedMachine: FleetMachineRecord | null;
  setSelectedMachine: (m: FleetMachineRecord | null) => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(pulseApi.isDemoMode());
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(false);
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    const saved = localStorage.getItem('pulse_alerts');
    return saved ? JSON.parse(saved) : mockAlerts;
  });
  const [selectedMachine, setSelectedMachine] = useState<FleetMachineRecord | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshHealth = async () => {
    try {
      const res = await pulseApi.getHealth();
      setHealthData(res.data);
      setIsBackendHealthy(!res.isSimulated);
    } catch {
      setIsBackendHealthy(false);
    }
  };

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 30000);
    return () => clearInterval(interval);
  }, [isDemoMode]);

  const toggleDemoMode = () => {
    const next = !isDemoMode;
    pulseApi.setDemoMode(next);
    setIsDemoMode(next);
    addToast(
      next ? 'Simulation Mode Activated (Using offline domain benchmark)' : 'Live Mode Activated (Connecting to FastAPI backend)',
      'info'
    );
    refreshHealth();
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' as const } : a));
      localStorage.setItem('pulse_alerts', JSON.stringify(updated));
      return updated;
    });
    addToast(`Alert ${id} acknowledged by operator`, 'warning');
  };

  const resolveAlert = (id: string) => {
    setAlerts((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status: 'RESOLVED' as const } : a));
      localStorage.setItem('pulse_alerts', JSON.stringify(updated));
      return updated;
    });
    addToast(`Alert ${id} marked as resolved`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        isBackendHealthy,
        healthData,
        refreshHealth,
        alerts,
        acknowledgeAlert,
        resolveAlert,
        selectedMachine,
        setSelectedMachine,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
