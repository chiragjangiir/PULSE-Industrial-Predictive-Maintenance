import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Info,
  BookOpen,
  Scale,
  GitBranch,
  Binary,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Overview Card */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              <BookOpen className="w-4 h-4 text-cyan-400" />
              PULSE: Industrial Intelligence & Predictive Maintenance Platform
            </CardTitle>
            <CardDescription>
              Academic specifications, system architecture, mathematical formulations, and engineering references
            </CardDescription>
          </div>
          <Badge variant="cyan" size="sm">
            APPLIED PREDICTIVE ANALYSIS (SEM-V)
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          <p>
            <strong>PULSE</strong> is an industrial-grade, explainable machine learning software system designed to
            predict milling machine failures, analyze continuous operational telemetry, assess multi-tier failure risks,
            and provide actionable engineering recommendations to machine operators.
          </p>
          <p>
            Unlike generic analytics dashboards, PULSE incorporates exact thermodynamic and mechanical failure physics
            derived from the <strong>AI4I 2020 Predictive Maintenance Dataset</strong>, establishing an end-to-end bridge
            between high-dimensional predictive models and shop-floor operations.
          </p>
        </CardContent>
      </Card>

      {/* Dataset & Physics Rules */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Binary className="w-4 h-4 text-indigo-400" />
            Dataset Reference & Mechanical Formulations
          </CardTitle>
          <CardDescription>
            Theoretical formulation of the AI4I 2020 synthetic milling machine benchmark
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          <p>
            The dataset consists of 10,000 continuous operational data points representing computer numerical control (CNC)
            milling machines, generated to reflect real-world industrial machinery behavior.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded bg-[#0e121a] border border-slate-800 font-mono text-[11px] space-y-1">
              <span className="text-cyan-400 font-bold block">1. Spindle Power (PWF)</span>
              <div className="text-slate-100 font-semibold">P = (2π · ω / 60) · τ</div>
              <div className="text-slate-400 text-[10px]">
                Failure triggers if calculated power &lt; 3,500 W (underload stall) or &gt; 9,000 W (electrical overload).
              </div>
            </div>

            <div className="p-3 rounded bg-[#0e121a] border border-slate-800 font-mono text-[11px] space-y-1">
              <span className="text-amber-400 font-bold block">2. Heat Dissipation (HDF)</span>
              <div className="text-slate-100 font-semibold">ΔT = T_proc - T_air &lt; 8.6 K</div>
              <div className="text-slate-400 text-[10px]">
                Triggered when thermal gradient is insufficient (&lt; 8.6 K) at low rotational speeds (ω &lt; 1,380 rpm).
              </div>
            </div>

            <div className="p-3 rounded bg-[#0e121a] border border-slate-800 font-mono text-[11px] space-y-1">
              <span className="text-rose-400 font-bold block">3. Overstrain (OSF)</span>
              <div className="text-slate-100 font-semibold">Product = W_tool · τ</div>
              <div className="text-slate-400 text-[10px]">
                Failure occurs when mechanical stress exceeds variant limits: L &gt; 11,000, M &gt; 12,000, H &gt; 13,000.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class Imbalance & Evaluation Methodology */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Scale className="w-4 h-4 text-emerald-400" />
            Severe Class Imbalance & Evaluation Strategy
          </CardTitle>
          <CardDescription>
            Why raw accuracy is a misleading metric in industrial predictive maintenance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
          <p>
            In the AI4I 2020 dataset, exactly <strong>339 out of 10,000 observations (3.39%)</strong> represent machine
            failures. A naive majority-class classifier predicting <em>"No Failure"</em> achieves <strong>96.61% accuracy</strong>,
            yet fails 100% of the time to prevent equipment downtime.
          </p>
          <p>
            To address this asymmetry, PULSE emphasizes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>
              <strong className="text-slate-200">Precision-Recall AUC (PR-AUC):</strong> Evaluates model performance
              specifically on the minority positive class without distortion from true negative volume.
            </li>
            <li>
              <strong className="text-slate-200">Recall / Sensitivity:</strong> Measures the fraction of actual breakdowns
              successfully caught before catastrophic failure occurs.
            </li>
            <li>
              <strong className="text-slate-200">Decision Threshold Tuning (τ = 0.42):</strong> Calibrated cutoff to minimize
              expensive false negatives while keeping false alarms within manageable operational boundaries.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Division of Engineering Responsibility */}
      <Card>
        <CardHeader>
          <CardTitle>
            <GitBranch className="w-4 h-4 text-cyan-400" />
            Division of Engineering Scope (Part A vs Part B)
          </CardTitle>
          <CardDescription>
            Clean architectural separation between ML backend and frontend intelligence dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#0e121a] border border-slate-800 space-y-2">
              <span className="font-mono text-cyan-400 font-semibold block text-xs">
                Part A: ML Research & FastAPI Backend
              </span>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                <li>Google Colab exploratory data analysis & feature engineering</li>
                <li>Algorithm comparison: XGBoost, LightGBM, Random Forest, Logistic Regression</li>
                <li>Hyperparameter optimization and cost-sensitive loss calibration</li>
                <li>FastAPI REST API routes adhering to <code>docs/API_CONTRACT.md</code></li>
                <li>Model artifact serialization (<code>.joblib</code>)</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-[#0e121a] border border-slate-800 space-y-2">
              <span className="font-mono text-emerald-400 font-semibold block text-xs">
                Part B: Frontend & Industrial Dashboard (This Scope)
              </span>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                <li>Modern React 19 + TypeScript + Tailwind CSS industrial architecture</li>
                <li>9 fully functional pages with responsive telemetry layout</li>
                <li>Tactile diagnostic sandbox with parameter presets and sliders</li>
                <li>Batch CSV drag-and-drop parsing, validation, and export</li>
                <li>Model Lab operating curves and interactive threshold simulator</li>
                <li>TreeSHAP explainability hub and ethical caveat alerts</li>
                <li>Offline simulation adapter matching API schemas with live toggle</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* References & Citations */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Info className="w-4 h-4 text-slate-400" />
            Academic Citations & Documentation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs font-mono text-slate-400">
          <div>
            1. Matzka, S. (2020). <em>Explainable Artificial Intelligence for Predictive Maintenance Applications</em>.
            Third International Conference on Artificial Intelligence for Industries (AI4I), 2020, pp. 69-74.
          </div>
          <div>
            2. Lundberg, S. M., & Lee, S. I. (2017). <em>A Unified Approach to Interpreting Model Predictions</em>.
            Advances in Neural Information Processing Systems (NeurIPS 30).
          </div>
          <div>
            3. UCI Machine Learning Repository: AI4I 2020 Predictive Maintenance Dataset.
            DOI: 10.24432/C5HS5C.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
