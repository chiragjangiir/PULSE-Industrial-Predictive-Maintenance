import {
  PredictionRequest,
  PredictionResponse,
  BatchPredictionResponse,
  RiskLevel,
  FailureType,
  FeatureContribution,
  BatchItemPrediction,
} from '@/types/api';

/**
 * High-fidelity domain simulation service based on AI4I 2020 physics rules.
 * Used when the FastAPI backend is not connected.
 */
export class MockPredictionService {
  public static predict(req: PredictionRequest): PredictionResponse {
    const {
      machine_id = `MCH-${Math.floor(1000 + Math.random() * 9000)}`,
      machine_type,
      air_temperature,
      process_temperature,
      rotational_speed,
      torque,
      tool_wear,
    } = req;

    // Derived physics features
    const tempDiff = process_temperature - air_temperature;
    // Power in Watts = (2 * pi * speed / 60) * torque
    const power = (2 * Math.PI * rotational_speed / 60) * torque;
    const overstrainMetric = tool_wear * torque;

    // Failure rule detection according to AI4I 2020 dataset benchmark
    const isTWF = tool_wear >= 200;
    const isHDF = tempDiff < 8.6 && rotational_speed < 1380;
    const isPWF = power < 3500 || power > 9000;
    const osfThreshold = machine_type === 'L' ? 11000 : machine_type === 'M' ? 12000 : 13000;
    const isOSF = overstrainMetric > osfThreshold;

    const failureReasons: FailureType[] = [];
    if (isTWF) failureReasons.push('Tool Wear Failure (TWF)');
    if (isHDF) failureReasons.push('Heat Dissipation Failure (HDF)');
    if (isPWF) failureReasons.push('Power Failure (PWF)');
    if (isOSF) failureReasons.push('Overstrain Failure (OSF)');

    const hasFailure = failureReasons.length > 0;

    // Probability calculation
    let probability = 0.04; // baseline nominal probability
    if (hasFailure) {
      probability = 0.65 + Math.min(0.33, failureReasons.length * 0.12 + (torque > 60 ? 0.08 : 0));
    } else {
      // Risk elevation based on approaching thresholds
      if (tool_wear > 160) probability += 0.15 * ((tool_wear - 160) / 40);
      if (tempDiff < 9.2 && rotational_speed < 1450) probability += 0.22;
      if (power < 3800 || power > 8500) probability += 0.18;
      if (overstrainMetric > osfThreshold * 0.85) probability += 0.16;
    }
    probability = Math.min(0.99, Math.max(0.01, parseFloat(probability.toFixed(3))));

    let risk_level: RiskLevel = 'LOW';
    if (probability >= 0.7) risk_level = 'CRITICAL';
    else if (probability >= 0.42) risk_level = 'HIGH';
    else if (probability >= 0.2) risk_level = 'MEDIUM';

    const primary_failure_mode: FailureType = failureReasons[0] || 'No Failure';
    const secondary_failure_mode = failureReasons[1];

    // Feature contributions (SHAP-style local attribution simulation)
    const contributions: FeatureContribution[] = [
      {
        feature: 'Tool Wear',
        value: tool_wear,
        contribution: isTWF ? 0.35 : tool_wear > 150 ? 0.15 : -0.05,
        description: isTWF ? 'Tool wear exceeds safe blade life (200 min)' : 'Tool wear within operating bounds',
      },
      {
        feature: 'Load Torque',
        value: torque,
        contribution: torque > 55 ? 0.28 : torque < 15 ? 0.12 : -0.08,
        description: torque > 55 ? 'High torque increases mechanical stress' : 'Torque nominal',
      },
      {
        feature: 'Spindle Speed',
        value: rotational_speed,
        contribution: isHDF || isPWF ? 0.22 : -0.06,
        description: `Spindle speed at ${rotational_speed} rpm`,
      },
      {
        feature: 'Thermal Gradient (Process - Air)',
        value: parseFloat(tempDiff.toFixed(2)),
        contribution: isHDF ? 0.31 : tempDiff < 9.0 ? 0.14 : -0.1,
        description: isHDF ? 'Insufficient cooling delta (< 8.6 K) induces thermal saturation' : 'Thermal dissipation nominal',
      },
      {
        feature: 'Electrical Power',
        value: Math.round(power),
        contribution: isPWF ? 0.29 : -0.04,
        description: isPWF ? `Power at ${Math.round(power)} W outside safe envelope (3500-9000 W)` : 'Power consumption stable',
      },
    ].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

    // Dynamic actionable recommendation
    let recommendation = 'Nominal operating conditions. Maintain regular shift schedule.';
    if (risk_level === 'CRITICAL' || risk_level === 'HIGH') {
      if (primary_failure_mode === 'Tool Wear Failure (TWF)') {
        recommendation = 'Tool wear exceeds critical limits. Immediately replace tool insert before initiating next machining cycle.';
      } else if (primary_failure_mode === 'Heat Dissipation Failure (HDF)') {
        recommendation = 'Critical thermal dissipation deficit. Check coolant fluid level, clean radiator fins, and increase spindle ventilation.';
      } else if (primary_failure_mode === 'Power Failure (PWF)') {
        recommendation = 'Spindle power overload/stall detected. Verify line voltage and reduce cut depth/feed rate.';
      } else if (primary_failure_mode === 'Overstrain Failure (OSF)') {
        recommendation = 'Overstrain threshold exceeded. Reduce feed rate immediately to relieve mechanical shear stress.';
      } else {
        recommendation = 'Elevated failure probability. Dispatch technician for immediate inspection and diagnostic check.';
      }
    } else if (risk_level === 'MEDIUM') {
      recommendation = 'Parameters trending towards warning threshold. Flag for priority inspection at next shift handover.';
    }

    return {
      machine_id,
      prediction: probability >= 0.42 ? 1 : 0,
      failure_probability: probability,
      risk_level,
      threshold_used: 0.42,
      primary_failure_mode,
      secondary_failure_mode,
      recommendation,
      feature_contributions: contributions,
      timestamp: new Date().toISOString(),
    };
  }

  public static predictBatch(items: PredictionRequest[]): BatchPredictionResponse {
    const t0 = performance.now();
    const predictions: BatchItemPrediction[] = items.map((item, idx) => {
      const pred = this.predict({
        ...item,
        machine_id: item.machine_id || `MCH-BATCH-${String(idx + 1).padStart(4, '0')}`,
      });
      return {
        machine_id: pred.machine_id,
        machine_type: item.machine_type,
        prediction: pred.prediction,
        failure_probability: pred.failure_probability,
        risk_level: pred.risk_level,
        primary_failure_mode: pred.primary_failure_mode,
        recommendation: pred.recommendation,
      };
    });

    const predicted_failures = predictions.filter((p) => p.prediction === 1).length;
    const critical_count = predictions.filter((p) => p.risk_level === 'CRITICAL').length;
    const high_risk_count = predictions.filter((p) => p.risk_level === 'HIGH').length;
    const medium_risk_count = predictions.filter((p) => p.risk_level === 'MEDIUM').length;
    const low_risk_count = predictions.filter((p) => p.risk_level === 'LOW').length;

    const t1 = performance.now();

    return {
      total_records: items.length,
      summary: {
        predicted_failures,
        failure_rate: parseFloat((predicted_failures / (items.length || 1)).toFixed(4)),
        critical_count,
        high_risk_count,
        medium_risk_count,
        low_risk_count,
      },
      predictions,
      processing_time_ms: parseFloat((t1 - t0).toFixed(1)),
    };
  }
}
