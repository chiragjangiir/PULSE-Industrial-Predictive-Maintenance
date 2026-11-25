export type MachineType = 'L' | 'M' | 'H';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type FailureType =
  | 'No Failure'
  | 'Tool Wear Failure (TWF)'
  | 'Heat Dissipation Failure (HDF)'
  | 'Power Failure (PWF)'
  | 'Overstrain Failure (OSF)'
  | 'Random Failure (RNF)';

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'offline';
  version: string;
  uptime_seconds: number;
  model_loaded: boolean;
  model_version: string;
  environment: string;
}

export interface FeatureMeta {
  name: string;
  type: 'numeric' | 'categorical';
  unit?: string;
  description: string;
  min?: number;
  max?: number;
  default?: number | string;
}

export interface ModelInfoResponse {
  model_name: string;
  model_type: string;
  version: string;
  trained_at: string;
  decision_threshold: number;
  features: FeatureMeta[];
}

export interface FeatureContribution {
  feature: string;
  value: number;
  contribution: number;
  description: string;
}

export interface PredictionRequest {
  machine_id?: string;
  machine_type: MachineType;
  air_temperature: number; // Kelvin
  process_temperature: number; // Kelvin
  rotational_speed: number; // RPM
  torque: number; // Nm
  tool_wear: number; // Minutes
}

export interface PredictionResponse {
  machine_id: string;
  prediction: 0 | 1;
  failure_probability: number;
  risk_level: RiskLevel;
  threshold_used: number;
  primary_failure_mode: FailureType;
  secondary_failure_mode?: FailureType;
  recommendation: string;
  feature_contributions?: FeatureContribution[];
  timestamp: string;
}

export interface BatchPredictionSummary {
  predicted_failures: number;
  failure_rate: number;
  critical_count: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
}

export interface BatchItemPrediction {
  machine_id: string;
  machine_type: MachineType;
  prediction: 0 | 1;
  failure_probability: number;
  risk_level: RiskLevel;
  primary_failure_mode: FailureType;
  recommendation: string;
}

export interface BatchPredictionResponse {
  total_records: number;
  summary: BatchPredictionSummary;
  predictions: BatchItemPrediction[];
  processing_time_ms: number;
}

export interface ConfusionMatrix {
  true_negatives: number;
  false_positives: number;
  false_negatives: number;
  true_positives: number;
}

export interface EvaluatedModel {
  id: string;
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  pr_auc: number;
  balanced_accuracy: number;
  confusion_matrix: ConfusionMatrix;
}

export interface CurvePoint {
  threshold: number;
  fpr?: number;
  tpr?: number;
  precision?: number;
  recall?: number;
}

export interface ModelMetricsResponse {
  active_model: string;
  evaluated_models: EvaluatedModel[];
  roc_curve: CurvePoint[];
  precision_recall_curve: CurvePoint[];
}

export interface FeatureImportanceItem {
  feature: string;
  key: string;
  importance: number;
  rank: number;
}

export interface FailureModeBreakdown {
  mode: FailureType;
  primary_driver: string;
}

export interface ExplainabilityResponse {
  feature_importance: FeatureImportanceItem[];
  methodology: string;
  failure_mode_breakdown: FailureModeBreakdown[];
}

export interface AnalyticsOverviewResponse {
  total_records: number;
  total_failures: number;
  overall_failure_rate: number;
  by_machine_type: Record<MachineType, { total: number; failures: number; failure_rate: number }>;
  failure_types_count: Record<string, number>;
  sensor_ranges: Record<string, { mean: number; std: number; min: number; max: number }>;
}

export interface TelemetryPoint {
  timestamp: string;
  air_temperature: number;
  process_temperature: number;
  rotational_speed: number;
  torque: number;
  tool_wear: number;
  vibration_anomaly_index: number;
}

export interface AlertItem {
  id: string;
  machine_id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  predicted_risk: number;
  failure_mode: FailureType;
  message: string;
  timestamp: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  suggested_action: string;
}
