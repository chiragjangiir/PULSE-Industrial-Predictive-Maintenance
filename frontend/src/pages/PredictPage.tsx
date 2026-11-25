import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RiskBadge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Tooltip } from '../components/ui/Tooltip';
import { pulseApi } from '../services/api/pulseApi';
import { PredictionRequest, PredictionResponse } from '../types/api';
import { formatTemperature } from '../utils/formatters';
import {
  Cpu,
  RotateCw,
  Flame,
  Gauge,
  Wrench,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';

export const PredictPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Form State
  const [machineId, setMachineId] = useState<string>(searchParams.get('id') || 'MCH-SIM-01');
  const [machineType, setMachineType] = useState<'L' | 'M' | 'H'>(
    (searchParams.get('type') as 'L' | 'M' | 'H') || 'M'
  );
  const [airTemp, setAirTemp] = useState<number>(
    parseFloat(searchParams.get('air') || '298.5')
  );
  const [processTemp, setProcessTemp] = useState<number>(
    parseFloat(searchParams.get('proc') || '308.8')
  );
  const [rotationalSpeed, setRotationalSpeed] = useState<number>(
    parseFloat(searchParams.get('speed') || '1510')
  );
  const [torque, setTorque] = useState<number>(
    parseFloat(searchParams.get('torque') || '42.0')
  );
  const [toolWear, setToolWear] = useState<number>(
    parseFloat(searchParams.get('wear') || '115')
  );

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isSimulatedResponse, setIsSimulatedResponse] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Derived metrics
  const tempDiff = parseFloat((processTemp - airTemp).toFixed(1));
  const powerW = Math.round(((rotationalSpeed * 2 * Math.PI) / 60) * torque);

  const runPrediction = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const payload: PredictionRequest = {
        machine_id: machineId,
        machine_type: machineType,
        air_temperature: airTemp,
        process_temperature: processTemp,
        rotational_speed: rotationalSpeed,
        torque: torque,
        tool_wear: toolWear,
      };
      const res = await pulseApi.predict(payload);
      setResult(res.data);
      setIsSimulatedResponse(res.isSimulated);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Prediction execution failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial prediction on mount
  useEffect(() => {
    runPrediction();
  }, []);

  // Quick Scenario Presets
  const applyPreset = (preset: 'nominal' | 'twf' | 'hdf' | 'pwf' | 'osf') => {
    if (preset === 'nominal') {
      setMachineType('M');
      setAirTemp(298.2);
      setProcessTemp(308.6);
      setRotationalSpeed(1530);
      setTorque(39.5);
      setToolWear(65);
    } else if (preset === 'twf') {
      setMachineType('L');
      setAirTemp(299.1);
      setProcessTemp(309.4);
      setRotationalSpeed(1480);
      setTorque(46.0);
      setToolWear(218); // Tool wear failure (> 200 min)
    } else if (preset === 'hdf') {
      setMachineType('L');
      setAirTemp(302.5);
      setProcessTemp(310.2); // temp delta 7.7K (< 8.6K)
      setRotationalSpeed(1320); // speed < 1380
      setTorque(54.0);
      setToolWear(140);
    } else if (preset === 'pwf') {
      setMachineType('H');
      setAirTemp(298.0);
      setProcessTemp(308.2);
      setRotationalSpeed(1210);
      setTorque(74.5); // Power = ~9440W (> 9000W overload)
      setToolWear(90);
    } else if (preset === 'osf') {
      setMachineType('L');
      setAirTemp(299.0);
      setProcessTemp(309.5);
      setRotationalSpeed(1400);
      setTorque(68.0);
      setToolWear(190); // 68 * 190 = 12920 (> 11000 for L)
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-[#0e131b] border border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Interactive Machine Diagnostic Sandbox
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate spindle telemetry across operating envelopes using calibrated inference models.
          </p>
        </div>

        {/* Quick Scenario Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase text-slate-400 mr-1">Presets:</span>
          <button
            onClick={() => applyPreset('nominal')}
            className="px-2 py-1 text-[11px] font-mono rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            Nominal
          </button>
          <button
            onClick={() => applyPreset('twf')}
            className="px-2 py-1 text-[11px] font-mono rounded bg-rose-950/40 text-rose-300 border border-rose-800/60 hover:bg-rose-900/40 transition-colors"
          >
            Tool Wear (TWF)
          </button>
          <button
            onClick={() => applyPreset('hdf')}
            className="px-2 py-1 text-[11px] font-mono rounded bg-amber-950/40 text-amber-300 border border-amber-800/60 hover:bg-amber-900/40 transition-colors"
          >
            Heat Deficit (HDF)
          </button>
          <button
            onClick={() => applyPreset('pwf')}
            className="px-2 py-1 text-[11px] font-mono rounded bg-indigo-950/40 text-indigo-300 border border-indigo-800/60 hover:bg-indigo-900/40 transition-colors"
          >
            Power Anomaly (PWF)
          </button>
          <button
            onClick={() => applyPreset('osf')}
            className="px-2 py-1 text-[11px] font-mono rounded bg-purple-950/40 text-purple-300 border border-purple-800/60 hover:bg-purple-900/40 transition-colors"
          >
            Overstrain (OSF)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Telemetry Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Gauge className="w-4 h-4 text-cyan-400" />
                Spindle Telemetry Parameters
              </CardTitle>
              <CardDescription>Adjust sensor values or use sliders for tactile simulation</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Machine ID & Quality Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Machine Identifier"
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                  placeholder="e.g. MCH-4021"
                />

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 font-medium flex items-center justify-between">
                    <span>Machine Variant Type</span>
                    <Tooltip content="L=Low Quality (50% dataset), M=Medium (30%), H=High (20%)">
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                    </Tooltip>
                  </label>
                  <select
                    value={machineType}
                    onChange={(e) => setMachineType(e.target.value as 'L' | 'M' | 'H')}
                    className="w-full bg-[#0a0d13] border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500/70"
                  >
                    <option value="L">L-Series (Low Quality Variant - 50% fleet)</option>
                    <option value="M">M-Series (Medium Quality Variant - 30% fleet)</option>
                    <option value="H">H-Series (High Quality Variant - 20% fleet)</option>
                  </select>
                </div>
              </div>

              {/* Air Temperature */}
              <div className="space-y-1.5 p-3 rounded bg-[#0e121a] border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" /> Air Temperature
                  </span>
                  <span className="text-cyan-400 font-bold">{airTemp.toFixed(1)} K ({formatTemperature(airTemp, false)})</span>
                </div>
                <input
                  type="range"
                  min="295.0"
                  max="305.0"
                  step="0.1"
                  value={airTemp}
                  onChange={(e) => setAirTemp(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>295.0 K (21.9 °C)</span>
                  <span>Range: 295 - 305 K</span>
                  <span>305.0 K (31.9 °C)</span>
                </div>
              </div>

              {/* Process Temperature */}
              <div className="space-y-1.5 p-3 rounded bg-[#0e121a] border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400" /> Process Temperature
                  </span>
                  <span className="text-cyan-400 font-bold">{processTemp.toFixed(1)} K</span>
                </div>
                <input
                  type="range"
                  min="305.0"
                  max="315.0"
                  step="0.1"
                  value={processTemp}
                  onChange={(e) => setProcessTemp(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>305.0 K</span>
                  <span className={tempDiff < 8.6 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                    Thermal Delta: {tempDiff} K {tempDiff < 8.6 && '(!)'}
                  </span>
                  <span>315.0 K</span>
                </div>
              </div>

              {/* Rotational Speed */}
              <div className="space-y-1.5 p-3 rounded bg-[#0e121a] border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-cyan-400" /> Rotational Speed
                  </span>
                  <span className="text-cyan-400 font-bold">{rotationalSpeed} rpm</span>
                </div>
                <input
                  type="range"
                  min="1150"
                  max="2900"
                  step="10"
                  value={rotationalSpeed}
                  onChange={(e) => setRotationalSpeed(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>1,150 rpm</span>
                  <span>Calculated Power: {powerW} W</span>
                  <span>2,900 rpm</span>
                </div>
              </div>

              {/* Torque */}
              <div className="space-y-1.5 p-3 rounded bg-[#0e121a] border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-indigo-400" /> Load Torque
                  </span>
                  <span className="text-cyan-400 font-bold">{torque.toFixed(1)} Nm</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="80.0"
                  step="0.5"
                  value={torque}
                  onChange={(e) => setTorque(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>3.0 Nm</span>
                  <span>Normal envelope: 25 - 55 Nm</span>
                  <span>80.0 Nm</span>
                </div>
              </div>

              {/* Tool Wear */}
              <div className="space-y-1.5 p-3 rounded bg-[#0e121a] border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-pink-400" /> Cumulative Tool Wear
                  </span>
                  <span className={toolWear >= 200 ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold'}>
                    {toolWear} min {toolWear >= 200 && '(CRITICAL)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="260"
                  step="1"
                  value={toolWear}
                  onChange={(e) => setToolWear(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>0 min (New Blade)</span>
                  <span className="text-amber-400">160 min (Warning)</span>
                  <span className="text-rose-400">200+ min (Replacement Limit)</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="w-4 h-4" />}
                onClick={() => applyPreset('nominal')}
              >
                Reset Default
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={isLoading}
                leftIcon={<Play className="w-4 h-4" />}
                onClick={runPrediction}
              >
                Execute Prediction Inference
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right: Inference Results & SHAP Waterfall (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card
            glow={
              result?.risk_level === 'CRITICAL'
                ? 'red'
                : result?.risk_level === 'HIGH'
                ? 'amber'
                : result?.risk_level === 'LOW'
                ? 'cyan'
                : 'none'
            }
          >
            <CardHeader>
              <div>
                <CardTitle>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Inference Prediction Output
                </CardTitle>
                <CardDescription>
                  {isSimulatedResponse ? 'Simulated AI4I 2020 Physics Pipeline' : 'Live FastAPI XGBoost Model'}
                </CardDescription>
              </div>
              {result && <RiskBadge level={result.risk_level} />}
            </CardHeader>

            <CardContent className="space-y-5">
              {errorMsg && (
                <div className="p-3 rounded bg-rose-950/40 border border-rose-800 text-xs text-rose-300">
                  {errorMsg}
                </div>
              )}

              {result && (
                <>
                  {/* Primary Decision Banner */}
                  <div
                    className={`p-4 rounded-lg border flex items-center justify-between ${
                      result.prediction === 1
                        ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                        : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {result.prediction === 1 ? (
                        <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                      )}
                      <div>
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider block">
                          {result.prediction === 1 ? 'PREDICTED MACHINE FAILURE' : 'PREDICTED NOMINAL'}
                        </span>
                        <span className="text-xs text-slate-300 mt-0.5 block">
                          {result.primary_failure_mode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Failure Probability Progress */}
                  <div className="space-y-2 p-3.5 rounded bg-[#0f141d] border border-slate-800">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">Failure Probability:</span>
                      <span className="font-bold text-slate-100 text-sm">
                        {(result.failure_probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={result.failure_probability * 100}
                      threshold={result.threshold_used * 100}
                      variant="risk"
                      size="lg"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Low Risk (0-20%)</span>
                      <span className="text-rose-400 font-semibold">Decision Cutoff: {(result.threshold_used * 100).toFixed(0)}%</span>
                      <span>Critical (70-100%)</span>
                    </div>
                  </div>

                  {/* Operational Recommendation */}
                  <div className="p-3.5 rounded bg-[#0f141d] border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                      Recommended Operator Action
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{result.recommendation}</p>
                  </div>

                  {/* Local Feature Contributions (SHAP Waterfall breakdown) */}
                  {result.feature_contributions && result.feature_contributions.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                        Local Feature Attributions (SHAP Delta)
                      </span>
                      <div className="space-y-2">
                        {result.feature_contributions.map((fc, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded bg-[#0a0e14] border border-slate-800/80 text-xs font-mono flex items-center justify-between"
                          >
                            <div className="space-y-0.5 min-w-0 pr-2">
                              <span className="text-slate-200 font-medium block truncate">{fc.feature}</span>
                              <span className="text-[10px] text-slate-400 block truncate">{fc.description}</span>
                            </div>
                            <span
                              className={`font-bold flex-shrink-0 ${
                                fc.contribution > 0 ? 'text-rose-400' : 'text-emerald-400'
                              }`}
                            >
                              {fc.contribution > 0 ? `+${(fc.contribution * 100).toFixed(1)}%` : `${(fc.contribution * 100).toFixed(1)}%`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
