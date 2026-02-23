export type CouponFrequency = 'annual' | 'semi-annual';

export interface BondFormInput {
  faceValue: number;
  annualCouponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: CouponFrequency;
}

export interface CashFlow {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export type PremiumOrDiscount = 'premium' | 'discount' | 'par';

export interface BondCalculationResult {
  currentYield: number;
  ytm: number;
  totalInterest: number;
  premiumOrDiscount: PremiumOrDiscount;
  cashFlows: CashFlow[];
}

export interface PriceYieldPoint {
  yield: number;
  price: number;
}

export interface PriceYieldCurveResult {
  curve: PriceYieldPoint[];
  ytm: number;
}
