import { Bond } from '../domain/bond.entity.js';

export type PremiumOrDiscount = 'premium' | 'discount' | 'par';

export class BondCalculator {
  static currentYield(bond: Bond): number {
    if (bond.marketPrice <= 0) return 0;
    return bond.annualCouponPayment / bond.marketPrice;
  }

  static totalInterest(bond: Bond): number {
    return bond.couponPerPeriod * bond.totalPeriods;
  }

  static premiumOrDiscount(bond: Bond): PremiumOrDiscount {
    const diff = bond.marketPrice - bond.faceValue;
    if (Math.abs(diff) < 1e-9) return 'par';
    return diff > 0 ? 'premium' : 'discount';
  }
}
