import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { FailureDistributionChart } from '../components/charts/FailureDistributionChart';
import { TorqueSpeedScatter } from '../components/charts/TorqueSpeedScatter';
import { pulseApi } from '../services/api/pulseApi';
import { AnalyticsOverviewResponse } from '../types/api';
import {
  BarChart3,
  Flame,
  Gauge,
  RotateCw,
  Wrench,
  Info,
  Layers,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchAnalytics() {
      try {
        const res = await pulseApi.getAnalyticsOverview();
        if (isMounted) {
          setData(res.data);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchAnalytics();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>
            <strong>BENCHMARK DATASET ANALYTICS:</strong> Analytics displayed reflect the 10,000-record AI4I 2020
            Predictive Maintenance reference corpus, serving as the baseline ground truth for model validation.
          </span>
        </div>
        <Badge variant="cyan" size="sm">
          EDA REFERENCE CORPUS
        </Badge>
      </div>

      {/* Benchmark Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Observations"
          value="10,000"
          subtitle="Milling machine cycles"
          icon={<Layers className="w-5 h-5" />}
          accentColor="slate"
        />
        <StatCard
          title="Total Machine Failures"
          value="339 Events"
          subtitle="Severe class imbalance"
          icon={<BarChart3 className="w-5 h-5" />}
          accentColor="rose"
          trend={{ value: '3.39% baseline', isNeutral: true }}
        />
        <StatCard
          title="L-Series Failure Rate"
          value="3.92%"
          subtitle="235 failures in 6,000 units"
          icon={<TrendingDown className="w-5 h-5" />}
          accentColor="amber"
          trend={{ value: 'Highest risk class', isPositive: false }}
        />
        <StatCard
          title="H-Series Failure Rate"
          value="2.09%"
          subtitle="21 failures in 1,003 units"
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="emerald"
          trend={{ value: '47% lower failure rate', isPositive: true }}
        />
      </div>

      {/* Middle Row: Failure Modes & Torque-Speed Envelope */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Failure Mode Distribution */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Failure Mode Classification Breakdown
              </CardTitle>
              <CardDescription>
                Absolute distribution of failure modes in the AI4I 2020 reference set
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {data ? (
              <FailureDistributionChart data={data.failure_types_count} />
            ) : (
              <div className="h-64 flex items-center justify-center text-xs font-mono text-slate-400">
                Loading distributions...
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <strong>Observation:</strong> Heat Dissipation (HDF, 115) and Overstrain (OSF, 98) account for over 62%
              of all recorded downtime events, followed closely by Power Failure (PWF, 95).
            </div>
          </CardContent>
        </Card>

        {/* Torque vs Rotational Speed Scatter */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Gauge className="w-4 h-4 text-indigo-400" />
                Torque vs Speed Operational Safety Envelope
              </CardTitle>
              <CardDescription>
                Power boundary envelope: Nominal operating area vs failure modes
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <TorqueSpeedScatter />
            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <strong>Physics Rule:</strong> Spindle power is calculated as <code>P = (2π * Speed / 60) * Torque</code>.
              Power failures consistently trigger when calculated power drops below 3,500 W or surges beyond 9,000 W.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sensor Statistical Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Layers className="w-4 h-4 text-cyan-400" />
            Sensor Distribution Statistics & Nominal Operating Ranges
          </CardTitle>
          <CardDescription>
            Descriptive statistics across all 10,000 milling machine operational observations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0b0e14] border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Telemetry Parameter</th>
                  <th className="py-3 px-4">Physical Unit</th>
                  <th className="py-3 px-4">Mean (μ)</th>
                  <th className="py-3 px-4">Std Dev (σ)</th>
                  <th className="py-3 px-4">Minimum Bound</th>
                  <th className="py-3 px-4">Maximum Bound</th>
                  <th className="py-3 px-4">Critical Boundary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-200">
                <tr>
                  <td className="py-3 px-4 font-bold flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-amber-400" /> Air Temperature
                  </td>
                  <td className="py-3 px-4 text-slate-400">Kelvin [K]</td>
                  <td className="py-3 px-4">300.0 K</td>
                  <td className="py-3 px-4">±2.0 K</td>
                  <td className="py-3 px-4">295.3 K</td>
                  <td className="py-3 px-4">304.5 K</td>
                  <td className="py-3 px-4 text-slate-400">Ambient dependent</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-rose-400" /> Process Temperature
                  </td>
                  <td className="py-3 px-4 text-slate-400">Kelvin [K]</td>
                  <td className="py-3 px-4">310.0 K</td>
                  <td className="py-3 px-4">±1.48 K</td>
                  <td className="py-3 px-4">305.7 K</td>
                  <td className="py-3 px-4">313.8 K</td>
                  <td className="py-3 px-4 text-rose-400 font-semibold">Delta &lt; 8.6 K (HDF)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold flex items-center gap-2">
                    <RotateCw className="w-3.5 h-3.5 text-cyan-400" /> Rotational Speed
                  </td>
                  <td className="py-3 px-4 text-slate-400">rpm</td>
                  <td className="py-3 px-4">1,538.7 rpm</td>
                  <td className="py-3 px-4">±179.3 rpm</td>
                  <td className="py-3 px-4">1,168 rpm</td>
                  <td className="py-3 px-4">2,886 rpm</td>
                  <td className="py-3 px-4 text-amber-400">&lt; 1,380 rpm low dissipation</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold flex items-center gap-2">
                    <Gauge className="w-3.5 h-3.5 text-indigo-400" /> Load Torque
                  </td>
                  <td className="py-3 px-4 text-slate-400">Nm</td>
                  <td className="py-3 px-4">39.98 Nm</td>
                  <td className="py-3 px-4">±9.97 Nm</td>
                  <td className="py-3 px-4">3.8 Nm</td>
                  <td className="py-3 px-4">76.6 Nm</td>
                  <td className="py-3 px-4 text-rose-400 font-semibold">&gt; 65 Nm overstrain</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-pink-400" /> Tool Wear Contact
                  </td>
                  <td className="py-3 px-4 text-slate-400">minutes [min]</td>
                  <td className="py-3 px-4">107.95 min</td>
                  <td className="py-3 px-4">±63.65 min</td>
                  <td className="py-3 px-4">0 min</td>
                  <td className="py-3 px-4">253 min</td>
                  <td className="py-3 px-4 text-rose-400 font-semibold">&gt; 200 min replacement</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
