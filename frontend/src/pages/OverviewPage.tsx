import React, { useState, useEffect } from 'react';
import { cn } from '../utils/cn';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, RiskBadge, MachineStatusBadge } from '../components/ui/Badge';
import { SensorTrendChart } from '../components/charts/SensorTrendChart';
import { FailureDistributionChart } from '../components/charts/FailureDistributionChart';
import { useApp } from '../context/AppContext';
import { pulseApi } from '../services/api/pulseApi';
import { mockTelemetryStream, mockFleetMachines, FleetMachineRecord } from '../services/mock/mockData';
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
  RotateCw,
  Gauge,
  Flame,
  Wrench,
  WrenchIcon,
  CheckCircle2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const OverviewPage: React.FC = () => {
  const { isDemoMode, setSelectedMachine, alerts } = useApp();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<any>(null);
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ranked machines by risk score
  const rankedMachines = [...mockFleetMachines].sort((a, b) => b.riskScore - a.riskScore);
  const [activeMachine, setActiveMachine] = useState<FleetMachineRecord>(rankedMachines[0] || mockFleetMachines[0]);

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

  // Derived metrics for active machine
  const activeTempDelta = parseFloat((activeMachine.processTemp - activeMachine.airTemp).toFixed(1));
  const activePowerW = Math.round(((activeMachine.speed * 2 * Math.PI) / 60) * activeMachine.torque);

  const handleLaunchDiagnostics = (m: FleetMachineRecord) => {
    setSelectedMachine(m);
    navigate(
      `/predict?type=${m.type}&air=${m.airTemp}&proc=${m.processTemp}&speed=${m.speed}&torque=${m.torque}&wear=${m.toolWear}&id=${m.id}`
    );
  };

  return (
    <div className="space-y-5">
      {/* Simulation / Live Banner Notice */}
      {isDemoMode && (
        <div className="px-3.5 py-2.5 rounded bg-amber-950/20 border border-amber-800/60 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="font-mono text-[11px]">
              <strong>BENCHMARK SIMULATION ACTIVE:</strong> Real-time replay from AI4I 2020 Predictive Maintenance corpus.
            </span>
          </div>
          <Badge variant="amber" size="sm">
            AI4I 2020 SIMULATION
          </Badge>
        </div>
      )}

      {/* 1. HIGH-PERFORMANCE OPERATIONAL STATUS RIBBON (Replaces 4 Giant Bubbly Cards) */}
      <div className="bg-[#111622] border border-slate-800 rounded p-4 space-y-3.5 shadow-xs">
        {/* Top Posture Status Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0 mt-1 sm:mt-0" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-100 font-bold">
                  PLANT OPERATIONAL POSTURE: 1 CRITICAL TRIP RISK
                </span>
                <span className="text-[10px] font-mono bg-rose-950/80 text-rose-300 border border-rose-800/80 px-1.5 py-0.2 rounded font-semibold">
                  Shift Day-1
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Work Cell Bay 1 Milling Unit (MCH-L-1044) has breached safe thermal dissipation envelope. Urgent triage required.
              </p>
            </div>
          </div>

          {/* Plant Health Ratio */}
          <div className="flex flex-col gap-1 w-full sm:w-64">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 tabular-nums">
              <span className="text-emerald-400 font-medium">3 Nominal (37.5%)</span>
              <span className="text-amber-400 font-medium">4 Advisory</span>
              <span className="text-rose-400 font-bold">1 Critical</span>
            </div>
            <div className="w-full h-1.5 rounded bg-slate-800 flex overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: '37.5%' }} />
              <div className="bg-amber-500 h-full" style={{ width: '50.0%' }} />
              <div className="bg-rose-500 h-full" style={{ width: '12.5%' }} />
            </div>
          </div>
        </div>

        {/* Dense Operational Metric Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-0.5">
          <div className="p-2.5 rounded bg-[#0a0d14] border border-slate-800/70">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Monitored Fleet</div>
            <div className="text-lg font-bold font-mono text-slate-100 tabular-nums mt-0.5">
              {totalMachines} Units
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {operationalCount} running nominal &middot; 100% online
            </div>
          </div>

          <div className="p-2.5 rounded bg-rose-950/15 border border-rose-900/40">
            <div className="text-[10px] font-mono uppercase tracking-wider text-rose-300 font-semibold">
              Critical Risk Machines
            </div>
            <div className="text-lg font-bold font-mono text-rose-200 tabular-nums mt-0.5">
              {criticalCount} Unit Flagged
            </div>
            <div className="text-[10px] text-rose-400/80 font-mono mt-0.5">
              Immediate triage &middot; shutdown advised
            </div>
          </div>

          <div className="p-2.5 rounded bg-amber-950/15 border border-amber-900/40">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-semibold">
              High Probability Risks
            </div>
            <div className="text-lg font-bold font-mono text-amber-200 tabular-nums mt-0.5">
              {atRiskCount} Machines
            </div>
            <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">
              Calibrated cutoff &tau; &ge; 0.42 (50% fleet)
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#0a0d14] border border-slate-800/70">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Production Model</div>
            <div className="text-lg font-bold font-mono text-slate-100 tabular-nums mt-0.5">
              {modelInfo ? modelInfo.version : 'v1.2.0'} XGBoost
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
              PR-AUC 89.2% &middot; Calibrated
            </div>
          </div>
        </div>
      </div>

      {/* 2. MASTER-DETAIL RELIABILITY WORKBENCH (Task-Centric Incident Investigation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (5 cols): Risk Priority Watchlist & Attention Queue */}
        <Card className="lg:col-span-5 flex flex-col">
          <CardHeader>
            <div>
              <CardTitle>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Risk Priority Watchlist
              </CardTitle>
              <CardDescription>Select asset to inspect live telemetry & physics drivers</CardDescription>
            </div>
            <Link to="/fleet">
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                All Fleet
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="space-y-2 p-3 flex-1 overflow-y-auto">
            {rankedMachines.slice(0, 6).map((m) => {
              const isSelected = activeMachine.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setActiveMachine(m)}
                  className={cn(
                    'p-2.5 rounded border transition-colors cursor-pointer flex items-center justify-between',
                    isSelected
                      ? 'bg-slate-800/90 border-l-2 border-l-sky-400 border-slate-700 shadow-xs'
                      : m.riskScore >= 0.7
                      ? 'bg-rose-950/20 border-rose-900/50 hover:border-rose-700/70'
                      : m.riskScore >= 0.42
                      ? 'bg-amber-950/15 border-amber-900/40 hover:border-amber-700/60'
                      : 'bg-[#111622] border-slate-800 hover:border-slate-700'
                  )}
                >
                  <div className="min-w-0 pr-2 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('font-mono text-xs font-bold', isSelected ? 'text-sky-300' : 'text-slate-200')}>
                        {m.id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 border border-slate-800 px-1 rounded">
                        {m.type}-Series
                      </span>
                      {m.riskScore >= 0.7 && (
                        <span className="text-[9px] font-mono uppercase bg-rose-500/20 text-rose-400 px-1 py-0.5 rounded font-semibold">
                          &lt; 2h Cutoff
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[190px]">
                      {m.primaryRisk}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-mono text-xs font-bold text-slate-100 tabular-nums">
                      {(m.riskScore * 100).toFixed(0)}%
                    </div>
                    <RiskBadge
                      level={
                        m.riskScore >= 0.7
                          ? 'CRITICAL'
                          : m.riskScore >= 0.42
                          ? 'HIGH'
                          : m.riskScore >= 0.2
                          ? 'MEDIUM'
                          : 'LOW'
                      }
                      size="sm"
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Right (7 cols): Active Asset Diagnostic Inspector & Telemetry Envelope */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <CardHeader>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>
                  <Activity className="w-4 h-4 text-sky-400" />
                  Live Asset Diagnostic Inspector: {activeMachine.id}
                </CardTitle>
              </div>
              <CardDescription>
                {activeMachine.name} &middot; {activeMachine.location} &middot; Primary Driver: {activeMachine.primaryRisk}
              </CardDescription>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="font-mono text-xs h-7"
              onClick={() => handleLaunchDiagnostics(activeMachine)}
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Launch Diagnostics
            </Button>
          </CardHeader>

          <CardContent className="space-y-4 p-4">
            {/* Real-time Engineering Envelopes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono tabular-nums">
              <div className="p-2 rounded bg-[#0a0d14] border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Thermal Delta</span>
                <span className={cn('font-bold text-sm block mt-0.5', activeTempDelta < 8.6 ? 'text-rose-400' : 'text-slate-200')}>
                  {activeTempDelta} K
                </span>
                <span className="text-[9px] text-slate-500">Envelope: &gt; 8.6K</span>
              </div>

              <div className="p-2 rounded bg-[#0a0d14] border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Calculated Power</span>
                <span className={cn('font-bold text-sm block mt-0.5', activePowerW > 9000 || activePowerW < 3500 ? 'text-rose-400' : 'text-slate-200')}>
                  {activePowerW.toLocaleString()} W
                </span>
                <span className="text-[9px] text-slate-500">Safe: 3.5k - 9.0k W</span>
              </div>

              <div className="p-2 rounded bg-[#0a0d14] border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Load Torque</span>
                <span className={cn('font-bold text-sm block mt-0.5', activeMachine.torque > 65 ? 'text-rose-400' : 'text-slate-200')}>
                  {activeMachine.torque} Nm
                </span>
                <span className="text-[9px] text-slate-500">Overload: &gt; 65 Nm</span>
              </div>

              <div className="p-2 rounded bg-[#0a0d14] border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Tool Wear Time</span>
                <span className={cn('font-bold text-sm block mt-0.5', activeMachine.toolWear >= 200 ? 'text-rose-400' : 'text-slate-200')}>
                  {activeMachine.toolWear} min
                </span>
                <span className="text-[9px] text-slate-500">Limit: 200 min</span>
              </div>
            </div>

            {/* Telemetry Stream Chart with Engineering Operating Limits */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Fleet Telemetry Dynamics (24-Hour Stream)</span>
                <span className="text-slate-500 text-[10px]">Normal Operating Envelope Bounds</span>
              </div>
              <SensorTrendChart data={mockTelemetryStream} metricKey="all" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. OPERATIONAL ACTION & FAILURE MODE HISTOGRAM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Failure Mode Distribution */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Zap className="w-4 h-4 text-sky-400" />
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

        {/* Active Maintenance Triage Feed */}
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
          <CardContent className="space-y-2.5 p-3.5">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-2.5 rounded bg-[#0f141d] border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-200">{alert.machine_id}</span>
                    <Badge
                      variant={alert.severity === 'CRITICAL' ? 'rose' : alert.severity === 'HIGH' ? 'amber' : 'cyan'}
                      size="sm"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-slate-300 leading-snug text-[11px]">{alert.message}</p>
                  <p className="text-[10px] font-mono text-sky-300">{alert.suggested_action}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
