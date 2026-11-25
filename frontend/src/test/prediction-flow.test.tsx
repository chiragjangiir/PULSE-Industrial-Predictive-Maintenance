import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { PredictPage } from '@/pages/PredictPage';
import { pulseApi } from '@/services/api/pulseApi';

describe('Machine Diagnostics & Prediction Sandbox Flow', () => {
  beforeEach(() => {
    pulseApi.setDemoMode(true);
  });

  it('renders prediction controls and scenario preset buttons', async () => {
    render(
      <AppProvider>
        <BrowserRouter>
          <PredictPage />
        </BrowserRouter>
      </AppProvider>
    );

    expect(screen.getByText(/interactive machine diagnostic sandbox/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tool wear \(twf\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /heat deficit \(hdf\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /power anomaly \(pwf\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /execute prediction inference/i })).toBeInTheDocument();

    // Initial prediction on mount should resolve to PREDICTED NOMINAL (low wear 115)
    await waitFor(() => {
      expect(screen.getByText(/predicted nominal/i)).toBeInTheDocument();
    });

    // Click the Tool Wear (TWF) preset button
    const twfButton = screen.getByRole('button', { name: /tool wear \(twf\)/i });
    fireEvent.click(twfButton);

    // Verify parameter display reflects updated wear
    await waitFor(() => {
      expect(screen.getByText(/218 min/i)).toBeInTheDocument();
    });

    // Click Execute Prediction Inference
    const executeButton = screen.getByRole('button', { name: /execute prediction inference/i });
    fireEvent.click(executeButton);

    // Verify inference result changes to PREDICTED MACHINE FAILURE
    await waitFor(
      () => {
        expect(screen.getByText(/predicted machine failure/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
