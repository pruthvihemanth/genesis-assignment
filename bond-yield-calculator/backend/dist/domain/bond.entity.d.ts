export type CouponFrequency = 'annual' | 'semi-annual';
export declare class Bond {
    readonly faceValue: number;
    readonly annualCouponRatePercent: number;
    readonly marketPrice: number;
    readonly yearsToMaturity: number;
    readonly couponFrequency: CouponFrequency;
    constructor(faceValue: number, annualCouponRatePercent: number, marketPrice: number, yearsToMaturity: number, couponFrequency: CouponFrequency);
    get periodsPerYear(): number;
    get totalPeriods(): number;
    get couponPerPeriod(): number;
    get annualCouponPayment(): number;
}
