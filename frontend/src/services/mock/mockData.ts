import {
  HealthResponse,
  ModelInfoResponse,
  ModelMetricsResponse,
  ExplainabilityResponse,
  AnalyticsOverviewResponse,
  AlertItem,
  TelemetryPoint,
} from '../../types/api';

export const mockHealth: HealthResponse = {
  status: 'healthy',
  version: '1.0.0-simulated',
  uptime_seconds: 3640,
  model_loaded: true,
  model_version: 'v1.2.0-xgboost-calibrated',
  environment: 'development-simulation',
};

export const mockModelInfo: ModelInfoResponse = {
  model_name: 'PULSE Industrial XGBoost Classifier',
  model_type: 'Gradient Boosted Decision Trees (XGBoost)',
  version: '1.2.0',
  trained_at: '2026-11-20T10:15:00Z',
  decision_threshold: 0.42,
  features: [
    { name: 'machine_type', type: 'categorical', description: 'Machine quality class (L: 50%, M: 30%, H: 20%)' },
    { name: 'air_temperature', type: 'numeric', unit: 'K', description: 'Ambient air temperature around spindle', min: 295.0, max: 305.0, default: 298.5 },
    { name: 'process_temperature', type: 'numeric', unit: 'K', description: 'Core workpiece / process temperature', min: 305.0, max: 315.0, default: 308.8 },
    { name: 'rotational_speed', type: 'numeric', unit: 'rpm', description: 'Spindle rotational speed in RPM', min: 1100.0, max: 2900.0, default: 1510.0 },
    { name: 'torque', type: 'numeric', unit: 'Nm', description: 'Spindle load torque', min: 3.0, max: 80.0, default: 41.2 },
    { name: 'tool_wear', type: 'numeric', unit: 'min', description: 'Cumulative tool usage since blade replacement', min: 0.0, max: 260.0, default: 110.0 },
  ],
};

export const mockModelMetrics: ModelMetricsResponse = {
  active_model: 'xgboost',
  evaluated_models: [
    {
      id: 'xgboost',
      name: 'Tuned XGBoost (Selected Production)',
      accuracy: 0.986,
      precision: 0.884,
      recall: 0.825,
      f1_score: 0.853,
      roc_auc: 0.978,
      pr_auc: 0.892,
      balanced_accuracy: 0.908,
      confusion_matrix: {
        true_negatives: 1912,
        false_positives: 18,
        false_negatives: 12,
        true_positives: 58,
      },
    },
    {
      id: 'lightgbm',
      name: 'LightGBM Classifier',
      accuracy: 0.982,
      precision: 0.846,
      recall: 0.786,
      f1_score: 0.815,
      roc_auc: 0.969,
      pr_auc: 0.871,
      balanced_accuracy: 0.887,
      confusion_matrix: {
        true_negatives: 1909,
        false_positives: 21,
        false_negatives: 15,
        true_positives: 55,
      },
    },
    {
      id: 'random_forest',
      name: 'Random Forest (Balanced Weights)',
      accuracy: 0.978,
      precision: 0.812,
      recall: 0.743,
      f1_score: 0.776,
      roc_auc: 0.954,
      pr_auc: 0.835,
      balanced_accuracy: 0.865,
      confusion_matrix: {
        true_negatives: 1905,
        false_positives: 25,
        false_negatives: 18,
        true_positives: 52,
      },
    },
    {
      id: 'logistic_regression',
      name: 'Balanced Logistic Regression (Baseline)',
      accuracy: 0.842,
      precision: 0.285,
      recall: 0.786,
      f1_score: 0.418,
      roc_auc: 0.883,
      pr_auc: 0.492,
      balanced_accuracy: 0.815,
      confusion_matrix: {
        true_negatives: 1629,
        false_positives: 301,
        false_negatives: 15,
        true_positives: 55,
      },
    },
  ],
  roc_curve: [
    { threshold: 1.0, fpr: 0.0, tpr: 0.0 },
    { threshold: 0.9, fpr: 0.001, tpr: 0.22 },
    { threshold: 0.8, fpr: 0.002, tpr: 0.45 },
    { threshold: 0.7, fpr: 0.004, tpr: 0.62 },
    { threshold: 0.6, fpr: 0.006, tpr: 0.73 },
    { threshold: 0.5, fpr: 0.008, tpr: 0.79 },
    { threshold: 0.42, fpr: 0.009, tpr: 0.825 },
    { threshold: 0.3, fpr: 0.018, tpr: 0.88 },
    { threshold: 0.2, fpr: 0.035, tpr: 0.92 },
    { threshold: 0.1, fpr: 0.075, tpr: 0.96 },
    { threshold: 0.05, fpr: 0.14, tpr: 0.98 },
    { threshold: 0.0, fpr: 1.0, tpr: 1.0 },
  ],
  precision_recall_curve: [
    { threshold: 1.0, recall: 0.0, precision: 1.0 },
    { threshold: 0.9, recall: 0.22, precision: 0.97 },
    { threshold: 0.8, recall: 0.45, precision: 0.96 },
    { threshold: 0.7, recall: 0.62, precision: 0.94 },
    { threshold: 0.6, recall: 0.73, precision: 0.91 },
    { threshold: 0.5, recall: 0.79, precision: 0.89 },
    { threshold: 0.42, recall: 0.825, precision: 0.884 },
    { threshold: 0.3, recall: 0.88, precision: 0.78 },
    { threshold: 0.2, recall: 0.92, precision: 0.65 },
    { threshold: 0.1, recall: 0.96, precision: 0.46 },
    { threshold: 0.0, recall: 1.0, precision: 0.035 },
  ],
};

