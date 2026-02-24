import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';
import * as api from '../../src/api/apiClient';
import type { BondCalculationResult, PriceYieldCurveResult } from '../../src/types/bond';

jest.mock('../../src/api/apiClient');

describe('App', () => {
  it('renders Bond Yield Calculator heading', () => {
    render(<App />);
    const heading = screen.getByText(/Bond Yield Calculator/i);
    expect(heading).toBeInTheDocument();
  });

  it('shows error message when calculateBond fails', async () => {
    jest.mocked(api.calculateBond).mockRejectedValueOnce(new Error('Network error'));
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/Calculation failed|Network error/i);
  });

  it('shows Results and cash flow when calculateBond succeeds', async () => {
    const mockResult: BondCalculationResult = {
      currentYield: 0.05,
      ytm: 0.06,
      totalInterest: 500,
      premiumOrDiscount: 'discount',
      cashFlows: [
        {
          period: 1,
          paymentDate: '2025-08-23',
          couponPayment: 50,
          cumulativeInterest: 50,
          remainingPrincipal: 1000,
        },
      ],
    };
    const mockCurve: PriceYieldCurveResult = {
      curve: [{ yield: 0.05, price: 1000 }],
      ytm: 0.06,
    };
    jest.mocked(api.calculateBond).mockResolvedValueOnce(mockResult);
    jest.mocked(api.getPriceYieldCurve).mockResolvedValue(mockCurve);
    render(<App />);
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(
      await screen.findByRole('heading', { name: 'Results' }, { timeout: 3000 })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cash flow schedule' })).toBeInTheDocument();
  });
});
