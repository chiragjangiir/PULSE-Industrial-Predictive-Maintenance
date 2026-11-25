import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { Layout } from '@/components/layout/Layout';
import { OverviewPage } from '@/pages/OverviewPage';
import { PredictPage } from '@/pages/PredictPage';
import { FleetMonitorPage } from '@/pages/FleetMonitorPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ModelLabPage } from '@/pages/ModelLabPage';
import { ExplainabilityPage } from '@/pages/ExplainabilityPage';
import { MaintenanceAlertsPage } from '@/pages/MaintenanceAlertsPage';
import { DataExplorerPage } from '@/pages/DataExplorerPage';
import { AboutPage } from '@/pages/AboutPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<OverviewPage />} />
            <Route path="fleet" element={<FleetMonitorPage />} />
            <Route path="predict" element={<PredictPage />} />
            <Route path="alerts" element={<MaintenanceAlertsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="model-lab" element={<ModelLabPage />} />
            <Route path="explainability" element={<ExplainabilityPage />} />
            <Route path="explorer" element={<DataExplorerPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
