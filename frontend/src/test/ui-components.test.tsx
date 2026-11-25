import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Button } from '../components/ui/Button';
import { RiskBadge, MachineStatusBadge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Progress } from '../components/ui/Progress';
import { Input } from '../components/ui/Input';

describe('Design System UI Components', () => {
  it('renders Button component with label and handles loading state', () => {
    const { rerender } = render(<Button>Execute Diagnostic</Button>);
    expect(screen.getByRole('button', { name: /execute diagnostic/i })).toBeInTheDocument();

    rerender(<Button isLoading>Execute Diagnostic</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders Badge and RiskBadge levels with proper styling and accessible text', () => {
    const { rerender } = render(<RiskBadge level="CRITICAL" />);
    expect(screen.getByText(/critical/i)).toBeInTheDocument();

    rerender(<RiskBadge level="LOW" />);
    expect(screen.getByText(/low risk/i)).toBeInTheDocument();

    rerender(<MachineStatusBadge status="OPERATIONAL" />);
    expect(screen.getByText(/operational/i)).toBeInTheDocument();
  });

  it('renders StatCard with title, value, and trend', () => {
    render(
      <StatCard
        title="Spindle Load"
        value="42.5 Nm"
        subtitle="Nominal operating range"
        trend={{ value: '+2.1% variance', isPositive: true }}
      />
    );
    expect(screen.getByText('Spindle Load')).toBeInTheDocument();
    expect(screen.getByText('42.5 Nm')).toBeInTheDocument();
    expect(screen.getByText('Nominal operating range')).toBeInTheDocument();
    expect(screen.getByText('+2.1% variance')).toBeInTheDocument();
  });

  it('renders Input component with label, unit, and helper text', () => {
    render(
      <Input
        label="Rotational Speed"
        unit="rpm"
        defaultValue="1520"
        helperText="Spindle velocity in RPM"
      />
    );
    expect(screen.getByLabelText('Rotational Speed')).toBeInTheDocument();
    expect(screen.getByText('rpm')).toBeInTheDocument();
    expect(screen.getByText('Spindle velocity in RPM')).toBeInTheDocument();
  });

  it('renders Progress bar with threshold indicator', () => {
    const { container } = render(<Progress value={78} threshold={42} variant="risk" />);
    const bar = container.querySelector('div[style*="width: 78%"]');
    expect(bar).toBeInTheDocument();
  });
});
