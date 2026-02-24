import React from 'react';
import { render, screen } from '@testing-library/react';
import { CashFlowTable } from '../../src/components/CashFlowTable';
import type { CashFlow } from '../../src/types/bond';

const mockCashFlows: CashFlow[] = [
  {
    period: 1,
    paymentDate: '2025-08-23',
    couponPayment: 25,
    cumulativeInterest: 25,
    remainingPrincipal: 1000,
  },
  {
    period: 2,
    paymentDate: '2026-02-23',
    couponPayment: 25,
    cumulativeInterest: 50,
    remainingPrincipal: 0,
  },
];

describe('CashFlowTable', () => {
  it('returns null when cashFlows is empty', () => {
    const { container } = render(<CashFlowTable cashFlows={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders Cash flow schedule heading', () => {
    render(<CashFlowTable cashFlows={mockCashFlows} />);
    expect(
      screen.getByRole('heading', { name: 'Cash flow schedule' })
    ).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<CashFlowTable cashFlows={mockCashFlows} />);
    expect(screen.getByText('Period')).toBeInTheDocument();
    expect(screen.getByText('Payment date')).toBeInTheDocument();
    expect(screen.getByText('Coupon payment')).toBeInTheDocument();
    expect(screen.getByText('Cumulative interest')).toBeInTheDocument();
    expect(screen.getByText('Remaining principal')).toBeInTheDocument();
  });

  it('renders one row per cash flow', () => {
    render(<CashFlowTable cashFlows={mockCashFlows} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('2025-08-23')).toBeInTheDocument();
    expect(screen.getByText('2026-02-23')).toBeInTheDocument();
  });

  it('formats currency columns', () => {
    render(<CashFlowTable cashFlows={mockCashFlows} />);
    expect(screen.getAllByText('$25.00').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('$50.00')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });
});
