# PULSE — REST API CONTRACT (v1.0.0)

**Base URL:** `/api`  
**Protocol:** HTTP/1.1 or HTTP/2  
**Format:** JSON (`application/json`) or Multipart Form Data (batch CSV)  
**Status:** Canonical frozen contract for Part A (Backend) and Part B (Frontend)

---

## 1. Global Standards & Status Codes

All responses follow standard HTTP semantics:
- `200 OK`: Request succeeded.
- `400 Bad Request`: Validation failure, missing required fields, out-of-range sensor values.
- `422 Unprocessable Entity`: Schema format error (Pydantic validation).
- `500 Internal Server Error`: Server-side unhandled exception.

### Standard Error Schema
```json
{
  "status": "error",
  "error_code": "VALIDATION_ERROR",
  "message": "Field 'air_temperature_k' must be between 290.0 and 310.0 K.",
  "details": []
}
```

---

## 2. Endpoints

### 2.1 Health Check
- **Endpoint:** `GET /api/health`
- **Description:** Verifies server running status, model availability, and runtime metadata.
- **Response (200 OK):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "PULSE Predictive Maintenance Backend",
  "model_loaded": true,
  "model_name": "GradientBoostingClassifier"
}
```

---

### 2.2 Model Information
- **Endpoint:** `GET /api/model/info`
- **Description:** Metadata of the loaded production model, training timestamp, hyperparameters, and operational decision threshold.
- **Response (200 OK):**
```json
{
  "model_id": "pulse_gb_v1",
  "algorithm": "GradientBoostingClassifier",
  "trained_at": "2026-11-25T14:30:00Z",
  "dataset_version": "UCI AI4I 2020",
  "decision_threshold": 0.32,
  "features": [
    "air_temperature_k",
    "process_temperature_k",
    "rotational_speed_rpm",
    "torque_nm",
    "tool_wear_min",
    "type_h",
    "type_l",
    "type_m"
  ],
  "metrics_summary": {
    "test_roc_auc": 0.981,
    "test_pr_auc": 0.842,
    "test_recall": 0.852,
    "test_precision": 0.814,
    "test_f1": 0.832
  }
}
```

---

### 2.3 Single Machine Inference
- **Endpoint:** `POST /api/predict`
- **Description:** Real-time failure prediction and risk stratification for one machine.
- **Request Body (`application/json`):**
```json
{
  "machine_id": "M14860",
  "type": "M",
  "air_temperature_k": 298.2,
  "process_temperature_k": 308.7,
  "rotational_speed_rpm": 1408,
  "torque_nm": 46.3,
  "tool_wear_min": 182
}
```
*Note: `machine_id` is optional metadata for traceability; it is not fed into the ML model.*

- **Response (200 OK):**
```json
{
  "machine_id": "M14860",
  "prediction": 1,
  "failure_probability": 0.742,
  "risk_level": "HIGH",
  "decision_threshold": 0.32,
  "failure_predicted": true,
  "contributing_factors": [
    {"feature": "torque_wear_interaction", "importance_weight": 0.38, "value": 8426.6},
    {"feature": "tool_wear_min", "importance_weight": 0.29, "value": 182.0},
    {"feature": "temp_diff", "importance_weight": 0.18, "value": 10.5}
  ],
  "recommendations": [
    {
      "priority": "HIGH",
      "action": "Schedule immediate tool bit inspection and replacement",
      "reason": "Tool wear has reached 182 min (approaching critical fatigue limit of 200 min)."
    },
    {
      "priority": "MEDIUM",
      "action": "Inspect drive torque loading",
      "reason": "Torque level (46.3 Nm) under current tool wear generates elevated mechanical shear stress."
    }
  ]
}
```

---

### 2.4 Batch Machine Inference
- **Endpoint:** `POST /api/predict/batch`
- **Description:** High-volume batch prediction from either a JSON array or a multipart CSV upload.
- **Request Body Option A (`application/json`):**
```json
{
  "machines": [
    {
      "machine_id": "L47181",
      "type": "L",
      "air_temperature_k": 298.1,
      "process_temperature_k": 308.6,
      "rotational_speed_rpm": 1551,
      "torque_nm": 42.8,
      "tool_wear_min": 0
    }
  ]
}
```
- **Request Body Option B (`multipart/form-data`):**
  - File upload with key `file` containing CSV with columns: `Type`, `Air temperature [K]`, `Process temperature [K]`, `Rotational speed [rpm]`, `Torque [Nm]`, `Tool wear [min]`.
- **Response (200 OK):**
```json
{
  "total_records": 1,
  "predicted_failures": 0,
  "fleet_risk_distribution": {
    "LOW": 1,
    "MEDIUM": 0,
    "HIGH": 0,
    "CRITICAL": 0
  },
  "results": [
    {
      "machine_id": "L47181",
      "prediction": 0,
      "failure_probability": 0.012,
      "risk_level": "LOW",
      "failure_predicted": false,
      "recommendations": []
    }
  ]
}
```

---

### 2.5 Fleet Analytics Summary
- **Endpoint:** `GET /api/analytics/summary`
- **Description:** Aggregated statistical summary of fleet health, benchmark historical records, and sensor ranges.
- **Response (200 OK):**
```json
{
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
```

---

### 2.6 Failure Mode Distribution
- **Endpoint:** `GET /api/analytics/failure-distribution`
- **Description:** Historical failure mode distribution across machine quality types from the benchmark dataset.
- **Response (200 OK):**
```json
{
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
```

---

### 2.7 Feature Importance
- **Endpoint:** `GET /api/analytics/feature-importance`
- **Description:** Global permutation and model feature importance values for explainability dashboards.
- **Response (200 OK):**
```json
{
  "method": "Permutation & SHAP Global Importance",
  "features": [
    {"name": "torque_wear_interaction", "importance": 0.342, "rank": 1},
    {"name": "torque_nm", "importance": 0.285, "rank": 2},
    {"name": "rotational_speed_rpm", "importance": 0.178, "rank": 3},
    {"name": "tool_wear_min", "importance": 0.092, "rank": 4},
    {"name": "temp_diff", "importance": 0.065, "rank": 5},
    {"name": "process_temperature_k", "importance": 0.021, "rank": 6},
    {"name": "air_temperature_k", "importance": 0.012, "rank": 7},
    {"name": "type", "importance": 0.005, "rank": 8}
  ]
}
```

---

### 2.8 Model Evaluation Metrics
- **Endpoint:** `GET /api/analytics/model-metrics`
- **Description:** Complete test set and cross-validation performance metrics for academic transparency.
- **Response (200 OK):**
```json
{
  "model": "GradientBoostingClassifier",
  "evaluated_on": "Hold-out Test Set (20% Stratified)",
  "metrics": {
    "accuracy": 0.985,
    "balanced_accuracy": 0.908,
    "roc_auc": 0.981,
    "pr_auc": 0.842,
    "precision": 0.814,
    "recall": 0.852,
    "f1_score": 0.832,
    "confusion_matrix": {
      "true_negative": 1912,
      "false_positive": 13,
      "false_negative": 10,
      "true_positive": 58
    }
  }
}
```

---

### 2.9 Models Benchmark Comparison
- **Endpoint:** `GET /api/models/compare`
- **Description:** Comparative academic benchmark table comparing all evaluated classifiers.
- **Response (200 OK):**
```json
{
  "models": [
    {
      "model_name": "Dummy (Stratified)",
      "accuracy": 0.966,
      "roc_auc": 0.500,
      "pr_auc": 0.034,
      "f1": 0.000,
      "recall": 0.000,
      "precision": 0.000
    },
    {
      "model_name": "Logistic Regression",
      "accuracy": 0.970,
      "roc_auc": 0.842,
      "pr_auc": 0.512,
      "f1": 0.490,
      "recall": 0.412,
      "precision": 0.605
    },
    {
      "model_name": "Random Forest",
      "accuracy": 0.986,
      "roc_auc": 0.978,
      "pr_auc": 0.835,
      "f1": 0.818,
      "recall": 0.794,
      "precision": 0.844
    },
    {
      "model_name": "Gradient Boosting",
      "accuracy": 0.985,
      "roc_auc": 0.981,
      "pr_auc": 0.842,
      "f1": 0.832,
      "recall": 0.852,
      "precision": 0.814
    }
  ]
}
```
