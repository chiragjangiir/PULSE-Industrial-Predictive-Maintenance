import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { OverviewPage } from './pages/OverviewPage';

// Lazy load secondary routes to optimize initial bundle size & code splitting
const FleetMonitorPage = React.lazy(() => import('./pages/FleetMonitorPage').then(m => ({ default: m.FleetMonitorPage })));
const PredictPage = React.lazy(() => import('./pages/PredictPage').then(m => ({ default: m.PredictPage })));
const MaintenanceAlertsPage = React.lazy(() => import('./pages/MaintenanceAlertsPage').then(m => ({ default: m.MaintenanceAlertsPage })));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const ModelLabPage = React.lazy(() => import('./pages/ModelLabPage').then(m => ({ default: m.ModelLabPage })));
const ExplainabilityPage = React.lazy(() => import('./pages/ExplainabilityPage').then(m => ({ default: m.ExplainabilityPage })));
const DataExplorerPage = React.lazy(() => import('./pages/DataExplorerPage').then(m => ({ default: m.DataExplorerPage })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));

const PageLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
    <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
    <span className="text-xs uppercase font-mono tracking-wider text-slate-500">
      Loading SCADA Telemetry & Models...
    </span>
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
                <Suspense fallback={<PageLoader />}>
                  <FleetMonitorPage />
                </Suspense>
              }
            />
            <Route
              path="predict"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PredictPage />
                </Suspense>
              }
            />
            <Route
              path="alerts"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MaintenanceAlertsPage />
                </Suspense>
              }
            />
            <Route
              path="analytics"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AnalyticsPage />
                </Suspense>
              }
            />
            <Route
              path="model-lab"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ModelLabPage />
                </Suspense>
              }
            />
            <Route
              path="explainability"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ExplainabilityPage />
                </Suspense>
              }
            />
            <Route
              path="explorer"
              element={
                <Suspense fallback={<PageLoader />}>
                  <DataExplorerPage />
                </Suspense>
              }
            />
            <Route
              path="about"
              element={
                <Suspense fallback={<PageLoader />}>
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
