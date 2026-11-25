from typing import List, Dict, Any
from backend.app.schemas.telemetry import RecommendationItem

def generate_recommendations(features: Dict[str, Any], prob: float) -> List[RecommendationItem]:
    """
    Evaluates telemetry against engineering operating envelopes to generate
    physics-guided maintenance recommendations.
    """
    recs: List[RecommendationItem] = []
    
    air_temp = float(features.get("Air temperature [K]", 0))
    proc_temp = float(features.get("Process temperature [K]", 0))
    speed = float(features.get("Rotational speed [rpm]", 0))
    torque = float(features.get("Torque [Nm]", 0))
    wear = float(features.get("Tool wear [min]", 0))
    m_type = str(features.get("Type", "L"))

    temp_diff = proc_temp - air_temp
    power_watts = (2.0 * 3.14159 * speed * torque) / 60.0
    torque_wear = torque * wear

    # 1. Critical Tool Wear
    if wear >= 200.0:
        recs.append(RecommendationItem(
            priority="HIGH",
            action="Immediate cutting insert / tool bit replacement",
            reason=f"Cumulative tool wear is {wear:.0f} min (exceeds critical fatigue limit of 200 min)."
        ))
    elif wear >= 170.0:
        recs.append(RecommendationItem(
            priority="MEDIUM",
            action="Inspect cutting edge wear profile",
            reason=f"Tool wear at {wear:.0f} min is entering high-wear zone."
        ))

    # 2. Thermal Dissipation Deficit
    if temp_diff < 8.6 and speed < 1380.0:
        recs.append(RecommendationItem(
            priority="HIGH",
            action="Inspect cooling circuit and heat exchanger efficiency",
            reason=f"Process-to-air differential is only {temp_diff:.1f} K at low spindle velocity ({speed:.0f} rpm), indicating heat entrapment."
        ))

    # 3. Mechanical Overstrain
    threshold_strain = 11000.0 if m_type == "L" else 12000.0
    if torque_wear > threshold_strain:
        recs.append(RecommendationItem(
            priority="HIGH",
            action="Reduce cutting feed rate and inspect spindle load",
            reason=f"Torque-wear stress index ({torque_wear:.0f} Nm*min) exceeds safe limit for Type {m_type}."
        ))

    # 4. Spindle Power Envelope
    if power_watts > 9000.0:
        recs.append(RecommendationItem(
            priority="HIGH",
            action="Investigate electric spindle motor draw",
            reason=f"Mechanical power ({power_watts:.0f} W) exceeds maximum operating envelope of 9000 W."
        ))
    elif power_watts < 3500.0 and torque > 50.0:
        recs.append(RecommendationItem(
            priority="MEDIUM",
            action="Inspect drive train for potential spindle stall",
            reason=f"Low output power ({power_watts:.0f} W) with elevated torque ({torque:.1f} Nm) suggests mechanical binding."
        ))

    # 5. Elevated Probability Advisory
    if prob >= 0.70 and not recs:
        recs.append(RecommendationItem(
            priority="MEDIUM",
            action="Perform comprehensive preventative diagnostic check",
            reason=f"High multi-sensor failure probability ({prob*100:.1f}%) observed across telemetry indicators."
        ))

    return recs

