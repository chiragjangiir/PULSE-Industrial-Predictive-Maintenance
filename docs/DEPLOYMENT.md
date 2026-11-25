# PULSE — Production Operations & Hosting Guide

## 1. Live Public Deployments
- **Production Frontend (Vercel):**  
  [https://frontend-omega-woad-22.vercel.app](https://frontend-omega-woad-22.vercel.app)
- **Google Colab ML Research Notebook:**  
  [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/chiragjangiir/PULSE-Industrial-Predictive-Maintenance/blob/main/notebooks/PULSE_ML_Research.ipynb)

---

## 2. Frontend Hosting Architecture (Vercel)
The frontend is hosted on Vercel's global edge network.
- **Root Directory:** `frontend`
- **Build Command:** `tsc -b && vite build`
- **Output Directory:** `dist`
- **SPA Rewrites:** Configured in `frontend/vercel.json` to route all path requests to `/index.html` to guarantee direct URL resolution without 404s.
- **Environment Configuration:**
  - `VITE_API_BASE_URL`: URL to the live FastAPI backend (e.g. `https://pulse-backend-api.onrender.com/api`).
  - When unset, the frontend gracefully activates its deterministic physics-based simulation engine (`SIMULATION` mode).

---

## 3. Backend Hosting Options

### Option A: Render (Recommended Blueprint)
The repository includes a ready-to-deploy `render.yaml` blueprint:
1. Connect `chiragjangiir/PULSE-Industrial-Predictive-Maintenance` on [Render.com](https://render.com).
2. Select **New Blueprint Instance**.
3. Render will provision the Python web service using:
   - Build: `pip install -r backend/requirements.txt`
   - Start: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
   - Health check: `/api/health`

### Option B: Docker Container (Any Cloud Host)
```bash
docker build -t pulse-backend:latest .
docker run -p 8000:8000 -e CORS_ORIGINS="https://frontend-omega-woad-22.vercel.app" pulse-backend:latest
```

---

## 4. Local Development
```bash
# Terminal 1: Backend
source .venv/bin/activate
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```
Local dashboard will be live at `http://localhost:5173`, connecting directly to `http://localhost:8000/api`.
