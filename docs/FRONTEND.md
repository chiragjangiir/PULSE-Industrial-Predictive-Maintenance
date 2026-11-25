# PULSE Frontend Architecture & Developer Guide

## 1. Overview
The **PULSE Frontend** is an industrial-grade intelligence and predictive maintenance dashboard application built with **React 19**, **Vite 8**, **TypeScript**, and **Tailwind CSS 4**. It provides operators, plant supervisors, and reliability engineers with interactive telemetry visualization, single and batch machine failure diagnosis, cross-model benchmarking, and TreeSHAP explainability.

---

## 2. Tech Stack & Libraries
- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite 8
- **Styling:** Tailwind CSS 4 with custom dark graphite industrial design system
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (Sensor trends, ROC/PR operating curves, feature attributions, torque-speed scatter)
- **Forms & Validation:** React Hook Form + Zod
- **Testing:** Vitest + React Testing Library + JSDOM

---

## 3. Directory Structure
```
frontend/
  src/
    components/
      layout/
        Sidebar.tsx         # Collapsible industrial sidebar with navigation groups
        Header.tsx          # Real-time UTC clock, breadcrumbs, live/demo switch
        Layout.tsx          # Root layout with toasts, drawer, and grid canvas
      ui/                   # Reusable Design System Primitives
        Button.tsx          # Multi-variant button with loading spinner
        Badge.tsx           # Risk tier (CRITICAL/HIGH/MED/LOW) & status badges
        Card.tsx            # Industrial dark surface cards with glow borders
        StatCard.tsx        # High-density metric tiles with trend deltas
        Drawer.tsx          # Slide-in inspection panel for telemetry
        Modal.tsx           # Accessible dialog with ESC dismissal
        Progress.tsx        # Precision progress meter with decision cutoff ticks
        Input.tsx           # Telemetry inputs with units and validation states
        Tooltip.tsx         # Accessible technical parameter tooltips
        Tabs.tsx            # Segmented switcher for operational views
      charts/               # Specialized Industrial Visualizations
        SensorTrendChart.tsx        # Multi-axis sensor telemetry time series
        FailureDistributionChart.tsx# AI4I failure modes breakdown
        RocPrChart.tsx              # Interactive ROC and PR curves with cutoff
        ConfusionMatrixChart.tsx    # 2x2 matrix with precision/catch rate
        FeatureImportanceChart.tsx  # Horizontal TreeSHAP attribution ranking
        TorqueSpeedScatter.tsx      # Operational envelope scatter & stall boundaries
      machines/
        MachineDetailDrawer.tsx     # Full machine telemetry inspection drawer
    pages/                  # All 9 Functional Views
      OverviewPage.tsx              # Command center fleet KPIs and alert queue
      PredictPage.tsx               # Interactive machine diagnostic sandbox
      FleetMonitorPage.tsx          # Multi-attribute machine list/grid and filter
      AnalyticsPage.tsx             # Sensor distributions and physics envelope
      ModelLabPage.tsx              # Cross-model evaluation and cutoff simulator
      ExplainabilityPage.tsx        # TreeSHAP attributions and physical mechanics
      MaintenanceAlertsPage.tsx     # Triage feed with ack/resolve and CSV export
      DataExplorerPage.tsx          # Drag-and-drop batch CSV predictor & export
      AboutPage.tsx                 # Academic citations, formulas, and architecture
    services/
      api/
        apiClient.ts        # Typed fetch client with timeouts and offline detector
        pulseApi.ts         # Consolidated service with seamless mock fallback
      mock/
        mockData.ts         # Seeded AI4I benchmark metrics and fleet stream
        mockService.ts      # Pure physics simulation engine (TWF, HDF, PWF, OSF)
    types/
      api.ts                # TypeScript schemas mirroring docs/API_CONTRACT.md
    utils/
      cn.ts                 # Classname merge utility
      formatters.ts         # Temperature (K to °C), percentage, and time formats
    context/
      AppContext.tsx        # Connectivity state, alert persist, and global toasts
    test/                   # Vitest unit and integration test suite
      domain.test.ts        # Physics engine verification
      ui-components.test.tsx# Design system rendering
      navigation.test.tsx   # Shell and page routing
      prediction-flow.test.tsx # Preset injection and inference execution
```

---

## 4. Local Development

### Prerequisites
- Node.js >= 18 (Tested on v24)
- npm >= 9

### Commands
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run Vitest test suite
npm test

# Run Oxlint linter
npm run lint

# Production build
npm run build
```

---

## 5. Live Backend vs. Demo Simulation Mode
The frontend is architected to operate in two seamless modes:
1. **Live Backend Mode:** Connects to the FastAPI server at `VITE_API_BASE_URL` (default: `http://localhost:8000/api/v1`).
2. **Demo Simulation Mode:** If the backend is unreachable or the user toggles the mode switch in the top bar, the frontend utilizes an embedded mathematical physics engine (`MockPredictionService`) executing the exact rules of the AI4I 2020 dataset.
- In Demo Mode, the UI prominently displays a **SIMULATION MODE** indicator, ensuring simulated data is never misrepresented as live production model output.
