import React from 'react';
import { Drawer } from '../ui/Drawer';
import { RiskBadge, MachineStatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { formatTemperature } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Activity, Gauge, Flame, RotateCw, Wrench, ShieldAlert, Cpu } from 'lucide-react';

export const MachineDetailDrawer: React.FC = () => {
  const { selectedMachine, setSelectedMachine } = useApp();
  const navigate = useNavigate();

  if (!selectedMachine) return null;

  const tempDiff = selectedMachine.processTemp - selectedMachine.airTemp;
  // Calculate power in kW = (speed * 2 * pi / 60) * torque / 1000
  const powerKw = ((selectedMachine.speed * 2 * Math.PI) / 60) * (selectedMachine.torque / 1000);
  const overstrainScore = (selectedMachine.toolWear * selectedMachine.torque) / 100;

  const handleDiagnose = () => {
    setSelectedMachine(null);
    navigate(
      `/predict?type=${selectedMachine.type}&air=${selectedMachine.airTemp}&proc=${selectedMachine.processTemp}&speed=${selectedMachine.speed}&torque=${selectedMachine.torque}&wear=${selectedMachine.toolWear}&id=${selectedMachine.id}`
    );
  };

  return (
    <Drawer
      isOpen={Boolean(selectedMachine)}
      onClose={() => setSelectedMachine(null)}
      title={selectedMachine.name}
      subtitle={`ID: ${selectedMachine.id} • Variant: ${selectedMachine.type}-Series • ${selectedMachine.location}`}
      width="lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={() => setSelectedMachine(null)}>
            Close
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Cpu className="w-4 h-4" />} onClick={handleDiagnose}>
            Load In Diagnostics Sandbox
          </Button>
        </>
      }
    >
      {/* Top Status & Risk Overview */}
      <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-[#141923] border border-slate-800">
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400">Operational State</span>
          <div className="mt-1">
            <MachineStatusBadge status={selectedMachine.status} />
          </div>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400">Failure Risk Assessment</span>
          <div className="mt-1 flex items-center gap-2">
            <RiskBadge
              level={
                selectedMachine.riskScore >= 0.7
                  ? 'CRITICAL'
                  : selectedMachine.riskScore >= 0.42
                  ? 'HIGH'
                  : selectedMachine.riskScore >= 0.2
                  ? 'MEDIUM'
                  : 'LOW'
              }
            />
            <span className="font-mono text-xs font-semibold text-slate-200">
              {(selectedMachine.riskScore * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Primary Risk Warning if elevated */}
      {selectedMachine.riskScore >= 0.42 && (
        <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-800/60 flex items-start gap-3 text-xs text-rose-300">
          <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-rose-200 block mb-0.5">Elevated Failure Likelihood</span>
            <span>
              Telemetry indicates probable <strong>{selectedMachine.primaryRisk}</strong>. Review spindle parameters
              and thermal dissipation metrics below.
            </span>
          </div>
        </div>
      )}

      {/* Sensor Metrics Breakdown */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Active Telemetry Parameters
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Air Temperature */}
          <div className="p-3 rounded bg-[#131822] border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Air Temperature
              </span>
              <span className="font-mono text-slate-200 font-semibold">{selectedMachine.airTemp} K</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {formatTemperature(selectedMachine.airTemp, true)}
            </div>
          </div>

          {/* Process Temperature */}
          <div className="p-3 rounded bg-[#131822] border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Process Temperature
              </span>
              <span className="font-mono text-slate-200 font-semibold">{selectedMachine.processTemp} K</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Delta: <span className={tempDiff < 8.6 ? 'text-rose-400 font-semibold' : 'text-slate-300'}>{tempDiff.toFixed(1)} K</span> (min safe 8.6 K)
            </div>
          </div>

          {/* Rotational Speed */}
          <div className="p-3 rounded bg-[#131822] border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" /> Rotational Speed
              </span>
              <span className="font-mono text-slate-200 font-semibold">{selectedMachine.speed} rpm</span>
            </div>
            <div className="text-[11px] text-slate-400">Normal Range: 1,380 - 2,800 rpm</div>
          </div>

          {/* Torque */}
          <div className="p-3 rounded bg-[#131822] border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-indigo-400" /> Load Torque
              </span>
              <span className="font-mono text-slate-200 font-semibold">{selectedMachine.torque} Nm</span>
            </div>
            <div className="text-[11px] text-slate-400">Calculated Power: {powerKw.toFixed(2)} kW</div>
          </div>
        </div>

        {/* Tool Wear Meter */}
        <div className="p-3.5 rounded bg-[#131822] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Wrench className="w-3.5 h-3.5 text-cyan-400" /> Cumulative Tool Wear
            </span>
            <span className="font-mono text-xs font-semibold text-slate-200">
              {selectedMachine.toolWear} / 240 min
            </span>
          </div>
          <Progress
            value={selectedMachine.toolWear}
            max={240}
            threshold={200}
            variant={selectedMachine.toolWear >= 200 ? 'rose' : selectedMachine.toolWear >= 160 ? 'amber' : 'cyan'}
            size="md"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Fresh Blade (0 min)</span>
            <span className="text-amber-400">Warning (160 min)</span>
            <span className="text-rose-400">Critical Limit (200+ min)</span>
          </div>
        </div>
      </div>

      {/* Operational Metadata */}
      <div className="border-t border-slate-800/80 pt-4 space-y-2 text-xs">
        <div className="flex justify-between py-1 border-b border-slate-800/40">
          <span className="text-slate-400">Total Operational Hours:</span>
          <span className="font-mono text-slate-200">{selectedMachine.hoursOnline} hrs</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-800/40">
          <span className="text-slate-400">Last Maintenance Inspection:</span>
          <span className="font-mono text-slate-200">{selectedMachine.lastInspection}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-400">Composite Overstrain Metric:</span>
          <span className="font-mono text-slate-200">{overstrainScore.toFixed(0)} / 120</span>
        </div>
      </div>
    </Drawer>
  );
};
