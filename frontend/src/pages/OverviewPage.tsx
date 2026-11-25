import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Badge, RiskBadge, MachineStatusBadge } from '@/components/ui/Badge';
import { SensorTrendChart } from '@/components/charts/SensorTrendChart';
import { FailureDistributionChart } from '@/components/charts/FailureDistributionChart';
import { useApp } from '@/context/AppContext';
import { pulseApi } from '@/services/api/pulseApi';
import { mockTelemetryStream, mockFleetMachines } from '@/services/mock/mockData';
import {
  Activity,
  Cpu,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Server,
  Eye,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OverviewPage: React.FC = () => {
  const { isDemoMode, setSelectedMachine, alerts } = useApp();
  const [analytics, setAnalytics] = useState<any>(null);
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [aRes, mRes] = await Promise.all([
          pulseApi.getAnalyticsOverview(),
          pulseApi.getModelInfo(),
        ]);
        if (isMounted) {
          setAnalytics(aRes.data);
          setModelInfo(mRes.data);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalMachines = mockFleetMachines.length;
  const operationalCount = mockFleetMachines.filter((m) => m.status === 'OPERATIONAL').length;
  const atRiskCount = mockFleetMachines.filter((m) => m.riskScore >= 0.42).length;
  const criticalCount = mockFleetMachines.filter((m) => m.status === 'CRITICAL').length;
  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE').slice(0, 4);

  // Ranked machines by risk score
  const rankedMachines = [...mockFleetMachines].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Simulation / Live Banner Notice */}
      {isDemoMode && (
        <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/60 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>SIMULATION MODE ACTIVE:</strong> Dashboard telemetry and fleet health metrics are derived
              from the AI4I 2020 Predictive Maintenance benchmark. No physical sensors connected.
            </span>
          </div>
          <Badge variant="amber" size="sm">
            BENCHMARK SIMULATION
          </Badge>
        </div>
      )}

      {/* Top Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Fleet"
          value={`${totalMachines} Units`}
          subtitle={`${operationalCount} Running Nominal`}
          icon={<Layers className="w-5 h-5" />}
          accentColor="cyan"
          trend={{ value: '100% online', isPositive: true }}
        />
        <StatCard
          title="Critical Risk Machines"
          value={criticalCount}
          subtitle="Immediate triage required"
          icon={<AlertTriangle className="w-5 h-5" />}
          accentColor="rose"
          trend={{ value: `${criticalCount} units flagged`, isPositive: false }}
        />
        <StatCard
          title="High Probability Risks"
          value={atRiskCount}
          subtitle="Threshold >= 0.42"
          icon={<Activity className="w-5 h-5" />}
          accentColor="amber"
          trend={{ value: `${((atRiskCount / totalMachines) * 100).toFixed(0)}% of fleet`, isNeutral: true }}
        />
        <StatCard
          title="Production Model"
          value={modelInfo ? modelInfo.version : 'v1.2.0'}
          subtitle={modelInfo ? modelInfo.model_type.split(' ')[0] : 'XGBoost'}
          icon={<Cpu className="w-5 h-5" />}
          accentColor="emerald"
          trend={{ value: 'Calibrated', isPositive: true }}
        />
      </div>

      {/* Middle Row: Live Sensor Telemetry & High-Risk Priority Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sensor Trend Chart (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>
                <Activity className="w-4 h-4 text-cyan-400" />
                Fleet Telemetry Dynamics (24-Hour Stream)
              </CardTitle>
              <CardDescription>
                Torque (Nm), Process Temperature (K), and Blade Wear (min) across active work cells
              </CardDescription>
            </div>
            <Link to="/analytics">
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                Deep Analysis
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <SensorTrendChart data={mockTelemetryStream} metricKey="all" />
          </CardContent>
        </Card>

        {/* Highest Risk Machine Watchlist (1 col) */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Risk Priority Watchlist
              </CardTitle>
              <CardDescription>Machines ranked by failure probability</CardDescription>
            </div>
            <Link to="/fleet">
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {rankedMachines.map((machine) => (
              <div
                key={machine.id}
                onClick={() => setSelectedMachine(machine)}
                className="p-3 rounded bg-[#0f141d] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {machine.id}
                    </span>
                    <Badge variant="slate" size="sm">
                      Series {machine.type}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[170px]">
                    {machine.primaryRisk}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-slate-100">
                    {(machine.riskScore * 100).toFixed(0)}%
                  </div>
                  <RiskBadge
                    level={
                      machine.riskScore >= 0.7
                        ? 'CRITICAL'
                        : machine.riskScore >= 0.42
                        ? 'HIGH'
                        : machine.riskScore >= 0.2
                        ? 'MEDIUM'
                        : 'LOW'
                    }
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Failure Mode Breakdown & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Failure Mode Distribution */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Zap className="w-4 h-4 text-amber-400" />
                Benchmark Failure Mode Distribution
              </CardTitle>
              <CardDescription>
                Historical failure incidence across AI4I 2020 validation records
              </CardDescription>
            </div>
            <Link to="/explainability">
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                SHAP Attributions
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {analytics?.failure_types_count ? (
              <FailureDistributionChart data={analytics.failure_types_count} />
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 text-xs font-mono">
                Loading benchmark metrics...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Urgent Operational Alerts */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Active Maintenance Triage Feed
              </CardTitle>
              <CardDescription>Recent anomaly events requiring operator verification</CardDescription>
            </div>
            <Link to="/alerts">
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                Alerts Center
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded bg-[#0f141d] border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-200">{alert.machine_id}</span>
                    <Badge
                      variant={alert.severity === 'CRITICAL' ? 'rose' : alert.severity === 'HIGH' ? 'amber' : 'cyan'}
                      size="sm"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{alert.message}</p>
                  <p className="text-[10px] font-mono text-cyan-400/90">{alert.suggested_action}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
