import React from 'react';
import { render, screen } from '@testing-library/react';
import { BondResults } from '../../src/components/BondResults';
import type { BondCalculationResult } from '../../src/types/bond';

const mockResult: BondCalculationResult = {
  currentYield: 0.0526,
  ytm: 0.056,
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

describe('BondResults', () => {
  it('returns null when result is null', () => {
    const { container } = render(<BondResults result={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders Results heading', () => {
    render(<BondResults result={mockResult} />);
    expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument();
  });

  it('displays current yield as percentage', () => {
    render(<BondResults result={mockResult} />);
    expect(screen.getByText('Current yield')).toBeInTheDocument();
    expect(screen.getByText('5.26%')).toBeInTheDocument();
  });

  it('displays YTM as percentage', () => {
    render(<BondResults result={mockResult} />);
    expect(screen.getByText('Yield to maturity (YTM)')).toBeInTheDocument();
    expect(screen.getByText('5.60%')).toBeInTheDocument();
  });

  it('displays total interest as currency', () => {
    render(<BondResults result={mockResult} />);
    expect(screen.getByText('Total interest earned')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
  });

  it('displays Premium badge when premiumOrDiscount is premium', () => {
    render(
      <BondResults
        result={{ ...mockResult, premiumOrDiscount: 'premium' }}
      />
    );
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('displays Discount badge when premiumOrDiscount is discount', () => {
    render(<BondResults result={mockResult} />);
    expect(screen.getByText('Discount')).toBeInTheDocument();
  });

  it('displays Par badge when premiumOrDiscount is par', () => {
    render(
      <BondResults result={{ ...mockResult, premiumOrDiscount: 'par' }} />
    );
    expect(screen.getByText('Par')).toBeInTheDocument();
  });
});
