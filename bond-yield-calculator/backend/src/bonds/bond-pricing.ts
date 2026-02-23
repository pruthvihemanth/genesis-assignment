import { Bond } from '../domain/bond.entity';

/**
 * Single source of truth for bond pricing. Used by YtmSolver and curve generation.
 * Computes present value of cash flows at the given per-period discount rate.
 */
export function priceAtPeriodRate(bond: Bond, periodRate: number): number {
  const { faceValue, totalPeriods, couponPerPeriod } = bond;
  if (totalPeriods <= 0) return 0;
  let pv = 0;
  for (let t = 1; t <= totalPeriods; t++) {
    pv += couponPerPeriod / Math.pow(1 + periodRate, t);
  }
  pv += faceValue / Math.pow(1 + periodRate, totalPeriods);
  return pv;
}

/**
 * Bond price at a given annual yield (decimal). Converts annual yield to period rate
 * and uses the same pricing formula as YtmSolver for consistency.
 */
export function priceAtAnnualYield(bond: Bond, annualYield: number): number {
  const periodRate =
    bond.periodsPerYear === 2
      ? Math.pow(1 + annualYield, 0.5) - 1
      : annualYield;
  return priceAtPeriodRate(bond, periodRate);
}