export const mockExplainability: ExplainabilityResponse = {
  feature_importance: [
    { feature: 'Torque [Nm]', key: 'torque', importance: 0.324, rank: 1 },
    { feature: 'Tool Wear [min]', key: 'tool_wear', importance: 0.278, rank: 2 },
    { feature: 'Rotational Speed [rpm]', key: 'rotational_speed', importance: 0.185, rank: 3 },
    { feature: 'Temp Difference (Process - Air)', key: 'temp_diff', importance: 0.112, rank: 4 },
    { feature: 'Process Temperature [K]', key: 'process_temperature', importance: 0.054, rank: 5 },
    { feature: 'Air Temperature [K]', key: 'air_temperature', importance: 0.032, rank: 6 },
    { feature: 'Machine Type (L/M/H)', key: 'machine_type', importance: 0.015, rank: 7 },
  ],
  methodology:
    'TreeSHAP (Tree Shapley Additive Explanations) evaluated across 2,000 stratified holdout test observations. Explanations reflect statistical attributions within the model decision boundaries; they indicate predictive correlation rather than mechanical physical causation.',
  failure_mode_breakdown: [
    {
      mode: 'Tool Wear Failure (TWF)',
      primary_driver:
        'Cumulative milling contact duration. Tool wear reaches replacement boundaries (200-240 min) where blade flaking causes rapid cutting-edge degradation.',
    },
    {
      mode: 'Heat Dissipation Failure (HDF)',
      primary_driver:
        'Insufficient heat transfer caused by low thermal gradient (Process Temp - Air Temp < 8.6 K) combined with low spindle rotational speed (< 1380 rpm).',
    },
    {
      mode: 'Power Failure (PWF)',
      primary_driver:
        'Electrical mechanical power out of bounds (Power = Torque * Speed * 2*pi / 60). Normal window is 3,500W to 9,000W; failures occur if < 3,500W (underload stall) or > 9,000W (overload burnout).',
    },
    {
      mode: 'Overstrain Failure (OSF)',
      primary_driver:
        'Product of tool wear and load torque exceeds critical stress envelope (Tool Wear * Torque threshold based on L/M/H machine variant).',
    },
    {
      mode: 'Random Failure (RNF)',
      primary_driver:
        'Stochastic anomalies, sudden power line spikes, or micro-fractures occurring at 0.1% baseline rate regardless of operational parameters.',
    },
  ],
};

