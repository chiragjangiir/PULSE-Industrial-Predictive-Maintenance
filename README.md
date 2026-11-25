# PULSE: Industrial Intelligence & Predictive Maintenance Platform

[![Google Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/chiragjangiir/PULSE-Industrial-Predictive-Maintenance/blob/main/notebooks/PULSE_ML_Research.ipynb)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.4+-F7931E.svg)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Academic Title:** An Explainable Machine Learning System for Industrial Machine Failure Prediction, Risk Assessment, and Predictive Maintenance.

PULSE is an end-to-end industrial intelligence and predictive maintenance research platform designed for heavy machinery reliability engineering. It combines rigorous, leakage-free machine learning pipelines with production-grade FastAPI microservices and an explainable decision-support dashboard.

---

## 🏗️ Architecture Overview

PULSE operates on a decoupled client-server architecture:
- **ML Research & Pipeline Engine**: Rigorous, reproducible machine learning trained on the benchmark UCI AI4I 2020 Predictive Maintenance dataset. Implements leak-free preprocessing, feature interaction modeling, cost-sensitive threshold optimization, and SHAP/permutation explainability.
- **FastAPI Backend (`/api`)**: High-throughput REST API serving real-time single and batch machine predictions, risk stratifications, physics-guided rule recommendations, and model analytics.
- **Frontend Dashboard (Part B)**: Modern responsive React/TypeScript UI for fleet monitoring, telemetry simulation, failure diagnosis, and model transparency.

```
                           +--------------------------------------+
                           |     UCI AI4I 2020 Dataset (10k)      |
                           +--------------------------------------+
                                              |
                                              v
                           +--------------------------------------+
                           |   PULSE ML Research & Model Pipeline |
                           |  (Leakage-Free Preprocessing, CV,    |
                           |   Threshold Optimization & SHAP)     |
                           +--------------------------------------+
                                              |
                                              v  Exports
                           +--------------------------------------+
                           |  Trained Artifacts & JSON Schemas    |
                           |    (artifacts/final_model.joblib)    |
                           +--------------------------------------+
                                              |
                                              v  Loads
                           +--------------------------------------+
                           |       PULSE FastAPI Backend          |
                           |  (Prediction, Batch, Analytics APIs) |
                           +--------------------------------------+
                                      ^               ^
                                      |               |
                      REST API (/api) |               | HTTP Client
                                      v               v
                +----------------------------+   +-------------------+
                | Modern Web Dashboard (Pt B)|   | External Systems  |
                +----------------------------+   +-------------------+
```

---

## 📊 Dataset & Research Problem

PULSE utilizes the official **UCI AI4I 2020 Predictive Maintenance Dataset** reflecting real-world industrial milling tool operations:
- **Instances**: 10,000 operational records.
- **Sensor Telemetry**: Air temperature [K], Process temperature [K], Rotational speed [rpm], Torque [Nm], Tool wear [min].
- **Machine Quality Variants**: Type L (50%), M (30%), H (20%).
- **Target**: `Machine failure` (Binary: 0 = Normal, 1 = Failure, ~3.39% class imbalance).
- **Leakage Prevention**: Subtype labels (`TWF`, `HDF`, `PWF`, `OSF`, `RNF`) and identifiers (`UDI`, `Product ID`) are strictly excluded from predictive features.

---

## 🚀 Quickstart

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/chiragjangiir/PULSE-Industrial-Predictive-Maintenance.git
cd PULSE-Industrial-Predictive-Maintenance

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run the FastAPI server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at `http://localhost:8000/docs`.

### 2. Google Colab ML Research
Open [`notebooks/PULSE_ML_Research.ipynb`](notebooks/PULSE_ML_Research.ipynb) directly in Google Colab using the badge above to reproduce the complete exploratory analysis, model training, cross-validation, threshold tuning, and artifact generation.

---

## 📡 API Contract Highlights

Base path: `/api`
- `GET /api/health` — Health check, uptime, version.
- `GET /api/model/info` — Active model metadata, hyperparams, threshold.
- `POST /api/predict` — Real-time single machine failure inference & risk scoring.
- `POST /api/predict/batch` — CSV / multi-record fleet batch predictions.
- `GET /api/analytics/summary` — Global fleet failure statistics and distributions.
- `GET /api/analytics/failure-distribution` — Breakdowns across machine types and failures.
- `GET /api/analytics/feature-importance` — Permutation and SHAP global importance.
- `GET /api/analytics/model-metrics` — Full cross-validation and test set evaluation metrics.
- `GET /api/models/compare` — Benchmark comparison across tested candidate models.

For complete payload specifications and schemas, see [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md).

---

## 👥 Branching & Team Coordination

- `main`: Production-ready, stable releases.
- `integration`: Shared staging branch for backend and frontend integration.
- `chirag/ml-backend`: Backend services, ML pipelines, and research documentation.
- `friend/frontend-dashboard`: Frontend client application (Part B).

Refer to [`docs/INTEGRATION_GUIDE.md`](docs/INTEGRATION_GUIDE.md) for full collaboration workflows.

---

## 📜 License
MIT License. See [LICENSE](LICENSE) for details.

