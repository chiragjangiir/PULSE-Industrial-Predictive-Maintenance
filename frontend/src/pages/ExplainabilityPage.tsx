import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FeatureImportanceChart } from '../components/charts/FeatureImportanceChart';
import { pulseApi } from '../services/api/pulseApi';
import { ExplainabilityResponse } from '../types/api';
import {
  Sparkles,
  AlertOctagon,
  ShieldAlert,
  Flame,
  Gauge,
  RotateCw,
  Wrench,
  HelpCircle,
  Zap,
} from 'lucide-react';

export const ExplainabilityPage: React.FC = () => {
  const [data, setData] = useState<ExplainabilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchExplainability() {
      try {
        const res = await pulseApi.getExplainability();
        if (isMounted) {
          setData(res.data);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchExplainability();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Critical Scientific Caveat Alert */}
      <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-800/80 flex items-start gap-3 text-xs text-amber-200">
        <AlertOctagon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-amber-100 font-semibold block text-sm">
            Methodological Notice: Association vs Physical Causation
          </strong>
          <p className="leading-relaxed">
            Feature attributions and TreeSHAP values reflect statistical contributions within the trained decision tree
            ensembles. While high SHAP values highlight parameters strongly associated with failure events,{' '}
            <strong>they do not constitute mechanical proof of direct physical causation</strong>. Operators must
            cross-validate model predictions with physical inspection protocols.
          </p>
        </div>
      </div>

      {/* Global TreeSHAP Feature Attributions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feature Importance Chart (7 cols) */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Global TreeSHAP Feature Attributions
                </CardTitle>
                <CardDescription>
                  Mean absolute Shapley attributions across 2,000 stratified validation observations
                </CardDescription>
              </div>
              <Badge variant="cyan" size="sm">
                TreeSHAP (Lundberg et al.)
              </Badge>
            </CardHeader>
            <CardContent>
              {data ? (
                <FeatureImportanceChart data={data.feature_importance} />
              ) : (
                <div className="h-72 flex items-center justify-center text-xs font-mono text-slate-400">
                  Loading SHAP values...
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Methodology & Game Theory Explanation (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                Explainability Methodology
              </CardTitle>
              <CardDescription>How PULSE computes model transparency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs text-slate-300 leading-relaxed font-sans">
              <p>
                PULSE employs <strong>TreeSHAP (Tree Shapley Additive Explanations)</strong>, an exact polynomial-time
                algorithm derived from cooperative game theory.
              </p>
              <p>
                In cooperative game theory, Shapley values allocate total payout among players based on their marginal
                contribution. Here, individual sensor measurements act as players, and the model prediction is the
                payout.
              </p>
              <div className="p-3 rounded bg-[#0a0d14] border border-slate-800 font-mono text-[11px] text-cyan-300">
                f(x) = E[f(x)] + Σ φᵢ(x)
                <div className="text-[10px] text-slate-400 mt-1">
                  Prediction equals baseline expected value plus sum of all local feature contributions.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Failure Mode Physical Drivers */}
      <Card>
        <CardHeader>
          <CardTitle>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Machine Failure Modes & Underlying Physical Drivers
          </CardTitle>
          <CardDescription>
            Theoretical mechanics governing failure occurrences in computer numerical control (CNC) machining
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tool Wear Failure */}
          <div className="p-4 rounded-lg bg-[#0e121a] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-rose-950/40 border border-rose-800/40 text-rose-400">
                <Wrench className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-slate-100">Tool Wear Failure (TWF)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Milling blades experience cumulative abrasive wear during cutting. When cumulative usage surpasses the
              critical 200–240 minute threshold, micro-chipping leads to sudden blade snapping.
            </p>
          </div>

          {/* Heat Dissipation Failure */}
          <div className="p-4 rounded-lg bg-[#0e121a] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-amber-950/40 border border-amber-800/40 text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-slate-100">Heat Dissipation (HDF)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Occurs when the temperature difference between process workpiece and ambient air falls below 8.6 K while
              spindle rotational speed is lower than 1,380 rpm, halting forced convection cooling.
            </p>
          </div>

          {/* Power Failure */}
          <div className="p-4 rounded-lg bg-[#0e121a] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-indigo-950/40 border border-indigo-800/40 text-indigo-400">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-slate-100">Power Failure (PWF)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mechanical power is <code>Power = Torque * Speed * 2π / 60</code>. If required power drops below 3,500 W
              (underload spindle stall) or exceeds 9,000 W (electrical overload burnout), PWF triggers.
            </p>
          </div>

          {/* Overstrain Failure */}
          <div className="p-4 rounded-lg bg-[#0e121a] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-purple-950/40 border border-purple-800/40 text-purple-400">
                <Gauge className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-slate-100">Overstrain Failure (OSF)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Caused by the product of tool wear and torque exceeding structural shear resistance limits: &gt;11,000
              for L-series, &gt;12,000 for M-series, and &gt;13,000 for H-series variants.
            </p>
          </div>

          {/* Random Failure */}
          <div className="p-4 rounded-lg bg-[#0e121a] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-slate-800 text-slate-300">
                <RotateCw className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-slate-100">Random Failure (RNF)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unpredictable catastrophic breakdown occurring at a baseline rate of ~0.1%, representing sudden voltage
              surges or internal material defects uncorrelated with sensor telemetry.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
