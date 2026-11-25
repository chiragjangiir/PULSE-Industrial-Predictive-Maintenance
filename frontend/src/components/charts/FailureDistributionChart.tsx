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

export interface FailureDistributionChartProps {
  data: Record<string, number>;
}

export const FailureDistributionChart: React.FC<FailureDistributionChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([key, count]) => {
    // Extract short acronym e.g. "TWF" or clean label
    const shortLabel = key.includes('(') ? key.split('(')[1].replace(')', '') : key;
    return {
      fullName: key,
      label: shortLabel,
      count,
    };
  });

  // High-performance HMI single-accent discipline: slate structural bars with active highlight
  const baseColor = '#3b82f6';

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
            tickLine={{ stroke: '#334155' }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
            tickLine={{ stroke: '#334155' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-[#0f172a] border border-slate-700 p-2.5 rounded shadow-lg text-xs font-mono">
                    <p className="text-slate-200 font-semibold mb-1">{item.fullName}</p>
                    <p className="text-cyan-400">Occurrences: {item.count} events</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]} fill={baseColor}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.label === 'HDF' || entry.label === 'OSF' ? '#f59e0b' : '#334155'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
