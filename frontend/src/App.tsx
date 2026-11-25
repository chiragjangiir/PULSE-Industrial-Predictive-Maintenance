import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';

// Immediate load for primary command center
import { OverviewPage } from './pages/OverviewPage';

// Code-split secondary views for optimized production bundle size
const PredictPage = lazy(() => import('./pages/PredictPage').then(m => ({ default: m.PredictPage })));
const FleetMonitorPage = lazy(() => import('./pages/FleetMonitorPage').then(m => ({ default: m.FleetMonitorPage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const ModelLabPage = lazy(() => import('./pages/ModelLabPage').then(m => ({ default: m.ModelLabPage })));
const ExplainabilityPage = lazy(() => import('./pages/ExplainabilityPage').then(m => ({ default: m.ExplainabilityPage })));
const MaintenanceAlertsPage = lazy(() => import('./pages/MaintenanceAlertsPage').then(m => ({ default: m.MaintenanceAlertsPage })));
const DataExplorerPage = lazy(() => import('./pages/DataExplorerPage').then(m => ({ default: m.DataExplorerPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));

const RouteLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono text-slate-400">LOADING TELEMETRY MODULE...</span>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<OverviewPage />} />
            <Route
              path="fleet"
              element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <FleetMonitorPage />
                </Suspense>
              }
            />
            <Route
              path="predict"
              element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <PredictPage />
                </Suspense>
              }
            />
            <Route
              path="alerts"
              element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <MaintenanceAlertsPage />
                </Suspense>
              }
            />
            <Route
              path="analytics"
              element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <AnalyticsPage />
                </Suspense>
              }
            />
            <Route
              path="model-lab"
              element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <ModelLabPage />
                </Suspense>
              }
            />
            <Route
              path="explainability"
              element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <ExplainabilityPage />
                </Suspense>
              }
            />
            <Route
              path="explorer"
              element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <DataExplorerPage />
                </Suspense>
              }
            />
            <Route
              path="about"
              element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <AboutPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
