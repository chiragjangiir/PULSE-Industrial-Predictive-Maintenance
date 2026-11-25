"""
Canonical Feature Engineering module for PULSE.
Imported by both training and inference routines to prevent pickle/unpickle namespace mismatch.
"""

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin

class IndustrialFeatureEngineer(BaseEstimator, TransformerMixin):
    """
    Leakage-free domain feature engineering for milling tool telemetry:
    - temp_diff = Process temperature [K] - Air temperature [K]
    - power_kW = (2 * pi * speed * torque) / 60,000
    - torque_wear_interaction = torque * tool wear
    - temp_ratio = Process temperature [K] / Air temperature [K]
    """
    def __init__(self, include_features: bool = True):
        self.include_features = include_features

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X_df = X.copy()
        if not self.include_features:
            return X_df

        air_temp = X_df["Air temperature [K]"]
        proc_temp = X_df["Process temperature [K]"]
        speed = X_df["Rotational speed [rpm]"]
        torque = X_df["Torque [Nm]"]
        wear = X_df["Tool wear [min]"]

        X_df["temp_diff"] = proc_temp - air_temp
        X_df["power_kW"] = (2.0 * np.pi * speed * torque) / 60000.0
        X_df["torque_wear_interaction"] = torque * wear
        X_df["temp_ratio"] = proc_temp / (air_temp + 1e-6)

        return X_df

