import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { RocPrChart } from '../components/charts/RocPrChart';
import { ConfusionMatrixChart } from '../components/charts/ConfusionMatrixChart';
import { pulseApi } from '../services/api/pulseApi';
import { ModelMetricsResponse, EvaluatedModel } from '../types/api';
import {
  FlaskConical,
  Award,
  Sliders,
  TrendingUp,
  Cpu,
} from 'lucide-react';

export const ModelLabPage: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetricsResponse | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>('xgboost');
  const [thresholdSlider, setThresholdSlider] = useState<number>(0.42);
  const [_isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchMetrics() {
      try {
        const res = await pulseApi.getMetrics();
        if (isMounted) {
          setMetrics(res.data);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedModel: EvaluatedModel | undefined = metrics?.evaluated_models.find(
    (m) => m.id === selectedModelId
  );

  // Dynamic simulated metrics based on threshold slider
  // Lower threshold = higher recall, lower precision
  // Higher threshold = higher precision, lower recall
  const dynamicRecall = Math.min(0.98, Math.max(0.4, 0.825 + (0.42 - thresholdSlider) * 0.45));
  const dynamicPrecision = Math.min(0.97, Math.max(0.3, 0.884 - (0.42 - thresholdSlider) * 0.55));
  const dynamicF1 = (2 * dynamicPrecision * dynamicRecall) / (dynamicPrecision + dynamicRecall);

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>
            <strong>CROSS-MODEL VALIDATION LAB:</strong> Performance benchmarks evaluated across 2,000 stratified
            holdout test observations (20% test split). Stratified K-Fold cross-validation applied.
          </span>
        </div>
        <Badge variant="cyan" size="sm">
          STRATIFIED TEST BENCHMARKS
        </Badge>
      </div>

      {/* Model Benchmark Comparison Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              <Award className="w-4 h-4 text-cyan-400" />
              Candidate Model Benchmark Comparison
            </CardTitle>
            <CardDescription>
              Click any model row to inspect its confusion matrix and operating curve
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0b0e14] border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Algorithm / Model Architecture</th>
                  <th className="py-3 px-3">Accuracy</th>
                  <th className="py-3 px-3">Precision (PPV)</th>
                  <th className="py-3 px-3">Recall (Catch Rate)</th>
                  <th className="py-3 px-3">F1-Score</th>
                  <th className="py-3 px-3">ROC-AUC</th>
                  <th className="py-3 px-3">PR-AUC</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-200">
                {metrics?.evaluated_models.map((m) => {
                  const isSelected = m.id === selectedModelId;
                  const isProduction = m.id === 'xgboost';

                  return (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedModelId(m.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-cyan-950/30 text-white font-semibold' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                        {isProduction && <Award className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                        <span>{m.name}</span>
                      </td>
                      <td className="py-3.5 px-3">{(m.accuracy * 100).toFixed(1)}%</td>
                      <td className="py-3.5 px-3">{(m.precision * 100).toFixed(1)}%</td>
                      <td className="py-3.5 px-3">{(m.recall * 100).toFixed(1)}%</td>
                      <td className="py-3.5 px-3 text-cyan-400 font-bold">{(m.f1_score * 100).toFixed(1)}%</td>
                      <td className="py-3.5 px-3 font-semibold">{(m.roc_auc * 100).toFixed(1)}%</td>
                      <td className="py-3.5 px-3 font-semibold text-emerald-400">{(m.pr_auc * 100).toFixed(1)}%</td>
                      <td className="py-3.5 px-4 text-right">
                        {isProduction ? (
                          <Badge variant="cyan" size="sm">
                            DEPLOYED
                          </Badge>
                        ) : (
                          <Badge variant="slate" size="sm">
                            BENCHMARK
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Selected Model Deep Dive: Curves & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ROC & PR Operating Curves (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Receiver Operating Characteristic (ROC Curve)
                </CardTitle>
                <CardDescription>
                  True Positive Rate (Sensitivity) vs False Positive Rate across all probability cutoffs
                </CardDescription>
              </div>
              <Badge variant="emerald" size="sm">
                AUC: {selectedModel ? (selectedModel.roc_auc * 100).toFixed(1) : '97.8'}%
              </Badge>
            </CardHeader>
            <CardContent>
              {metrics && <RocPrChart type="roc" data={metrics.roc_curve} threshold={thresholdSlider} />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Precision-Recall Operating Curve (PR-AUC)
                </CardTitle>
                <CardDescription>
                  Precision vs Recall trade-off curve (recommended metric for severe 3.39% imbalance)
                </CardDescription>
              </div>
              <Badge variant="emerald" size="sm">
                PR-AUC: {selectedModel ? (selectedModel.pr_auc * 100).toFixed(1) : '89.2'}%
              </Badge>
            </CardHeader>
            <CardContent>
              {metrics && (
                <RocPrChart type="pr" data={metrics.precision_recall_curve} threshold={thresholdSlider} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Confusion Matrix & Threshold Tuning Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Confusion Matrix Card */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Holdout Confusion Matrix
                </CardTitle>
                <CardDescription>Model: {selectedModel?.name}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {selectedModel ? (
                <ConfusionMatrixChart matrix={selectedModel.confusion_matrix} />
              ) : (
                <div className="h-48 flex items-center justify-center text-xs font-mono text-slate-400">
                  Loading matrix...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Decision Threshold Simulator */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Decision Threshold Calibration Simulator
                </CardTitle>
                <CardDescription>
                  Tune the decision cutoff to simulate the balance between false alarms and missed failures
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3.5 rounded bg-[#0a0d14] border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Active Decision Cutoff:</span>
                  <span className="text-sm font-bold text-cyan-400">τ = {thresholdSlider.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.80"
                  step="0.01"
                  value={thresholdSlider}
                  onChange={(e) => setThresholdSlider(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>0.10 (High Sensitivity / Catch All)</span>
                  <span className="text-emerald-400">Calibrated: 0.42</span>
                  <span>0.80 (High Precision / Low Alarm)</span>
                </div>
              </div>

              {/* Dynamic Simulated Impact */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Catch Rate (Recall)</span>
                  <span className="text-base font-bold text-emerald-400">
                    {(dynamicRecall * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Precision (PPV)</span>
                  <span className="text-base font-bold text-cyan-400">
                    {(dynamicPrecision * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Optimal F1</span>
                  <span className="text-base font-bold text-slate-100">
                    {(dynamicF1 * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="p-3 rounded bg-cyan-950/20 border border-cyan-800/40 text-[11px] text-slate-300 leading-relaxed">
                <strong>Industrial Trade-Off Rationale:</strong> In milling operations, an undetected breakdown (False
                Negative) costs ~$4,500 in ruined stock and emergency downtime, whereas a precautionary false alarm
                (False Positive) costs only ~$150 in inspection time. Therefore, tuning the decision cutoff to{' '}
                <code>τ = 0.42</code> maximizes Recall without overwhelming operators with false alarms.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
