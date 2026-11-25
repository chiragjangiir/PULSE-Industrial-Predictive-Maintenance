# PULSE — Production Deployment Checklist

## 1. Version & Deployment State
- **Frontend Live URL:** https://frontend-omega-woad-22.vercel.app
- **Hosting Provider:** Vercel (Edge CDN)
- **Deployment Status:** LIVE & VERIFIED (HTTP 200 on all 9 routes)
- **Deployment ID:** `frontend-8z7r4rpu1-chirags-projects-71c09ed3`
- **Backend Architecture:** Containerized FastAPI + scikit-learn (Render Blueprint / Docker ready)

---

## 2. Verification Matrix

### Frontend (Vercel)
- [x] Production build succeeds (`tsc -b && vite build`)
- [x] All 13 Vitest automated tests pass (`npm test`)
- [x] Route-level dynamic code splitting enabled (`React.lazy`)
- [x] SPA direct URL refreshes verified (`vercel.json` rewrite routing)
  - [x] `/` &rarr; 200 OK
  - [x] `/predict` &rarr; 200 OK
  - [x] `/fleet` &rarr; 200 OK
  - [x] `/alerts` &rarr; 200 OK
  - [x] `/analytics` &rarr; 200 OK
  - [x] `/model-lab` &rarr; 200 OK
  - [x] `/explainability` &rarr; 200 OK
  - [x] `/explorer` &rarr; 200 OK
  - [x] `/about` &rarr; 200 OK
- [x] Dual-mode resilience: seamless fallback to physics simulation when API offline.

### Backend (FastAPI Microservice)
- [x] 11/11 Pytest unit & integration tests pass (`pytest backend/tests/ -v`)
- [x] ML pipeline loads serialized `final_model.joblib` (Gradient Boosting Classifier)
- [x] Calibrated decision threshold $\theta = 0.31$ enforced
- [x] Single prediction endpoint `/api/predict` verified
- [x] Batch fleet prediction endpoint `/api/predict/batch` verified (JSON + CSV upload)
- [x] All analytics endpoints verified (`/summary`, `/failure-distribution`, `/feature-importance`, `/models/compare`)
- [x] Configurable CORS whitelist (`CORS_ORIGINS`) with development fallback
- [x] Containerization: Dockerfile & Render Blueprint (`render.yaml`) created

### CI/CD & Operations
- [x] GitHub Actions workflow `.github/workflows/ci.yml` configured for automated testing on PRs and main
- [x] Clean separation of concerns (no hardcoded secrets, no committed `.env` files)
