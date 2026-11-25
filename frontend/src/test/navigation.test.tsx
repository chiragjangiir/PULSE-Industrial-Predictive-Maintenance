import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from '@/App';

describe('Application Shell & Navigation Integration', () => {
  it('renders application brand, header, and primary navigation links', () => {
    render(<App />);
    expect(screen.getAllByText('PULSE')[0]).toBeInTheDocument();
    expect(screen.getByText('Command Center')).toBeInTheDocument();
    expect(screen.getByText('Fleet Monitor')).toBeInTheDocument();
    expect(screen.getByText('Predict & Diagnose')).toBeInTheDocument();
    expect(screen.getByText('Maintenance Alerts')).toBeInTheDocument();
    expect(screen.getByText('Analytics Studio')).toBeInTheDocument();
    expect(screen.getByText('Model Lab & Eval')).toBeInTheDocument();
    expect(screen.getByText('Explainability & SHAP')).toBeInTheDocument();
    expect(screen.getByText('Batch Data Explorer')).toBeInTheDocument();
    expect(screen.getByText('Project & References')).toBeInTheDocument();
  });

  it('renders the overview command center KPIs and section headers', () => {
    render(<App />);
    expect(screen.getByText('Monitored Fleet')).toBeInTheDocument();
    expect(screen.getByText('Critical Risk Machines')).toBeInTheDocument();
    expect(screen.getByText('Risk Priority Watchlist')).toBeInTheDocument();
  });
});
