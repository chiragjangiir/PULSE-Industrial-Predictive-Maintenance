# PULSE — Production Deployment Audit Report

**Date:** 2026-11-25  
**Auditor:** Autonomous DevOps & Release Manager  
**Repository:** `chiragjangiir/PULSE-Industrial-Predictive-Maintenance`  
**Target Environment:** Vercel (Frontend) + Render/Containerized Host (FastAPI Backend)

---

## 1. Existing System Architecture Overview
PULSE is structured as a decoupled monorepo containing:
1. **Frontend (`frontend/`)**: React 19, Vite 8, Tailwind CSS v4, Lucide icons, Recharts, and React Router v7.
2. **Backend (`backend/`)**: FastAPI 0.115+, Pydantic v2, scikit-learn 1.9+, joblib, uvicorn.
3. **ML Artifacts (`artifacts/`)**: Serialized Gradient Boosting Pipeline (`final_model.joblib`, 334 KB), feature schemas, and JSON metrics.
4. **Research Core (`src/pulse/`, `notebooks/`)**: Google Colab research notebook, leak-free preprocessing, and feature engineering transformers.

---

## 2. Deployment Risks & Vulnerability Analysis

| Risk Vector | Existing State | Severity | Required Mitigation |
|---|---|---|---|
| **SPA Direct Route Refresh** | No `vercel.json` rewrite rule | **High** | Direct visits to `/predict`, `/fleet`, `/analytics` on Vercel will 404 without SPA fallback rewrites. Add `vercel.json`. |
| **API Base URL Resolution** | Defaults to `http://localhost:8000/api` | **High** | In production, client must target public backend via `VITE_API_BASE_URL`. |
| **Backend Monolithic Monorepo Pathing** | `artifacts_dir` resolved relative to file | **Medium** | Path traversal works locally but needs robust fallback for containerized environments (`PULSE_ARTIFACTS_DIR`). |
| **CORS Policy** | `allow_origins=["*"]` | **Medium** | Permissive wildcard is good for development; in production, configure environment-driven whitelist while supporting local development. |
| **Bundle Size** | Production bundle is ~914 KB (261 KB gzip) | **Low** | Vite warns about >500 KB chunk. Introduce route-level dynamic imports with `React.lazy()` for secondary pages. |
| **Model Deserialization in Serverless** | Serverless functions reload artifacts on cold start | **Medium** | FastAPI + scikit-learn is better hosted as a persistent container service (e.g. Render / Railway / Fly) rather than Vercel serverless function to prevent cold start latency spikes on joblib loads. |

---

## 3. Recommended Deployment Architecture
- **Frontend Hosting:** Vercel
  - Root directory: `frontend`
  - Framework: Vite
  - Build command: `npm run build`
  - Output directory: `dist`
  - SPA Rewrites: Configured via `frontend/vercel.json`
- **Backend Hosting:** Render / Containerized Cloud Host
  - Container / Native Python runtime with persistent process memory for instant ML inference (<15ms).
  - Health check at `/api/health`.

---

## 4. Immediate Action Items
1. Author `frontend/vercel.json` with SPA catch-all rewrites (`"source": "/(.*)", "destination": "/index.html"`).
2. Create `frontend/.env.example` and `frontend/.env.production` templates.
3. Create `backend/.env.example` for CORS and host binding.
4. Add route-level code splitting (`React.lazy()`) in `frontend/src/App.tsx` to optimize chunking.
5. Create a GitHub Actions CI workflow to automate tests and builds on PRs.

