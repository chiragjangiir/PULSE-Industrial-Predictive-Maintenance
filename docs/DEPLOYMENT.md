# PULSE — Deployment & Production Operations Guide

## 1. Local Development
```bash
# Activate environment
source .venv/bin/activate

# Start Uvicorn development server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive Swagger UI: `http://localhost:8000/docs`  
ReDoc: `http://localhost:8000/redoc`

---

## 2. Containerized Deployment (Docker)

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ src/
COPY artifacts/ artifacts/
COPY backend/ backend/

ENV PYTHONPATH=/app
EXPOSE 8000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

Build and run:
```bash
docker build -t pulse-backend:latest .
docker run -p 8000:8000 pulse-backend:latest
```

---

## 3. Production Environment Variables
| Variable | Default | Purpose |
|---|---|---|
| `PULSE_ARTIFACTS_DIR` | `artifacts/` | Path to serialized models and JSON schemas |
| `ENVIRONMENT` | `production` | Active runtime environment |
| `API_PREFIX` | `/api` | Base path for all REST routes |

