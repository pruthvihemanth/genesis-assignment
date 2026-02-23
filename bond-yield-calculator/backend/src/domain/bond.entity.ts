export type CouponFrequency = 'annual' | 'semi-annual';

export class Bond {
  constructor(
    public readonly faceValue: number,
    public readonly annualCouponRatePercent: number,
    public readonly marketPrice: number,
    public readonly yearsToMaturity: number,
    public readonly couponFrequency: CouponFrequency,
  ) {}

  get periodsPerYear(): number {
    return this.couponFrequency === 'semi-annual' ? 2 : 1;
  }

  get totalPeriods(): number {
    return Math.floor(this.yearsToMaturity * this.periodsPerYear);
  }

  get couponPerPeriod(): number {
    const annualCoupon =
      this.faceValue * (this.annualCouponRatePercent / 100);
    return annualCoupon / this.periodsPerYear;
  }

  get annualCouponPayment(): number {
    return this.faceValue * (this.annualCouponRatePercent / 100);
  }
}
