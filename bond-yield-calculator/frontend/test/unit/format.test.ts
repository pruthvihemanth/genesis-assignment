import { formatCurrency, formatPercent } from '../../src/utils/format';

describe('formatCurrency', () => {
  it('formats positive number as USD', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats with two decimal places', () => {
    expect(formatCurrency(99.1)).toBe('$99.10');
    expect(formatCurrency(50.567)).toBe('$50.57');
  });

  it('formats negative numbers', () => {
    expect(formatCurrency(-100)).toBe('-$100.00');
  });
});

describe('formatPercent', () => {
  it('converts decimal to percentage with default 2 decimals', () => {
    expect(formatPercent(0.05)).toBe('5.00%');
    expect(formatPercent(0.0526)).toBe('5.26%');
  });

  it('allows custom decimal places', () => {
    expect(formatPercent(0.05, 0)).toBe('5%');
    expect(formatPercent(0.052678, 3)).toBe('5.268%');
  });

  it('handles zero', () => {
    expect(formatPercent(0)).toBe('0.00%');
  });
});
