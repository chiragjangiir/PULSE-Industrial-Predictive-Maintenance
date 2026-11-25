import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { CurvePoint } from '../../types/api';

export interface RocPrChartProps {
  type: 'roc' | 'pr';
  data: CurvePoint[];
  threshold?: number;
}

export const RocPrChart: React.FC<RocPrChartProps> = ({ type, data, threshold: _threshold = 0.42 }) => {
  const isRoc = type === 'roc';

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey={isRoc ? 'fpr' : 'recall'}
            domain={[0, 1]}
            type="number"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
            label={{
              value: isRoc ? 'False Positive Rate (FPR)' : 'Recall (Sensitivity)',
              position: 'insideBottom',
              offset: -4,
              fill: '#94a3b8',
              fontSize: 10,
              fontFamily: 'monospace',
            }}
          />
          <YAxis
            dataKey={isRoc ? 'tpr' : 'precision'}
            domain={[0, 1]}
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
            label={{
              value: isRoc ? 'True Positive Rate (TPR)' : 'Precision (PPV)',
              angle: -90,
              position: 'insideLeft',
              fill: '#94a3b8',
              fontSize: 10,
              fontFamily: 'monospace',
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const pt = payload[0].payload as CurvePoint;
                return (
                  <div className="bg-[#0f172a] border border-slate-700 p-2 rounded shadow text-xs font-mono">
                    <p className="text-cyan-400 font-bold mb-1">Threshold: {pt.threshold}</p>
                    {isRoc ? (
                      <>
                        <p className="text-slate-200">TPR: {(pt.tpr! * 100).toFixed(1)}%</p>
                        <p className="text-slate-400">FPR: {(pt.fpr! * 100).toFixed(1)}%</p>
                      </>
                    ) : (
                      <>
                        <p className="text-slate-200">Precision: {(pt.precision! * 100).toFixed(1)}%</p>
                        <p className="text-slate-400">Recall: {(pt.recall! * 100).toFixed(1)}%</p>
                      </>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          {isRoc && (
            <ReferenceLine
              segment={[
                { x: 0, y: 0 },
                { x: 1, y: 1 },
              ]}
              stroke="#475569"
              strokeDasharray="4 4"
            />
          )}
          <Line
            type="monotone"
            dataKey={isRoc ? 'tpr' : 'precision'}
            stroke={isRoc ? '#06b6d4' : '#10b981'}
            strokeWidth={2.5}
            dot={{ r: 3, fill: isRoc ? '#06b6d4' : '#10b981' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
