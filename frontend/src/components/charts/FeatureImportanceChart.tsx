import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { FeatureImportanceItem } from '../../types/api';

export interface FeatureImportanceChartProps {
  data: FeatureImportanceItem[];
}

export const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ data }) => {
  // Sort descending by importance
  const sorted = [...data].sort((a, b) => b.importance - a.importance);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={sorted}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 0.4]}
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
            tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
          />
          <YAxis
            type="category"
            dataKey="feature"
            stroke="#64748b"
            tick={{ fill: '#cbd5e1', fontSize: 11, fontFamily: 'monospace' }}
            width={160}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as FeatureImportanceItem;
                return (
                  <div className="bg-[#0f172a] border border-slate-700 p-2.5 rounded shadow text-xs font-mono">
                    <p className="text-slate-100 font-semibold mb-1">{item.feature}</p>
                    <p className="text-cyan-400">SHAP Attribution: {(item.importance * 100).toFixed(1)}%</p>
                    <p className="text-slate-400">Rank: #{item.rank}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
            {sorted.map((entry, index) => (
              <Cell
                key={`bar-${index}`}
                fill={index === 0 ? '#06b6d4' : index === 1 ? '#0ea5e9' : index === 2 ? '#38bdf8' : '#64748b'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
