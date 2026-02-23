import { Bond } from '../domain/bond.entity';
import { priceAtPeriodRate } from './bond-pricing';

const TOLERANCE = 1e-6;
const MAX_ITERATIONS = 1000;
const RATE_LOW = 0;
const RATE_HIGH = 2;

export class YtmSolver {
  solve(bond: Bond): number {
    const { marketPrice, totalPeriods } = bond;

    if (totalPeriods <= 0) {
      return 0;
    }

    let low = RATE_LOW;
    let high = RATE_HIGH;

    if (priceAtPeriodRate(bond, low) < marketPrice) {
      return 0;
    }
    if (priceAtPeriodRate(bond, high) > marketPrice) {
      return high;
    }

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const mid = (low + high) / 2;
      const price = priceAtPeriodRate(bond, mid);

      if (Math.abs(price - marketPrice) < TOLERANCE) {
        return mid;
      }

      if (price > marketPrice) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return (low + high) / 2;
  }

  /** Returns annual YTM (decimal). Period rate is per coupon period. */
  annualYtm(bond: Bond): number {
    const periodRate = this.solve(bond);
    return bond.periodsPerYear === 2
      ? Math.pow(1 + periodRate, 2) - 1
      : periodRate;
  }
}
