import os
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "PULSE: Industrial Predictive Maintenance"
    API_PREFIX: str = "/api"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    PORT: int = int(os.getenv("PORT", "8000"))
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")
    ARTIFACTS_DIR: str = os.getenv(
        "PULSE_ARTIFACTS_DIR", 
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../artifacts"))
    )

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.CORS_ORIGINS or self.CORS_ORIGINS == "*":
            return ["*"]
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
