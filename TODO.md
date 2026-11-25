# PULSE — Project TODO & Action Items

## Phase 1: Repository Foundation & Shared Contracts [IN PROGRESS]
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

## Phase 2: Dataset Acquisition & Validation
- [ ] Implement `src/pulse/dataset.py` for automated UCI AI4I 2020 download and validation.
- [ ] Verify MD5/SHA256, schema columns, data types, and row count (10,000 rows).
- [ ] Add sanity check CLI command for dataset download.

## Phase 3: Research Notebook & EDA
- [ ] Create `notebooks/PULSE_ML_Research.ipynb`.
- [ ] Write Research Introduction and formal methodology.
- [ ] Implement environment detection and reproducibility seeds.
- [ ] Add automated dataset loader cell.
- [ ] Perform full EDA: class distributions, sensor distributions, correlations, boxplots, pair interactions.

## Phase 4: Machine Learning Pipelines
- [ ] Setup strict 80/20 stratified train/test split.
- [ ] Implement leak-free preprocessing (StandardScaler + OneHotEncoder in Pipeline).
- [ ] Train DummyClassifier baseline.
- [ ] Train candidate models: Logistic Regression, Decision Tree, Random Forest, KNN, SVM, Gradient Boosting.
- [ ] Evaluate metrics: ROC-AUC, PR-AUC, F1, Precision, Recall, Balanced Accuracy.

## Phase 5: Imbalance Handling & Threshold Tuning
- [ ] Evaluate class weights and pipeline-safe SMOTE.
- [ ] Perform threshold scanning on validation folds (0.05 to 0.95).
- [ ] Formulate hypothetical cost-sensitive analysis (Cost = $C_{FP} \cdot FP + C_{FN} \cdot FN$).
- [ ] Select optimal operating threshold prioritizing recall while controlling false alarms.

## Phase 6: Explainability & Interpretability
- [ ] Compute permutation feature importance.
- [ ] Implement SHAP TreeExplainer/KernelExplainer for global summary.
- [ ] Formulate localized waterfall explanations for single machine risk diagnosis.

## Phase 7: Model Artifact Generation
- [ ] Export `artifacts/final_model.joblib`.
- [ ] Export `artifacts/model_metadata.json`.
- [ ] Export `artifacts/model_metrics.json`.
- [ ] Export `artifacts/feature_schema.json`.
- [ ] Export `artifacts/threshold.json`.
- [ ] Export `artifacts/feature_importance.json`.

## Phase 8: FastAPI Backend Development
- [ ] Create backend application structure (`backend/app`).
- [ ] Implement Pydantic input/output schemas matching `docs/API_CONTRACT.md`.
- [ ] Implement ML inference service loading saved artifacts.
- [ ] Implement physics-guided rule-based recommendation engine.
- [ ] Implement endpoints:
  - `GET /api/health`
  - `GET /api/model/info`
  - `POST /api/predict`
  - `POST /api/predict/batch`
  - `GET /api/analytics/summary`
  - `GET /api/analytics/failure-distribution`
  - `GET /api/analytics/feature-importance`
  - `GET /api/analytics/model-metrics`
  - `GET /api/models/compare`
- [ ] Enable CORS for frontend integration.

## Phase 9: Testing & Quality Assurance
- [ ] Write unit tests for preprocessing, inference, and physics rules.
- [ ] Write API integration tests covering all 9 endpoints.
- [ ] Test batch prediction with valid, invalid, and edge-case CSVs.
- [ ] Execute `pytest` suite and ensure 100% pass rate.

## Phase 10: Final Documentation, Audit & Integration PR
- [ ] Update `PROJECT_STATUS.md` with real metric results.
- [ ] Author `docs/EXPERIMENTS.md`, `docs/DEPLOYMENT.md`, `docs/TESTING.md`.
- [ ] Push `chirag/ml-backend` branch and open PR into `integration`.
- [ ] Deliver final master execution report.
