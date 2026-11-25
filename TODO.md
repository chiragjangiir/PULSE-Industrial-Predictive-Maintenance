# PULSE — Project TODO & Action Items

## Phase 1: Repository Foundation & Shared Contracts [COMPLETED]
- [x] Verify GitHub CLI auth and git configuration.
- [x] Verify remote GitHub repository: `chiragjangiir/PULSE-Industrial-Predictive-Maintenance`.
- [x] Setup branch structure (`main`, `integration`, `chirag/ml-backend`).
- [x] Write `.gitignore` and `README.md`.
- [x] Write `PROJECT_STATUS.md` and `TODO.md`.
- [x] Author `docs/ARCHITECTURE.md`.
- [x] Author `docs/API_CONTRACT.md`.
- [x] Author `docs/DATA_DICTIONARY.md`.
- [x] Author `docs/ML_METHODOLOGY.md`.
- [x] Author `docs/INTEGRATION_GUIDE.md`.

## Phase 2: Dataset Acquisition & Validation [COMPLETED]
- [x] Implement `src/pulse/dataset.py` for automated UCI AI4I 2020 download and validation.
- [x] Verify MD5/SHA256, schema columns, data types, and row count (10,000 rows).
- [x] Add sanity check CLI command for dataset download.

## Phase 3: Research Notebook & EDA [COMPLETED]
- [x] Create `notebooks/PULSE_ML_Research.ipynb`.
- [x] Write Research Introduction and formal methodology.
- [x] Implement environment detection and reproducibility seeds.
- [x] Add automated dataset loader cell.
- [x] Perform full EDA: class distributions, sensor distributions, correlations, boxplots, pair interactions.
- [x] Execute notebook and verify visual and metric outputs.

## Phase 4: Machine Learning Pipelines [COMPLETED]
- [x] Setup strict 80/20 stratified train/test split.
- [x] Implement leak-free preprocessing (StandardScaler + OneHotEncoder in Pipeline).
- [x] Train DummyClassifier baseline.
- [x] Train candidate models: Logistic Regression, Decision Tree, Random Forest, KNN, Gradient Boosting.
- [x] Evaluate metrics: ROC-AUC, PR-AUC, F1, Precision, Recall, Balanced Accuracy.

## Phase 5: Imbalance Handling & Threshold Tuning [COMPLETED]
- [x] Evaluate class weights and pipeline-safe transformations.
- [x] Perform threshold scanning on validation folds (0.05 to 0.95).
- [x] Formulate hypothetical cost-sensitive analysis (Cost = $C_{FP} \cdot FP + C_{FN} \cdot FN$).
- [x] Select optimal operating threshold ($\theta=0.31$) prioritizing recall while controlling false alarms.

## Phase 6: Explainability & Interpretability [COMPLETED]
- [x] Compute permutation feature importance.
- [x] Formulate localized risk diagnosis and contributing factor weights.

## Phase 7: Model Artifact Generation [COMPLETED]
- [x] Export `artifacts/final_model.joblib`.
- [x] Export `artifacts/model_metadata.json`.
- [x] Export `artifacts/model_metrics.json`.
- [x] Export `artifacts/feature_schema.json`.
- [x] Export `artifacts/threshold.json`.
- [x] Export `artifacts/feature_importance.json`.
- [x] Export `artifacts/models_compare.json`.

## Phase 8: FastAPI Backend Development [COMPLETED]
- [x] Create backend application structure (`backend/app`).
- [x] Implement Pydantic input/output schemas matching `docs/API_CONTRACT.md`.
- [x] Implement ML inference service loading saved artifacts.
- [x] Implement physics-guided rule-based recommendation engine.
- [x] Implement endpoints:
  - `GET /api/health`
  - `GET /api/model/info`
  - `POST /api/predict`
  - `POST /api/predict/batch` (JSON + CSV upload support)
  - `GET /api/analytics/summary`
  - `GET /api/analytics/failure-distribution`
  - `GET /api/analytics/feature-importance`
  - `GET /api/analytics/model-metrics`
  - `GET /api/models/compare`
- [x] Enable CORS for frontend integration.

## Phase 9: Testing & Quality Assurance [COMPLETED]
- [x] Write unit tests for preprocessing, inference, and physics rules.
- [x] Write API integration tests covering all 9 endpoints.
- [x] Test batch prediction with valid, invalid, and edge-case CSVs.
- [x] Execute `pytest` suite and ensure 100% pass rate (11/11 passing).

## Phase 10: Final Documentation, Audit & Integration PR [COMPLETED]
- [x] Update `PROJECT_STATUS.md` with real metric results.
- [x] Author `docs/EXPERIMENTS.md`, `docs/DEPLOYMENT.md`, `docs/TESTING.md`.
- [x] Push `chirag/ml-backend` branch and open PR into `integration`.


---

## Part B: Frontend & Industrial Dashboard (Frontend Lead) [COMPLETED]
- [x] Establish frontend architecture in `frontend/` (React 19 + TypeScript + Vite 8 + Tailwind CSS 4).
- [x] Configure Industrial SCADA design tokens (graphite base `#090b0e`, cyan `#06b6d4`, amber `#f59e0b`, red `#ef4444`).
- [x] Build reusable Design System primitives (`Button`, `Card`, `StatCard`, `Badge`, `Progress`, `Input`, `Drawer`, `Modal`, `Tabs`).
- [x] Implement Command Center (`OverviewPage.tsx`) with 24-hr telemetry stream and real-time watchlist.
- [x] Implement Machine Intelligence Sandbox (`PredictPage.tsx`) with tactile controls, 5 failure presets, and local SHAP attributions.
- [x] Implement Fleet Telemetry Monitor (`FleetMonitorPage.tsx`) with multi-attribute filtering, grid/table view, and inspection drawer.
- [x] Implement Analytics Studio (`AnalyticsPage.tsx`) with AI4I distributions and torque-speed operating envelope.
- [x] Implement Model Lab (`ModelLabPage.tsx`) with benchmark model comparison, ROC/PR curves, confusion matrix, and threshold slider ($\theta \in [0.10, 0.80]$).
- [x] Implement Explainability Hub (`ExplainabilityPage.tsx`) with global TreeSHAP rankings and failure mechanics breakdown.
- [x] Implement Maintenance Alerts Center (`MaintenanceAlertsPage.tsx`) with acknowledge/resolve state tracking and CSV export.
- [x] Implement Batch Data Explorer (`DataExplorerPage.tsx`) with drag-and-drop CSV parser, benchmark generator, and enriched export.
- [x] Implement Academic Reference (`AboutPage.tsx`) with mathematical formulations, class imbalance analysis, and citations.
- [x] Create API Service Layer with configurable `/api` base URL and typed offline physics simulator fallback (`MockPredictionService`).
- [x] Author comprehensive developer and deployment guide in `docs/FRONTEND.md`.
- [x] Implement Vitest + RTL test suite: 13 passed tests across 4 test suites (100% pass rate).
- [x] Validate zero-warning linter output and clean production build.
