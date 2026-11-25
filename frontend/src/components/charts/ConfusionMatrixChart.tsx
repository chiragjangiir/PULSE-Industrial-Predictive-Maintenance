import React from 'react';
import { ConfusionMatrix } from '../../types/api';

export interface ConfusionMatrixChartProps {
  matrix: ConfusionMatrix;
}

export const ConfusionMatrixChart: React.FC<ConfusionMatrixChartProps> = ({ matrix }) => {
  const { true_negatives, false_positives, false_negatives, true_positives } = matrix;
  const total = true_negatives + false_positives + false_negatives + true_positives;

  const precision = (true_positives / (true_positives + false_positives)) * 100;
  const recall = (true_positives / (true_positives + false_negatives)) * 100;
  const specificity = (true_negatives / (true_negatives + false_positives)) * 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
        {/* Header row */}
        <div className="col-span-2 grid grid-cols-2 text-slate-400 font-semibold mb-1">
          <span>Predicted Normal (0)</span>
          <span>Predicted Failure (1)</span>
        </div>

        {/* Row 1: Actual Normal */}
        <div className="p-3.5 rounded bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
            True Negative (TN - Normal Kept Running)
          </span>
          <span className="text-xl font-bold text-slate-100 tabular-nums">{true_negatives.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block mt-1">
            {((true_negatives / total) * 100).toFixed(1)}% of test set
          </span>
        </div>

        <div className="p-3.5 rounded bg-amber-950/20 border border-amber-800/40">
          <span className="text-[10px] text-amber-400 uppercase tracking-wider block mb-1">
            False Positive (FP - False Alarm)
          </span>
          <span className="text-xl font-bold text-amber-200 tabular-nums">{false_positives.toLocaleString()}</span>
          <span className="text-[10px] text-amber-400/80 block mt-1">
            {((false_positives / total) * 100).toFixed(1)}% false alarms
          </span>
        </div>

        {/* Row 2: Actual Failure */}
        <div className="p-3.5 rounded bg-rose-950/25 border border-rose-800/50">
          <span className="text-[10px] text-rose-400 uppercase tracking-wider block mb-1 font-bold">
            False Negative (FN - Missed Breakdown)
          </span>
          <span className="text-xl font-bold text-rose-200 tabular-nums">{false_negatives.toLocaleString()}</span>
          <span className="text-[10px] text-rose-400/80 block mt-1 font-medium">
            {((false_negatives / total) * 100).toFixed(1)}% missed defects
          </span>
        </div>

        <div className="p-3.5 rounded bg-sky-950/20 border border-sky-800/40">
          <span className="text-[10px] text-sky-400 uppercase tracking-wider block mb-1">
            True Positive (TP - Intercepted)
          </span>
          <span className="text-xl font-bold text-slate-100 tabular-nums">{true_positives.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block mt-1">
            {((true_positives / total) * 100).toFixed(1)}% caught defects
          </span>
        </div>
      </div>

      {/* Metrics footer */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300">
        <div>
          <span className="text-slate-400 block">Precision (PPV):</span>
          <span className="font-bold text-cyan-400">{precision.toFixed(1)}%</span>
        </div>
        <div>
          <span className="text-slate-400 block">Recall / Catch:</span>
          <span className="font-bold text-emerald-400">{recall.toFixed(1)}%</span>
        </div>
        <div>
          <span className="text-slate-400 block">Specificity:</span>
          <span className="font-bold text-slate-200">{specificity.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};
