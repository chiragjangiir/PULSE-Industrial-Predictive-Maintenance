# PULSE — Frontend Integration Guide (Part B Teammate)

Welcome to the **PULSE** project! This guide contains everything you need to build the React / TypeScript dashboard in branch `friend/frontend-dashboard`.

---

## 1. Git & Branching Instructions

### Clone & Branch Setup
```bash
# Clone the repository
git clone https://github.com/chiragjangiir/PULSE-Industrial-Predictive-Maintenance.git
cd PULSE-Industrial-Predictive-Maintenance

# Fetch all remote branches
git fetch origin

# Check out the shared staging branch, then create your own feature branch
git checkout integration
git checkout -b friend/frontend-dashboard
```

### Working Boundary
- **Your Dedicated Folder:** `frontend/` (You have complete freedom to create, scaffold, build, and test your React/Vite/Next UI here).
- **Shared Contracts (Read-Only):**
  - `docs/API_CONTRACT.md`: The definitive API contract.
  - `docs/DATA_DICTIONARY.md`: Telemetry field definitions, ranges, and types.
- **Do Not Modify:**
  - `backend/`
  - `src/`
  - `artifacts/`
  - `notebooks/`

---

## 2. Connecting to the Backend API

The backend serves the REST API on port `8000` with the base path `/api`.

- Base URL: `http://localhost:8000/api`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

### Key Endpoints for the Dashboard
1. **Fleet Health & Overview**: `GET /api/analytics/summary`
2. **Failure Breakdowns (Pie/Bar charts)**: `GET /api/analytics/failure-distribution`
3. **Model Benchmark Comparison (Table/Chart)**: `GET /api/models/compare`
4. **Model Metrics (Confusion Matrix & ROC)**: `GET /api/analytics/model-metrics`
5. **Feature Importance (Bar chart)**: `GET /api/analytics/feature-importance`
6. **Single Machine Predictor (Form / Simulation)**: `POST /api/predict`
7. **Batch Fleet Prediction (CSV Upload)**: `POST /api/predict/batch`

---

## 3. Submitting Your Work

When your frontend features are ready:
```bash
git add frontend/
git commit -m "feat(frontend): implement PULSE dashboard overview and prediction forms"
git push origin friend/frontend-dashboard
```
Then open a Pull Request from `friend/frontend-dashboard` into the `integration` branch on GitHub.
