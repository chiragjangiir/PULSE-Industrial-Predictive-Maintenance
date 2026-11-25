import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, RiskBadge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { pulseApi } from '../services/api/pulseApi';
import { PredictionRequest, BatchPredictionResponse } from '../types/api';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle2,
  Play,
  Search,
  FileCheck,
  Clock,
  Layers,
} from 'lucide-react';

export const DataExplorerPage: React.FC = () => {
  const { addToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rawRecords, setRawRecords] = useState<PredictionRequest[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<BatchPredictionResponse | null>(null);

  // Filters for batch results table
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  // Parse CSV string into PredictionRequest[]
  const parseCsvText = (text: string, sourceName: string) => {
    setParseError(null);
    setBatchResult(null);

    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      setParseError('The uploaded CSV file is empty or missing data rows.');
      return;
    }

    const headerLine = lines[0].toLowerCase();
    const headers = headerLine.split(',').map((h) => h.trim().replace(/["']/g, ''));

    // Check for required columns
    const findIndex = (aliases: string[]) => headers.findIndex((h) => aliases.some((a) => h.includes(a)));

    const typeIdx = findIndex(['machine_type', 'type']);
    const airIdx = findIndex(['air_temperature', 'air temp', 'air_temp']);
    const procIdx = findIndex(['process_temperature', 'process temp', 'process_temp']);
    const speedIdx = findIndex(['rotational_speed', 'speed', 'rpm']);
    const torqueIdx = findIndex(['torque', 'nm']);
    const wearIdx = findIndex(['tool_wear', 'wear', 'tool wear']);
    const idIdx = findIndex(['machine_id', 'id', 'udi']);

    if (typeIdx === -1 || airIdx === -1 || procIdx === -1 || speedIdx === -1 || torqueIdx === -1 || wearIdx === -1) {
      setParseError(
        'CSV missing required columns. Ensure columns: machine_type, air_temperature, process_temperature, rotational_speed, torque, tool_wear are present.'
      );
      return;
    }

    const parsedItems: PredictionRequest[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim().replace(/["']/g, ''));
      if (cols.length < 6) continue;

      const typeVal = (cols[typeIdx] || 'M').toUpperCase();
      const validQuality = typeVal === 'L' || typeVal === 'H' ? typeVal : 'M';

      parsedItems.push({
        machine_id: idIdx !== -1 && cols[idIdx] ? cols[idIdx] : `MCH-ROW-${String(i).padStart(4, '0')}`,
        machine_type: validQuality as 'L' | 'M' | 'H',
        air_temperature: parseFloat(cols[airIdx]) || 298.5,
        process_temperature: parseFloat(cols[procIdx]) || 308.8,
        rotational_speed: parseFloat(cols[speedIdx]) || 1500,
        torque: parseFloat(cols[torqueIdx]) || 40.0,
        tool_wear: parseFloat(cols[wearIdx]) || 50,
      });
    }

    setRawRecords(parsedItems);
    setFileName(sourceName);
    addToast(`Successfully parsed ${parsedItems.length} records from ${sourceName}`, 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setParseError('Please upload a valid .csv comma-separated file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseCsvText(content, file.name);
    };
    reader.readAsText(file);
  };

  // Load 20-Sample AI4I Benchmark Batch
  const loadBenchmarkBatch = () => {
    const samples: PredictionRequest[] = [
      { machine_id: 'MCH-AI4I-001', machine_type: 'M', air_temperature: 298.1, process_temperature: 308.6, rotational_speed: 1551, torque: 42.8, tool_wear: 0 },
      { machine_id: 'MCH-AI4I-002', machine_type: 'L', air_temperature: 298.2, process_temperature: 308.7, rotational_speed: 1408, torque: 46.3, tool_wear: 3 },
      { machine_id: 'MCH-AI4I-003', machine_type: 'L', air_temperature: 298.1, process_temperature: 308.5, rotational_speed: 1498, torque: 49.4, tool_wear: 5 },
      { machine_id: 'MCH-AI4I-004', machine_type: 'L', air_temperature: 298.2, process_temperature: 308.6, rotational_speed: 1433, torque: 39.5, tool_wear: 7 },
      { machine_id: 'MCH-AI4I-005', machine_type: 'L', air_temperature: 298.2, process_temperature: 308.7, rotational_speed: 1408, torque: 40.0, tool_wear: 9 },
      { machine_id: 'MCH-AI4I-006', machine_type: 'M', air_temperature: 298.1, process_temperature: 308.9, rotational_speed: 1425, torque: 41.9, tool_wear: 11 },
      { machine_id: 'MCH-AI4I-007', machine_type: 'L', air_temperature: 298.1, process_temperature: 308.6, rotational_speed: 1558, torque: 38.0, tool_wear: 14 },
      { machine_id: 'MCH-AI4I-008', machine_type: 'L', air_temperature: 298.1, process_temperature: 308.6, rotational_speed: 1527, torque: 40.2, tool_wear: 16 },
      { machine_id: 'MCH-AI4I-009', machine_type: 'M', air_temperature: 298.3, process_temperature: 308.7, rotational_speed: 1667, torque: 28.6, tool_wear: 18 },
      { machine_id: 'MCH-AI4I-010', machine_type: 'M', air_temperature: 298.5, process_temperature: 309.0, rotational_speed: 1741, torque: 28.0, tool_wear: 21 },
      { machine_id: 'MCH-AI4I-011', machine_type: 'L', air_temperature: 298.4, process_temperature: 309.1, rotational_speed: 1782, torque: 23.9, tool_wear: 24 },
      { machine_id: 'MCH-AI4I-012', machine_type: 'H', air_temperature: 298.6, process_temperature: 309.2, rotational_speed: 1504, torque: 38.3, tool_wear: 28 },
      // Critical fail injection: Tool Wear Failure (TWF)
      { machine_id: 'MCH-AI4I-013', machine_type: 'L', air_temperature: 299.1, process_temperature: 309.4, rotational_speed: 1480, torque: 48.0, tool_wear: 216 },
      // Heat Dissipation Failure (HDF)
      { machine_id: 'MCH-AI4I-014', machine_type: 'L', air_temperature: 302.4, process_temperature: 310.1, rotational_speed: 1310, torque: 56.0, tool_wear: 135 },
      // Power Failure (PWF)
      { machine_id: 'MCH-AI4I-015', machine_type: 'H', air_temperature: 298.2, process_temperature: 308.5, rotational_speed: 1180, torque: 75.0, tool_wear: 88 },
      // Overstrain Failure (OSF)
      { machine_id: 'MCH-AI4I-016', machine_type: 'L', air_temperature: 299.0, process_temperature: 309.8, rotational_speed: 1420, torque: 68.5, tool_wear: 195 },
      { machine_id: 'MCH-AI4I-017', machine_type: 'M', air_temperature: 298.7, process_temperature: 308.9, rotational_speed: 1520, torque: 37.4, tool_wear: 44 },
      { machine_id: 'MCH-AI4I-018', machine_type: 'H', air_temperature: 297.8, process_temperature: 307.9, rotational_speed: 1590, torque: 35.8, tool_wear: 52 },
      { machine_id: 'MCH-AI4I-019', machine_type: 'L', air_temperature: 299.2, process_temperature: 309.9, rotational_speed: 1470, torque: 43.1, tool_wear: 60 },
      { machine_id: 'MCH-AI4I-020', machine_type: 'M', air_temperature: 298.3, process_temperature: 308.6, rotational_speed: 1530, torque: 40.2, tool_wear: 71 },
    ];
    setRawRecords(samples);
    setFileName('ai4i2020_validation_sample_20.csv');
    setParseError(null);
    setBatchResult(null);
    addToast('Loaded 20 AI4I benchmark validation records', 'info');
  };

  // Download Sample CSV Template
  const downloadSampleTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'machine_id,machine_type,air_temperature,process_temperature,rotational_speed,torque,tool_wear\n' +
      'MCH-1001,L,298.1,308.6,1551,42.8,0\n' +
      'MCH-1002,M,298.2,308.7,1408,46.3,3\n' +
      'MCH-1003,H,298.1,308.5,1498,49.4,5\n' +
      'MCH-1004,L,299.1,309.4,1480,48.0,216\n' +
      'MCH-1005,L,302.4,310.1,1310,56.0,135\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'PULSE_Batch_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Run Batch Predictions
  const runBatchPrediction = async () => {
    if (rawRecords.length === 0) return;
    setIsLoading(true);
    try {
      const res = await pulseApi.predictBatch(rawRecords);
      setBatchResult(res.data);
      addToast(
        `Batch processing complete. Flagged ${res.data.summary.predicted_failures} failure risks.`,
        'success'
      );
    } catch (err: any) {
      addToast(err?.message || 'Batch prediction failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Export Enriched CSV
  const exportPredictionsCsv = () => {
    if (!batchResult) return;

    const headers = [
      'machine_id',
      'machine_type',
      'predicted_failure',
      'failure_probability',
      'risk_level',
      'primary_failure_mode',
      'recommendation',
    ];

    const rows = batchResult.predictions.map((p) => [
      p.machine_id,
      p.machine_type,
      p.prediction,
      p.failure_probability,
      p.risk_level,
      `"${p.primary_failure_mode}"`,
      `"${p.recommendation.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PULSE_Enriched_Predictions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Predictions exported to CSV', 'success');
  };

  // Filtered predictions
  const filteredPredictions = (batchResult?.predictions || []).filter((p) => {
    const matchesSearch =
      p.machine_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.primary_failure_mode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || p.risk_level === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Upload Zone & Action Bar */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              Batch CSV Inference & Fleet Ingestion
            </CardTitle>
            <CardDescription>
              Upload structured telemetry spreadsheets to run batch predictive classification
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={downloadSampleTemplate}
            >
              CSV Template
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Layers className="w-3.5 h-3.5" />}
              onClick={loadBenchmarkBatch}
            >
              Load Benchmark Batch
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Drag & Drop Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-cyan-500/80 rounded-lg p-6 text-center cursor-pointer bg-[#0a0d14] transition-colors group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
            <Upload className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 mx-auto mb-2 transition-colors" />
            <h4 className="text-xs font-semibold text-slate-200">
              {fileName ? `Loaded: ${fileName}` : 'Drop CSV file here or click to browse'}
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports standard comma-separated format with up to 5,000 milling machine records
            </p>
          </div>

          {parseError && (
            <div className="p-3 rounded bg-rose-950/30 border border-rose-800 text-xs text-rose-300">
              {parseError}
            </div>
          )}

          {rawRecords.length > 0 && (
            <div className="flex items-center justify-between p-3 rounded bg-[#0f141e] border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  Ready to process <strong>{rawRecords.length} records</strong> from {fileName}
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                isLoading={isLoading}
                leftIcon={<Play className="w-4 h-4" />}
                onClick={runBatchPrediction}
              >
                Execute Batch Predictions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Batch Summary KPI (shown after prediction) */}
      {batchResult && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Processed Records"
              value={`${batchResult.total_records} Rows`}
              subtitle={`Execution latency: ${batchResult.processing_time_ms} ms`}
              icon={<Clock className="w-5 h-5" />}
              accentColor="cyan"
            />
            <StatCard
              title="Predicted Failures"
              value={`${batchResult.summary.predicted_failures} Units`}
              subtitle={`Failure rate: ${(batchResult.summary.failure_rate * 100).toFixed(1)}%`}
              icon={<AlertTriangle className="w-5 h-5" />}
              accentColor="rose"
            />
            <StatCard
              title="Critical Risk Units"
              value={batchResult.summary.critical_count}
              subtitle="Probability >= 70%"
              icon={<AlertTriangle className="w-5 h-5" />}
              accentColor="rose"
            />
            <StatCard
              title="High Risk Units"
              value={batchResult.summary.high_risk_count}
              subtitle="Probability 42% - 70%"
              icon={<CheckCircle2 className="w-5 h-5" />}
              accentColor="amber"
            />
          </div>

          {/* Results Table Card */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  Inference Prediction Results
                </CardTitle>
                <CardDescription>
                  Showing {filteredPredictions.length} of {batchResult.predictions.length} scored records
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={exportPredictionsCsv}
                >
                  Export Enriched CSV
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Machine ID or failure mode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0a0d13] border border-slate-800 rounded pl-9 pr-3 py-1.5 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[11px] font-mono text-slate-400 mr-1">Risk Filter:</span>
                  {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((rf) => (
                    <button
                      key={rf}
                      onClick={() => setRiskFilter(rf)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                        riskFilter === rf
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {rf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-slate-800 rounded">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0b0e14] border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Machine ID</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Prediction</th>
                      <th className="py-2.5 px-3">Probability</th>
                      <th className="py-2.5 px-3">Risk Tier</th>
                      <th className="py-2.5 px-3">Failure Mode</th>
                      <th className="py-2.5 px-4">Operator Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-slate-200">
                    {filteredPredictions.map((row) => (
                      <tr key={row.machine_id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-100">{row.machine_id}</td>
                        <td className="py-2.5 px-3">
                          <Badge variant="slate" size="sm">
                            Series {row.machine_type}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              row.prediction === 1
                                ? 'bg-rose-950/60 text-rose-400 border border-rose-800/80'
                                : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80'
                            }`}
                          >
                            {row.prediction === 1 ? 'FAILURE (1)' : 'NOMINAL (0)'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold">
                          {(row.failure_probability * 100).toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-3">
                          <RiskBadge level={row.risk_level} size="sm" />
                        </td>
                        <td className="py-2.5 px-3 text-slate-300 font-sans">{row.primary_failure_mode}</td>
                        <td className="py-2.5 px-4 text-slate-400 font-sans text-[11px] max-w-xs truncate">
                          {row.recommendation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
