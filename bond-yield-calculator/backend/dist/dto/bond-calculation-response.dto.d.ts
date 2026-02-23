export declare class CashFlowResponseDto {
    period: number;
    paymentDate: string;
    couponPayment: number;
    cumulativeInterest: number;
    remainingPrincipal: number;
}
export declare class BondCalculationResponseDto {
    currentYield: number;
    ytm: number;
    totalInterest: number;
    premiumOrDiscount: 'premium' | 'discount' | 'par';
    cashFlows: CashFlowResponseDto[];
}
