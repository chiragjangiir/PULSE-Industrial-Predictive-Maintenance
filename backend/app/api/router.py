import io
import pandas as pd
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Request, status

from backend.app.schemas.telemetry import (
    MachineFeatures,
    PredictionResponse,
    BatchPredictionRequest,
    BatchPredictionResponse,
    HealthResponse,
    ModelInfoResponse
)
from backend.app.services.model_service import model_service

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        service="PULSE Predictive Maintenance Backend",
        model_loaded=(model_service.model is not None),
        model_name=model_service.metadata.get("algorithm", "Gradient Boosting")
    )

@router.get("/model/info", response_model=ModelInfoResponse)
def get_model_info():
    if not model_service.metadata:
        raise HTTPException(status_code=500, detail="Model metadata is not loaded.")
    return ModelInfoResponse(
        model_id=model_service.metadata.get("model_id", "pulse_v1"),
        algorithm=model_service.metadata.get("algorithm", "Gradient Boosting"),
        trained_at=model_service.metadata.get("trained_at", ""),
        dataset_version=model_service.metadata.get("dataset_version", "1.0"),
        decision_threshold=model_service.decision_threshold,
        features=model_service.metadata.get("features", []),
        metrics_summary=model_service.metadata.get("metrics_summary", {})
    )

@router.post("/predict", response_model=PredictionResponse)
def predict_single_machine(payload: MachineFeatures):
    try:
        return model_service.predict_single(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@router.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(
    request: Request,
    file: Optional[UploadFile] = File(None)
):
    machines_to_process: List[MachineFeatures] = []

    content_type = request.headers.get("content-type", "")

    # Option A: JSON payload
    if "application/json" in content_type:
        try:
            body = await request.json()
            payload = BatchPredictionRequest(**body)
            machines_to_process = payload.machines
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON batch payload: {str(e)}")

    # Option B: CSV file upload
    elif file is not None or "multipart/form-data" in content_type:
        try:
            if file is None:
                form = await request.form()
                file = form.get("file")
            content = await file.read()
            df_upload = pd.read_csv(io.BytesIO(content))
            
            # Map potential column name variations
            col_map = {
                "air temperature [k]": "air_temperature_k",
                "process temperature [k]": "process_temperature_k",
                "rotational speed [rpm]": "rotational_speed_rpm",
                "torque [nm]": "torque_nm",
                "tool wear [min]": "tool_wear_min",
                "product id": "machine_id",
                "type": "type"
            }
            # Lowercase for loose matching
            rename_dict = {}
            for c in df_upload.columns:
                c_low = c.strip().lower()
                if c_low in col_map:
                    rename_dict[c] = col_map[c_low]
            df_clean = df_upload.rename(columns=rename_dict)

            required = ["type", "air_temperature_k", "process_temperature_k", "rotational_speed_rpm", "torque_nm", "tool_wear_min"]
            missing = [r for r in required if r not in df_clean.columns]
            if missing:
                raise HTTPException(
                    status_code=400,
                    detail=f"CSV upload is missing required telemetry columns: {missing}"
                )

            for idx, row in df_clean.iterrows():
                machines_to_process.append(
                    MachineFeatures(
                        machine_id=str(row.get("machine_id", f"REC_{idx+1}")),
                        type=str(row["type"]).upper(),
                        air_temperature_k=float(row["air_temperature_k"]),
                        process_temperature_k=float(row["process_temperature_k"]),
                        rotational_speed_rpm=float(row["rotational_speed_rpm"]),
                        torque_nm=float(row["torque_nm"]),
                        tool_wear_min=float(row["tool_wear_min"])
                    )
                )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to process CSV file: {str(e)}")
    else:
        raise HTTPException(
            status_code=400,
            detail="Must provide either JSON payload 'machines' or CSV 'file'."
        )

    # Process all machines
    results: List[PredictionResponse] = []
    risk_counts = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
    predicted_failures = 0

    for machine in machines_to_process:
        res = model_service.predict_single(machine)
        results.append(res)
        risk_counts[res.risk_level] = risk_counts.get(res.risk_level, 0) + 1
        if res.failure_predicted:
            predicted_failures += 1

    return BatchPredictionResponse(
        total_records=len(results),
        predicted_failures=predicted_failures,
        fleet_risk_distribution=risk_counts,
        results=results
    )

@router.get("/analytics/summary")
def get_analytics_summary():
    return {
        "total_machines": 10000,
        "total_failures": 339,
        "failure_rate_percent": 3.39,
        "type_distribution": {
            "L": 6000,
            "M": 2997,
            "H": 1003
        },
        "sensor_ranges": {
            "air_temp_k": {"min": 295.3, "mean": 300.0, "max": 304.5},
            "process_temp_k": {"min": 305.7, "mean": 310.0, "max": 313.8},
            "rotational_speed_rpm": {"min": 1168, "mean": 1538.8, "max": 2886},
            "torque_nm": {"min": 3.8, "mean": 39.99, "max": 76.6},
            "tool_wear_min": {"min": 0, "mean": 107.95, "max": 253}
        }
    }

@router.get("/analytics/failure-distribution")
def get_failure_distribution():
    return {
        "failure_breakdown": {
            "No Failure": 9661,
            "Heat Dissipation Failure (HDF)": 115,
            "Power Failure (PWF)": 95,
            "Overstrain Failure (OSF)": 98,
            "Tool Wear Failure (TWF)": 46,
            "Random Failure (RNF)": 18
        },
        "failure_by_type": {
            "L": {"total": 6000, "failures": 235, "failure_rate": 3.92},
            "M": {"total": 2997, "failures": 83, "failure_rate": 2.77},
            "H": {"total": 1003, "failures": 21, "failure_rate": 2.09}
        }
    }

@router.get("/analytics/feature-importance")
def get_feature_importance():
    return model_service.feature_importance

@router.get("/analytics/model-metrics")
def get_model_metrics():
    return model_service.metrics

@router.get("/models/compare")
def get_models_comparison():
    return model_service.models_comparison

