import pytest
from backend.app.services.physics_rules import generate_recommendations
from backend.app.schemas.telemetry import MachineFeatures

def test_tool_wear_critical_recommendation():
    features = {
        "Type": "L",
        "Air temperature [K]": 298.0,
        "Process temperature [K]": 308.0,
        "Rotational speed [rpm]": 1500.0,
        "Torque [Nm]": 40.0,
        "Tool wear [min]": 215.0
    }
    recs = generate_recommendations(features, prob=0.85)
    actions = [r.action for r in recs]
    assert any("tool bit replacement" in a.lower() for a in actions)

def test_thermal_dissipation_recommendation():
    features = {
        "Type": "M",
        "Air temperature [K]": 300.0,
        "Process temperature [K]": 305.0,  # diff = 5.0 < 8.6
        "Rotational speed [rpm]": 1300.0,  # < 1380
        "Torque [Nm]": 40.0,
        "Tool wear [min]": 50.0
    }
    recs = generate_recommendations(features, prob=0.60)
    actions = [r.action for r in recs]
    assert any("cooling circuit" in a.lower() for a in actions)

def test_mechanical_overstrain_recommendation():
    features = {
        "Type": "L",
        "Air temperature [K]": 298.0,
        "Process temperature [K]": 308.0,
        "Rotational speed [rpm]": 1500.0,
        "Torque [Nm]": 65.0,
        "Tool wear [min]": 180.0  # torque * wear = 11700 > 11000
    }
    recs = generate_recommendations(features, prob=0.75)
    actions = [r.action for r in recs]
    assert any("feed rate" in a.lower() for a in actions)