export const mockAnalyticsOverview: AnalyticsOverviewResponse = {
  total_records: 10000,
  total_failures: 339,
  overall_failure_rate: 0.0339,
  by_machine_type: {
    L: { total: 6000, failures: 235, failure_rate: 0.0392 },
    M: { total: 2997, failures: 83, failure_rate: 0.0277 },
    H: { total: 1003, failures: 21, failure_rate: 0.0209 },
  },
  failure_types_count: {
    'Tool Wear Failure (TWF)': 46,
    'Heat Dissipation Failure (HDF)': 115,
    'Power Failure (PWF)': 95,
    'Overstrain Failure (OSF)': 98,
    'Random Failure (RNF)': 19,
  },
  sensor_ranges: {
    air_temperature: { mean: 300.0, std: 2.0, min: 295.3, max: 304.5 },
    process_temperature: { mean: 310.0, std: 1.48, min: 305.7, max: 313.8 },
    rotational_speed: { mean: 1538.7, std: 179.3, min: 1168.0, max: 2886.0 },
    torque: { mean: 39.98, std: 9.97, min: 3.8, max: 76.6 },
    tool_wear: { mean: 107.95, std: 63.65, min: 0.0, max: 253.0 },
  },
};

export const mockTelemetryStream: TelemetryPoint[] = Array.from({ length: 24 }).map((_, i) => {
  const d = new Date(Date.now() - (24 - i) * 10 * 60 * 1000);
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const baseTemp = 298.2 + Math.sin(i / 3) * 1.5;
  const torque = 40 + Math.cos(i / 2) * 8 + (i > 18 ? 12 : 0);
  const speed = 1520 - Math.sin(i / 4) * 120 - (i > 18 ? 80 : 0);
  return {
    timestamp: timeStr,
    air_temperature: parseFloat(baseTemp.toFixed(1)),
    process_temperature: parseFloat((baseTemp + 10.4 + Math.sin(i / 5) * 0.8).toFixed(1)),
    rotational_speed: Math.round(speed),
    torque: parseFloat(torque.toFixed(1)),
    tool_wear: 110 + i * 3,
    vibration_anomaly_index: parseFloat((0.08 + (i > 18 ? 0.45 : 0.02 * Math.sin(i))).toFixed(3)),
  };
});

export const mockAlerts: AlertItem[] = [
  {
    id: 'ALT-9041',
    machine_id: 'MCH-L-1044',
    severity: 'CRITICAL',
    predicted_risk: 0.87,
    failure_mode: 'Heat Dissipation Failure (HDF)',
    message: 'Process-Air delta dropped below 8.2K at 1310 RPM. Coolant flow degradation detected.',
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    suggested_action: 'Reduce spindle cycle, inspect coolant heat exchanger, verify flow valve open.',
  },
  {
    id: 'ALT-9038',
    machine_id: 'MCH-M-2089',
    severity: 'HIGH',
    predicted_risk: 0.74,
    failure_mode: 'Tool Wear Failure (TWF)',
    message: 'Cumulative tool wear reached 214 min with torque variance +24%. Blade edge micro-chipping imminent.',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    suggested_action: 'Schedule blade insert exchange at end of current workpiece batch.',
  },
  {
    id: 'ALT-9025',
    machine_id: 'MCH-L-1102',
    severity: 'HIGH',
    predicted_risk: 0.68,
    failure_mode: 'Power Failure (PWF)',
    message: 'Instantaneous spindle power calculated at 9,420 W, exceeding safe 9,000 W envelope.',
    timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    status: 'ACKNOWLEDGED',
    suggested_action: 'Check spindle drive bearings and reduce cut feed rate.',
  },
  {
    id: 'ALT-8994',
    machine_id: 'MCH-H-3012',
    severity: 'MEDIUM',
    predicted_risk: 0.44,
    failure_mode: 'Overstrain Failure (OSF)',
    message: 'Torque and tool wear product trending toward safety margin threshold.',
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    status: 'ACKNOWLEDGED',
    suggested_action: 'Monitor next three cycles. If torque remains > 55 Nm, pause for blade inspection.',
  },
  {
    id: 'ALT-8910',
    machine_id: 'MCH-M-2015',
    severity: 'INFO',
    predicted_risk: 0.18,
    failure_mode: 'No Failure',
    message: 'Routine calibration inspection complete. Baseline metrics nominal.',
    timestamp: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    status: 'RESOLVED',
    suggested_action: 'No operational action required.',
  },
];

