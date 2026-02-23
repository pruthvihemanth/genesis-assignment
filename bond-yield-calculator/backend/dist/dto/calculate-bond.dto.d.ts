export declare enum CouponFrequencyDto {
    ANNUAL = "annual",
    SEMI_ANNUAL = "semi-annual"
}
export declare class CalculateBondDto {
    faceValue: number;
    annualCouponRate: number;
    marketPrice: number;
    yearsToMaturity: number;
    couponFrequency: CouponFrequencyDto;
}
