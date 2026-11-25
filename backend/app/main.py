from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.api.router import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Explainable machine learning API for industrial failure prediction and predictive maintenance.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API router
app.include_router(api_router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "service": "PULSE Predictive Maintenance Platform",
        "docs": "/docs",
        "health": f"{settings.API_PREFIX}/health"
    }