export interface FleetMachineRecord {
  id: string;
  type: 'L' | 'M' | 'H';
  name: string;
  location: string;
  status: 'OPERATIONAL' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE';
  riskScore: number;
  primaryRisk: string;
  airTemp: number;
  processTemp: number;
  speed: number;
  torque: number;
  toolWear: number;
  lastInspection: string;
  hoursOnline: number;
}

export const mockFleetMachines: FleetMachineRecord[] = [
  {
    id: 'MCH-L-1044',
    type: 'L',
    name: 'CNC Milling Cell 04',
    location: 'Bay 1 - Heavy Machining',
    status: 'CRITICAL',
    riskScore: 0.87,
    primaryRisk: 'Heat Dissipation Failure',
    airTemp: 301.2,
    processTemp: 309.1,
    speed: 1310,
    torque: 64.2,
    toolWear: 188,
    lastInspection: '4 hrs ago',
    hoursOnline: 1420,
  },
  {
    id: 'MCH-M-2089',
    type: 'M',
    name: 'Precision Lathe 12',
    location: 'Bay 2 - Precision Turning',
    status: 'WARNING',
    riskScore: 0.74,
    primaryRisk: 'Tool Wear Failure',
    airTemp: 299.4,
    processTemp: 310.2,
    speed: 1490,
    torque: 52.8,
    toolWear: 214,
    lastInspection: '1 day ago',
    hoursOnline: 2100,
  },
  {
    id: 'MCH-L-1102',
    type: 'L',
    name: 'Vertical Machining Center 02',
    location: 'Bay 1 - Heavy Machining',
    status: 'WARNING',
    riskScore: 0.68,
    primaryRisk: 'Power Failure',
    airTemp: 298.8,
    processTemp: 309.4,
    speed: 2450,
    torque: 36.5,
    toolWear: 145,
    lastInspection: '12 hrs ago',
    hoursOnline: 940,
  },
  {
    id: 'MCH-H-3012',
    type: 'H',
    name: 'High-Spec 5-Axis Mill 01',
    location: 'Bay 3 - Aerospace Spec',
    status: 'WARNING',
    riskScore: 0.44,
    primaryRisk: 'Overstrain Risk',
    airTemp: 297.6,
    processTemp: 307.8,
    speed: 1620,
    torque: 48.0,
    toolWear: 172,
    lastInspection: '2 days ago',
    hoursOnline: 3200,
  },
  {
    id: 'MCH-M-2015',
    type: 'M',
    name: 'Universal Milling Rig 07',
    location: 'Bay 2 - Precision Turning',
    status: 'OPERATIONAL',
    riskScore: 0.12,
    primaryRisk: 'Nominal',
    airTemp: 298.1,
    processTemp: 308.5,
    speed: 1540,
    torque: 39.2,
    toolWear: 72,
    lastInspection: '3 days ago',
    hoursOnline: 1850,
  },
  {
    id: 'MCH-H-3005',
    type: 'H',
    name: '5-Axis Machining Center 05',
    location: 'Bay 3 - Aerospace Spec',
    status: 'OPERATIONAL',
    riskScore: 0.08,
    primaryRisk: 'Nominal',
    airTemp: 297.1,
    processTemp: 307.2,
    speed: 1560,
    torque: 38.1,
    toolWear: 34,
    lastInspection: '6 days ago',
    hoursOnline: 4120,
  },
  {
    id: 'MCH-L-1019',
    type: 'L',
    name: 'CNC Drilling Bank 01',
    location: 'Bay 1 - Heavy Machining',
    status: 'OPERATIONAL',
    riskScore: 0.19,
    primaryRisk: 'Nominal',
    airTemp: 299.1,
    processTemp: 309.8,
    speed: 1480,
    torque: 42.1,
    toolWear: 98,
    lastInspection: '2 days ago',
    hoursOnline: 890,
  },
  {
    id: 'MCH-M-2041',
    type: 'M',
    name: 'Horizontal Boring Cell 03',
    location: 'Bay 2 - Precision Turning',
    status: 'MAINTENANCE',
    riskScore: 0.05,
    primaryRisk: 'Under Scheduled Overhaul',
    airTemp: 296.5,
    processTemp: 296.8,
    speed: 0,
    torque: 0,
    toolWear: 0,
    lastInspection: 'Just now',
    hoursOnline: 5120,
  },
];
