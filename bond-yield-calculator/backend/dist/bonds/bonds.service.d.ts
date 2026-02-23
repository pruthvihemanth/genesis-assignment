import type { CashFlow } from '../domain/cash-flow.interface';
import type { PremiumOrDiscount } from './bond-calculator';
import { CashFlowGenerator } from './cash-flow-generator';
import { YtmSolver } from './ytm-solver';
import { CalculateBondDto } from '../dto/calculate-bond.dto';
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
export declare class BondsService {
    private readonly cashFlowGenerator;
    private readonly ytmSolver;
    constructor(cashFlowGenerator: CashFlowGenerator, ytmSolver: YtmSolver);
    calculate(dto: CalculateBondDto): BondCalculationResult;
    getPriceYieldCurve(dto: CalculateBondDto): PriceYieldCurveResult;
    private toBond;
}
