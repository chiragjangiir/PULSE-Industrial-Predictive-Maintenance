import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "PULSE: Industrial Predictive Maintenance"
    API_PREFIX: str = "/api"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "production"
    ARTIFACTS_DIR: str = os.getenv(
        "PULSE_ARTIFACTS_DIR", 
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../artifacts"))
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
