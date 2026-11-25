from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class MachineFeatures(BaseModel):
    machine_id: Optional[str] = Field(default=None, description="Optional machine identification code")
    type: str = Field(..., description="Machine type variant ('L', 'M', or 'H')")
    air_temperature_k: float = Field(..., ge=280.0, le=320.0, description="Ambient air temperature in Kelvin")
    process_temperature_k: float = Field(..., ge=290.0, le=330.0, description="Operating process temperature in Kelvin")
    rotational_speed_rpm: float = Field(..., ge=800.0, le=3500.0, description="Spindle rotational speed in RPM")
    torque_nm: float = Field(..., ge=0.0, le=120.0, description="Spindle torque in Nm")
    tool_wear_min: float = Field(..., ge=0.0, le=350.0, description="Tool wear operational minutes")

    model_config = {
        "json_schema_extra": {
            "example": {
                "machine_id": "M14860",
                "type": "M",
                "air_temperature_k": 298.2,
                "process_temperature_k": 308.7,
                "rotational_speed_rpm": 1408.0,
                "torque_nm": 46.3,
                "tool_wear_min": 182.0
            }
        }
    }

class RecommendationItem(BaseModel):
    priority: str
    action: str
    reason: str

class ContributingFactor(BaseModel):
    feature: str
    importance_weight: float
    value: float

class PredictionResponse(BaseModel):
    machine_id: Optional[str] = None
    prediction: int
    failure_probability: float
    risk_level: str
    decision_threshold: float
    failure_predicted: bool
    contributing_factors: List[ContributingFactor] = []
    recommendations: List[RecommendationItem] = []

class BatchPredictionRequest(BaseModel):
    machines: List[MachineFeatures]

class BatchPredictionResponse(BaseModel):
    total_records: int
    predicted_failures: int
    fleet_risk_distribution: Dict[str, int]
    results: List[PredictionResponse]

class HealthResponse(BaseModel):
    status: str
    version: str
    service: str
    model_loaded: bool
    model_name: str

class ModelInfoResponse(BaseModel):
    model_id: str
    algorithm: str
    trained_at: str
    dataset_version: str
    decision_threshold: float
    features: List[str]
    metrics_summary: Dict[str, float]

