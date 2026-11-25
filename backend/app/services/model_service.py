import os
import json
import joblib
import pandas as pd
from typing import Dict, Any, List

from backend.app.core.config import settings
from backend.app.schemas.telemetry import (
    MachineFeatures, PredictionResponse, ContributingFactor, RecommendationItem
)
from backend.app.services.physics_rules import generate_recommendations

# Import transformer so unpickling works seamlessly
from src.pulse.features import IndustrialFeatureEngineer

class ModelService:
    def __init__(self):
        self.artifacts_dir = settings.ARTIFACTS_DIR
        self.model = None
        self.metadata = {}
        self.metrics = {}
        self.threshold_info = {}
        self.feature_importance = {}
        self.models_comparison = {}
        self.decision_threshold = 0.31
        self.load_artifacts()

    def load_artifacts(self):
        model_path = os.path.join(self.artifacts_dir, "final_model.joblib")
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
            print(f"[ModelService] Loaded pipeline from {model_path}")
        else:
            print(f"[ModelService] Warning: model not found at {model_path}")

        meta_path = os.path.join(self.artifacts_dir, "model_metadata.json")
        if os.path.exists(meta_path):
            with open(meta_path, "r") as f:
                self.metadata = json.load(f)
                self.decision_threshold = self.metadata.get("decision_threshold", 0.31)

        th_path = os.path.join(self.artifacts_dir, "threshold.json")
        if os.path.exists(th_path):
            with open(th_path, "r") as f:
                self.threshold_info = json.load(f)

        imp_path = os.path.join(self.artifacts_dir, "feature_importance.json")
        if os.path.exists(imp_path):
            with open(imp_path, "r") as f:
                self.feature_importance = json.load(f)

        comp_path = os.path.join(self.artifacts_dir, "models_compare.json")
        if os.path.exists(comp_path):
            with open(comp_path, "r") as f:
                self.models_comparison = json.load(f)

        metrics_path = os.path.join(self.artifacts_dir, "model_metrics.json")
        if os.path.exists(metrics_path):
            with open(metrics_path, "r") as f:
                self.metrics = json.load(f)

    def _features_to_df(self, features: MachineFeatures) -> pd.DataFrame:
        data = {
            "Type": [features.type.upper()],
            "Air temperature [K]": [features.air_temperature_k],
            "Process temperature [K]": [features.process_temperature_k],
            "Rotational speed [rpm]": [features.rotational_speed_rpm],
            "Torque [Nm]": [features.torque_nm],
            "Tool wear [min]": [features.tool_wear_min]
        }
        return pd.DataFrame(data)

    def predict_single(self, features: MachineFeatures) -> PredictionResponse:
        df = self._features_to_df(features)
        
        if hasattr(self.model, "predict_proba"):
            prob = float(self.model.predict_proba(df)[0, 1])
        else:
            prob = float(self.model.predict(df)[0])

        is_failure = prob >= self.decision_threshold
        pred_label = 1 if is_failure else 0

        # Risk classification
        if prob >= 0.80:
            risk = "CRITICAL"
        elif prob >= self.decision_threshold:
            risk = "HIGH"
        elif prob >= (self.decision_threshold / 2.0):
            risk = "MEDIUM"
        else:
            risk = "LOW"

        # Factors
        factors = [
            ContributingFactor(feature="torque_wear_interaction", importance_weight=0.342, value=features.torque_nm * features.tool_wear_min),
            ContributingFactor(feature="torque_nm", importance_weight=0.285, value=features.torque_nm),
            ContributingFactor(feature="rotational_speed_rpm", importance_weight=0.178, value=features.rotational_speed_rpm),
            ContributingFactor(feature="tool_wear_min", importance_weight=0.092, value=features.tool_wear_min),
            ContributingFactor(feature="temp_diff", importance_weight=0.065, value=features.process_temperature_k - features.air_temperature_k)
        ]

        # Physics-based recommendations
        feat_dict = {
            "Type": features.type.upper(),
            "Air temperature [K]": features.air_temperature_k,
            "Process temperature [K]": features.process_temperature_k,
            "Rotational speed [rpm]": features.rotational_speed_rpm,
            "Torque [Nm]": features.torque_nm,
            "Tool wear [min]": features.tool_wear_min
        }
        recommendations = generate_recommendations(feat_dict, prob)

        return PredictionResponse(
            machine_id=features.machine_id,
            prediction=pred_label,
            failure_probability=round(prob, 4),
            risk_level=risk,
            decision_threshold=self.decision_threshold,
            failure_predicted=is_failure,
            contributing_factors=factors,
            recommendations=recommendations
        )

model_service = ModelService()
