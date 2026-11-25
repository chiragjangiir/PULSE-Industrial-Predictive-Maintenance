import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TelemetryPoint } from '../../types/api';

export interface SensorTrendChartProps {
  data: TelemetryPoint[];
  metricKey?: 'torque' | 'rotational_speed' | 'process_temperature' | 'tool_wear' | 'all';
}

export const SensorTrendChart: React.FC<SensorTrendChartProps> = ({ data, metricKey = 'all' }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="timestamp"
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
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.375rem',
              color: '#f8fafc',
              fontFamily: 'monospace',
              fontSize: '11px',
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '10px',
              fontSize: '11px',
              fontFamily: 'monospace',
            }}
          />
          {(metricKey === 'all' || metricKey === 'torque') && (
            <Line
              type="monotone"
              dataKey="torque"
              name="Torque (Nm)"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#06b6d4' }}
            />
          )}
          {(metricKey === 'all' || metricKey === 'process_temperature') && (
            <Line
              type="monotone"
              dataKey="process_temperature"
              name="Process Temp (K)"
              stroke="#f59e0b"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: '#f59e0b' }}
            />
          )}
          {(metricKey === 'all' || metricKey === 'tool_wear') && (
            <Line
              type="monotone"
              dataKey="tool_wear"
              name="Tool Wear (min)"
              stroke="#ec4899"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
