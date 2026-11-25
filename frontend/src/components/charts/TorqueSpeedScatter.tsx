import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

export interface TorqueSpeedScatterProps {
  currentPoint?: { torque: number; speed: number; machine_id?: string };
}

export const TorqueSpeedScatter: React.FC<TorqueSpeedScatterProps> = ({ currentPoint }) => {
  // Generate representative operating points from the AI4I dataset
  const points = React.useMemo(() => {
    const list = [];
    // Normal envelope (speed 1300-2400, torque 25-55)
    for (let i = 0; i < 40; i++) {
      const speed = 1350 + Math.sin(i * 1.7) * 450 + (i % 5) * 50;
      const torque = 40 + Math.cos(i * 2.1) * 12;
      list.push({ speed: Math.round(speed), torque: parseFloat(torque.toFixed(1)), isFailure: false, type: 'Normal Operation' });
    }
    // High torque / stall failures (PWF / OSF)
    list.push(
      { speed: 1220, torque: 68.4, isFailure: true, type: 'Overstrain / High Load' },
      { speed: 1280, torque: 72.1, isFailure: true, type: 'Power Overload (>9000W)' },
      { speed: 1310, torque: 64.2, isFailure: true, type: 'Heat Dissipation Deficit' },
      { speed: 2750, torque: 38.5, isFailure: true, type: 'Power Overload at High RPM' },
      { speed: 1180, torque: 22.0, isFailure: true, type: 'Underload Stall (<3500W)' }
    );
    return list;
  }, []);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            type="number"
            dataKey="speed"
            name="Rotational Speed"
            unit=" rpm"
            domain={[1000, 3000]}
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
            label={{
              value: 'Spindle Speed (RPM)',
              position: 'insideBottom',
              offset: -6,
              fill: '#94a3b8',
              fontSize: 10,
              fontFamily: 'monospace',
            }}
          />
          <YAxis
            type="number"
            dataKey="torque"
            name="Load Torque"
            unit=" Nm"
            domain={[0, 85]}
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
            label={{
              value: 'Torque (Nm)',
              angle: -90,
              position: 'insideLeft',
              fill: '#94a3b8',
              fontSize: 10,
              fontFamily: 'monospace',
            }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-[#0f172a] border border-slate-700 p-2.5 rounded shadow text-xs font-mono">
                    <p className={data.isFailure ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold'}>
                      {data.type}
                    </p>
                    <p className="text-slate-200 mt-1">Speed: {data.speed} rpm</p>
                    <p className="text-slate-200">Torque: {data.torque} Nm</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Operating Points" data={points}>
            {points.map((entry, index) => (
              <Cell
                key={`point-${index}`}
                fill={entry.isFailure ? '#f43f5e' : '#38bdf8'}
                opacity={entry.isFailure ? 0.9 : 0.6}
              />
            ))}
          </Scatter>
          {currentPoint && (
            <Scatter
              name="Current Evaluated Machine"
              data={[
                {
                  speed: currentPoint.speed,
                  torque: currentPoint.torque,
                  isFailure: false,
                  type: `Selected: ${currentPoint.machine_id || 'Inspected Machine'}`,
                },
              ]}
              fill="#f59e0b"
              shape="cross"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
