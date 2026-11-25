import { ApiClient, defaultApiClient } from './apiClient';
import {
  HealthResponse,
  ModelInfoResponse,
  PredictionRequest,
  PredictionResponse,
  BatchPredictionResponse,
  ModelMetricsResponse,
  ExplainabilityResponse,
  AnalyticsOverviewResponse,
  RiskLevel,
  FailureType,
} from '@/types/api';
import {
  mockHealth,
  mockModelInfo,
  mockModelMetrics,
  mockExplainability,
  mockAnalyticsOverview,
} from '@/services/mock/mockData';
import { MockPredictionService } from '@/services/mock/mockService';

export class PulseApiService {
  private client: ApiClient;
  private forceDemoMode: boolean = false;

  constructor(client: ApiClient = defaultApiClient) {
    this.client = client;
    if (typeof window !== 'undefined') {
      const savedDemo = localStorage.getItem('pulse_demo_mode');
      if (savedDemo !== null) {
        this.forceDemoMode = savedDemo === 'true';
      } else if (import.meta.env.MODE === 'test') {
        this.forceDemoMode = true;
      }
    }
  }

  public isDemoMode(): boolean {
    return this.forceDemoMode;
  }

  public setDemoMode(demo: boolean) {
    this.forceDemoMode = demo;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pulse_demo_mode', String(demo));
    }
  }

  public async getHealth(): Promise<{ data: HealthResponse; isSimulated: boolean }> {
    if (this.forceDemoMode) {
      return { data: mockHealth, isSimulated: true };
    }
    try {
      const res: any = await this.client.get('/health');
      return {
        data: {
          status: res.status || 'healthy',
          version: res.version || '1.0.0',
          uptime_seconds: res.uptime_seconds || 1200,
          model_loaded: res.model_loaded ?? true,
          model_version: res.model_name || 'GradientBoostingClassifier',
          environment: 'production',
        },
        isSimulated: false,
      };
    } catch (_err) {
      return { data: mockHealth, isSimulated: true };
    }
  }

  public async getModelInfo(): Promise<{ data: ModelInfoResponse; isSimulated: boolean }> {
    if (this.forceDemoMode) {
      return { data: mockModelInfo, isSimulated: true };
    }
    try {
      const res: any = await this.client.get('/model/info');
      return {
        data: {
          model_name: res.model_id || 'PULSE Industrial Predictor',
          model_type: res.algorithm || 'Gradient Boosting Classifier',
          version: res.dataset_version || '1.0',
          trained_at: res.trained_at || new Date().toISOString(),
          decision_threshold: res.decision_threshold || 0.32,
          features: mockModelInfo.features,
        },
        isSimulated: false,
      };
    } catch {
      return { data: mockModelInfo, isSimulated: true };
    }
  }

  public async predict(req: PredictionRequest): Promise<{ data: PredictionResponse; isSimulated: boolean }> {
    if (this.forceDemoMode) {
      return { data: MockPredictionService.predict(req), isSimulated: true };
    }
    try {
      // Format payload matching backend Pydantic MachineFeatures schema
      const payload = {
        machine_id: req.machine_id,
        type: req.machine_type,
        air_temperature_k: req.air_temperature,
        process_temperature_k: req.process_temperature,
        rotational_speed_rpm: req.rotational_speed,
        torque_nm: req.torque,
        tool_wear_min: req.tool_wear,
      };

      const res: any = await this.client.post('/predict', payload);

      // Infer failure mode from recommendation reasons or tool wear
      let inferredMode: FailureType = 'No Failure';
      if (res.failure_predicted || res.prediction === 1) {
        const text = JSON.stringify(res.recommendations || '').toLowerCase();
        if (text.includes('tool wear') || req.tool_wear >= 200) inferredMode = 'Tool Wear Failure (TWF)';
        else if (text.includes('heat') || req.process_temperature - req.air_temperature < 8.6)
          inferredMode = 'Heat Dissipation Failure (HDF)';
        else if (text.includes('torque') || text.includes('shear')) inferredMode = 'Overstrain Failure (OSF)';
        else inferredMode = 'Power Failure (PWF)';
      }

      const recText =
        res.recommendations && res.recommendations.length > 0
          ? res.recommendations.map((r: any) => `${r.action}: ${r.reason}`).join('. ')
          : res.failure_predicted
          ? 'Anomalous parameters detected. Schedule immediate maintenance inspection.'
          : 'Operating nominal. Maintain standard shift inspection.';

      const contributions = (res.contributing_factors || []).map((cf: any) => ({
        feature: cf.feature.replace(/_/g, ' '),
        value: cf.value,
        contribution: cf.importance_weight,
        description: `Impact weight ${(cf.importance_weight * 100).toFixed(1)}%`,
      }));

      return {
        data: {
          machine_id: res.machine_id || req.machine_id || 'MCH-001',
          prediction: (res.prediction ?? (res.failure_predicted ? 1 : 0)) as 0 | 1,
          failure_probability: res.failure_probability,
          risk_level: (res.risk_level || 'LOW') as RiskLevel,
          threshold_used: res.decision_threshold || 0.32,
          primary_failure_mode: inferredMode,
          recommendation: recText,
          feature_contributions: contributions.length > 0 ? contributions : MockPredictionService.predict(req).feature_contributions,
          timestamp: new Date().toISOString(),
        },
        isSimulated: false,
      };
    } catch (_err) {
      // Graceful fallback with clear simulation flag
      return { data: MockPredictionService.predict(req), isSimulated: true };
    }
  }

  public async predictBatch(items: PredictionRequest[]): Promise<{ data: BatchPredictionResponse; isSimulated: boolean }> {
    if (this.forceDemoMode) {
      return { data: MockPredictionService.predictBatch(items), isSimulated: true };
    }
    try {
      const payload = {
        machines: items.map((m) => ({
          machine_id: m.machine_id,
          type: m.machine_type,
          air_temperature_k: m.air_temperature,
          process_temperature_k: m.process_temperature,
          rotational_speed_rpm: m.rotational_speed,
          torque_nm: m.torque,
          tool_wear_min: m.tool_wear,
        })),
      };

      const t0 = performance.now();
      const res: any = await this.client.post('/predict/batch', payload);
      const t1 = performance.now();

      const riskDist = res.fleet_risk_distribution || {};

      const predictions = (res.results || []).map((r: any, idx: number) => {
        const item = items[idx];
        return {
          machine_id: r.machine_id || item.machine_id,
          machine_type: item.machine_type,
          prediction: r.prediction,
          failure_probability: r.failure_probability,
          risk_level: r.risk_level,
          primary_failure_mode: r.prediction === 1 ? 'Predicted Anomaly' : 'No Failure',
          recommendation: r.recommendations?.[0]?.action || (r.prediction === 1 ? 'Inspect spindle' : 'Nominal operation'),
        };
      });

      return {
        data: {
          total_records: res.total_records || items.length,
          summary: {
            predicted_failures: res.predicted_failures || 0,
            failure_rate: (res.predicted_failures || 0) / (res.total_records || 1),
            critical_count: riskDist['CRITICAL'] || 0,
            high_risk_count: riskDist['HIGH'] || 0,
            medium_risk_count: riskDist['MEDIUM'] || 0,
            low_risk_count: riskDist['LOW'] || 0,
          },
          predictions,
          processing_time_ms: parseFloat((t1 - t0).toFixed(1)),
        },
        isSimulated: false,
      };
    } catch {
      return { data: MockPredictionService.predictBatch(items), isSimulated: true };
    }
  }

  public async getMetrics(): Promise<{ data: ModelMetricsResponse; isSimulated: boolean }> {
    if (this.forceDemoMode) {
      return { data: mockModelMetrics, isSimulated: true };
    }
    try {
      const [metricsRes, compareRes]: [any, any] = await Promise.all([
        this.client.get('/analytics/model-metrics'),
        this.client.get('/models/compare'),
      ]);

      if (compareRes && Array.isArray(compareRes)) {
        const evaluated = compareRes.map((m: any) => ({
          id: m.model_name.toLowerCase().replace(/\s+/g, '_'),
          name: m.model_name,
          accuracy: m.accuracy || 0.98,
          precision: m.precision || 0.85,
          recall: m.recall || 0.82,
          f1_score: m.f1_score || 0.83,
          roc_auc: m.roc_auc || 0.97,
          pr_auc: m.pr_auc || 0.84,
          balanced_accuracy: (m.recall + (m.specificity || 0.98)) / 2,
          confusion_matrix: m.confusion_matrix || mockModelMetrics.evaluated_models[0].confusion_matrix,
        }));

        return {
          data: {
            active_model: evaluated[0]?.id || 'xgboost',
            evaluated_models: evaluated,
            roc_curve: metricsRes.roc_curve || mockModelMetrics.roc_curve,
            precision_recall_curve: metricsRes.precision_recall_curve || mockModelMetrics.precision_recall_curve,
          },
          isSimulated: false,
        };
      }

      return { data: mockModelMetrics, isSimulated: true };
    } catch {
      return { data: mockModelMetrics, isSimulated: true };
    }
  }

  public async getExplainability(): Promise<{ data: ExplainabilityResponse; isSimulated: boolean }> {
    if (this.forceDemoMode) {
      return { data: mockExplainability, isSimulated: true };
    }
    try {
      const res: any = await this.client.get('/analytics/feature-importance');
      if (res && res.features && res.importances) {
        const featureImportance = res.features.map((feat: string, i: number) => ({
          feature: feat.replace(/_/g, ' '),
          key: feat,
          importance: res.importances[i] || 0.1,
          rank: i + 1,
        }));

        return {
          data: {
            feature_importance: featureImportance,
            methodology: mockExplainability.methodology,
            failure_mode_breakdown: mockExplainability.failure_mode_breakdown,
          },
          isSimulated: false,
        };
      }
      return { data: mockExplainability, isSimulated: true };
    } catch {
      return { data: mockExplainability, isSimulated: true };
    }
  }

  public async getAnalyticsOverview(): Promise<{ data: AnalyticsOverviewResponse; isSimulated: boolean }> {
    if (this.forceDemoMode) {
      return { data: mockAnalyticsOverview, isSimulated: true };
    }
    try {
      const [summaryRes, failureRes]: [any, any] = await Promise.all([
        this.client.get('/analytics/summary'),
        this.client.get('/analytics/failure-distribution'),
      ]);

      return {
        data: {
          total_records: summaryRes.total_machines || 10000,
          total_failures: summaryRes.total_failures || 339,
          overall_failure_rate: (summaryRes.failure_rate_percent || 3.39) / 100,
          by_machine_type: failureRes.failure_by_type || mockAnalyticsOverview.by_machine_type,
          failure_types_count: failureRes.failure_breakdown || mockAnalyticsOverview.failure_types_count,
          sensor_ranges: summaryRes.sensor_ranges || mockAnalyticsOverview.sensor_ranges,
        },
        isSimulated: false,
      };
    } catch {
      return { data: mockAnalyticsOverview, isSimulated: true };
    }
  }
}

export const pulseApi = new PulseApiService();
