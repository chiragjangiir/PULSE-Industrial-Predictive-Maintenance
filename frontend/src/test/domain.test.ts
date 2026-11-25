import { describe, it, expect } from 'vitest';
import { MockPredictionService } from '../services/mock/mockService';
import { PredictionRequest } from '../types/api';

describe('MockPredictionService Domain Physics Engine', () => {
  it('correctly predicts nominal operating conditions without failure', () => {
    const req: PredictionRequest = {
      machine_id: 'MCH-NOMINAL-01',
      machine_type: 'M',
      air_temperature: 298.2,
      process_temperature: 308.6, // Delta = 10.4 K (safe)
      rotational_speed: 1530, // Normal rpm
      torque: 40.0, // Normal torque -> Power = 6412 W (within 3500-9000W)
      tool_wear: 65, // Low wear (< 200)
    };

    const res = MockPredictionService.predict(req);
    expect(res.prediction).toBe(0);
    expect(res.failure_probability).toBeLessThan(0.42);
    expect(res.risk_level).toBe('LOW');
    expect(res.primary_failure_mode).toBe('No Failure');
  });

  it('correctly triggers Tool Wear Failure (TWF) when blade contact duration >= 200 min', () => {
    const req: PredictionRequest = {
      machine_id: 'MCH-TWF-01',
      machine_type: 'L',
      air_temperature: 298.5,
      process_temperature: 309.0,
      rotational_speed: 1500,
      torque: 40.0,
      tool_wear: 215, // >= 200 min
    };

    const res = MockPredictionService.predict(req);
    expect(res.prediction).toBe(1);
    expect(res.failure_probability).toBeGreaterThanOrEqual(0.65);
    expect(res.primary_failure_mode).toBe('Tool Wear Failure (TWF)');
    expect(res.risk_level).toMatch(/HIGH|CRITICAL/);
  });

  it('correctly triggers Heat Dissipation Failure (HDF) when temp delta < 8.6K and speed < 1380 rpm', () => {
    const req: PredictionRequest = {
      machine_id: 'MCH-HDF-01',
      machine_type: 'L',
      air_temperature: 302.5,
      process_temperature: 310.2, // Delta = 7.7 K (< 8.6 K)
      rotational_speed: 1320, // < 1380 rpm
      torque: 45.0,
      tool_wear: 80,
    };

    const res = MockPredictionService.predict(req);
    expect(res.prediction).toBe(1);
    expect(res.primary_failure_mode).toBe('Heat Dissipation Failure (HDF)');
  });

  it('correctly triggers Power Failure (PWF) on power overload (> 9,000 W)', () => {
    const req: PredictionRequest = {
      machine_id: 'MCH-PWF-01',
      machine_type: 'H',
      air_temperature: 298.0,
      process_temperature: 308.0,
      rotational_speed: 1250,
      torque: 74.0, // Power = (2 * pi * 1250 / 60) * 74 = ~9686 W (> 9000 W)
      tool_wear: 50,
    };

    const res = MockPredictionService.predict(req);
    expect(res.prediction).toBe(1);
    expect(res.primary_failure_mode).toBe('Power Failure (PWF)');
  });

  it('correctly predicts batch items and aggregates summary metrics', () => {
    const items: PredictionRequest[] = [
      { machine_id: 'M-1', machine_type: 'M', air_temperature: 298, process_temperature: 308, rotational_speed: 1500, torque: 40, tool_wear: 50 },
      { machine_id: 'M-2', machine_type: 'L', air_temperature: 298, process_temperature: 308, rotational_speed: 1500, torque: 40, tool_wear: 220 }, // TWF
    ];

    const batch = MockPredictionService.predictBatch(items);
    expect(batch.total_records).toBe(2);
    expect(batch.summary.predicted_failures).toBe(1);
    expect(batch.predictions[0].prediction).toBe(0);
    expect(batch.predictions[1].prediction).toBe(1);
  });
});
