import os
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "service" in data
    assert data["docs"] == "/docs"

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert "Gradient" in data["model_name"]

def test_model_info():
    response = client.get("/api/model/info")
    assert response.status_code == 200
    data = response.json()
    assert data["decision_threshold"] == 0.31
    assert "metrics_summary" in data
    assert "test_roc_auc" in data["metrics_summary"]

def test_predict_single_normal():
    payload = {
        "machine_id": "NORM_001",
        "type": "L",
        "air_temperature_k": 298.1,
        "process_temperature_k": 308.6,
        "rotational_speed_rpm": 1551.0,
        "torque_nm": 42.8,
        "tool_wear_min": 0.0
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["machine_id"] == "NORM_001"
    assert data["prediction"] == 0
    assert data["risk_level"] == "LOW"
    assert data["failure_predicted"] is False

def test_predict_single_failure_overstrain():
    payload = {
        "machine_id": "FAIL_001",
        "type": "L",
        "air_temperature_k": 302.0,
        "process_temperature_k": 311.0,
        "rotational_speed_rpm": 1350.0,
        "torque_nm": 65.0,
        "tool_wear_min": 210.0
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["machine_id"] == "FAIL_001"
    assert data["prediction"] == 1
    assert data["failure_predicted"] is True
    assert data["risk_level"] in ["HIGH", "CRITICAL"]
    assert len(data["recommendations"]) > 0

def test_predict_batch_json():
    payload = {
        "machines": [
            {
                "machine_id": "M1",
                "type": "M",
                "air_temperature_k": 298.0,
                "process_temperature_k": 308.0,
                "rotational_speed_rpm": 1500.0,
                "torque_nm": 40.0,
                "tool_wear_min": 10.0
            },
            {
                "machine_id": "M2",
                "type": "L",
                "air_temperature_k": 302.0,
                "process_temperature_k": 311.0,
                "rotational_speed_rpm": 1300.0,
                "torque_nm": 70.0,
                "tool_wear_min": 220.0
            }
        ]
    }
    response = client.post("/api/predict/batch", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_records"] == 2
    assert "fleet_risk_distribution" in data
    assert len(data["results"]) == 2

def test_predict_batch_csv_upload():
    csv_content = """Type,Air temperature [K],Process temperature [K],Rotational speed [rpm],Torque [Nm],Tool wear [min],Product ID
L,298.1,308.6,1551,42.8,0,L47181
M,302.0,311.0,1320,68.0,210,M14860
"""
    files = {"file": ("test_fleet.csv", csv_content, "text/csv")}
    response = client.post("/api/predict/batch", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["total_records"] == 2

def test_analytics_endpoints():
    r1 = client.get("/api/analytics/summary")
    assert r1.status_code == 200
    assert r1.json()["total_machines"] == 10000

    r2 = client.get("/api/analytics/failure-distribution")
    assert r2.status_code == 200
    assert "failure_breakdown" in r2.json()

    r3 = client.get("/api/analytics/feature-importance")
    assert r3.status_code == 200
    assert "features" in r3.json()

    r4 = client.get("/api/analytics/model-metrics")
    assert r4.status_code == 200
    assert "confusion_matrix" in r4.json()["metrics"]

    r5 = client.get("/api/models/compare")
    assert r5.status_code == 200
    assert len(r5.json()["models"]) >= 5

