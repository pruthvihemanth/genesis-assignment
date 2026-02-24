import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BondForm } from '../../src/components/BondForm';
import type { BondFormInput } from '../../src/types/bond';

describe('BondForm', () => {
  const mockOnSubmit = jest.fn<(input: BondFormInput) => void>();
  const mockOnReset = jest.fn<() => void>();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input labels', () => {
    render(
      <BondForm onSubmit={mockOnSubmit} onReset={mockOnReset} isLoading={false} />
    );
    expect(screen.getByLabelText(/Face value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Annual coupon rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Market price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Years to maturity/i)).toBeInTheDocument();
    expect(screen.getByText('Coupon frequency')).toBeInTheDocument();
  });

  it('renders with default values', () => {
    render(
      <BondForm onSubmit={mockOnSubmit} onReset={mockOnReset} isLoading={false} />
    );
    expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('950')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  it('renders Annual and Semi-annual options', () => {
    render(
      <BondForm onSubmit={mockOnSubmit} onReset={mockOnReset} isLoading={false} />
    );
    expect(screen.getByRole('radio', { name: 'Annual' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Semi-annual' })).toBeInTheDocument();
  });

  it('calls onSubmit with form values when Calculate is clicked', async () => {
    render(
      <BondForm onSubmit={mockOnSubmit} onReset={mockOnReset} isLoading={false} />
    );
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
    const submitted = mockOnSubmit.mock.calls[0][0] as BondFormInput;
    expect(submitted.faceValue).toBe(1000);
    expect(submitted.annualCouponRate).toBe(5);
    expect(submitted.marketPrice).toBe(950);
    expect(submitted.yearsToMaturity).toBe(10);
    expect(submitted.couponFrequency).toBe('annual');
  });

  it('calls onReset when Reset is clicked', async () => {
    render(
      <BondForm onSubmit={mockOnSubmit} onReset={mockOnReset} isLoading={false} />
    );
    await userEvent.click(screen.getByRole('button', { name: /Reset/i }));
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isLoading is true', () => {
    render(
      <BondForm onSubmit={mockOnSubmit} onReset={mockOnReset} isLoading={true} />
    );
    expect(screen.getByRole('button', { name: /Calculating/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeDisabled();
  });

  it('shows validation error when face value is empty', async () => {
    render(
      <BondForm onSubmit={mockOnSubmit} onReset={mockOnReset} isLoading={false} />
    );
    const faceInput = screen.getByLabelText(/Face value/i);
    userEvent.clear(faceInput);
    userEvent.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(await screen.findByText(/Required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
