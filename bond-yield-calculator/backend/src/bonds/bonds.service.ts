import { Injectable } from '@nestjs/common';
import { Bond } from '../domain/bond.entity';
import type { CashFlow } from '../domain/cash-flow.interface';
import type { PremiumOrDiscount } from './bond-calculator';
import { priceAtAnnualYield } from './bond-pricing';
import { BondCalculator } from './bond-calculator';
import { CashFlowGenerator } from './cash-flow-generator';
import { YtmSolver } from './ytm-solver';
import { CalculateBondDto, CouponFrequencyDto } from '../dto/calculate-bond.dto';

const YIELD_RANGE_HALF = 0.05;
const YIELD_MIN_FLOOR = -0.5;
const YIELD_STEP = 0.0025;

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

@Injectable()
export class BondsService {
  constructor(
    private readonly cashFlowGenerator: CashFlowGenerator,
    private readonly ytmSolver: YtmSolver,
  ) {}

  calculate(dto: CalculateBondDto): BondCalculationResult {
    const bond = this.toBond(dto);
    const currentYield = BondCalculator.currentYield(bond);
    const ytm = this.ytmSolver.annualYtm(bond);
    const totalInterest = BondCalculator.totalInterest(bond);
    const premiumOrDiscount = BondCalculator.premiumOrDiscount(bond);
    const cashFlows = this.cashFlowGenerator.generate(bond);

    return {
      currentYield,
      ytm,
      totalInterest,
      premiumOrDiscount,
      cashFlows,
    };
  }

  getPriceYieldCurve(dto: CalculateBondDto): PriceYieldCurveResult {
    const bond = this.toBond(dto);
    const ytm = this.ytmSolver.annualYtm(bond);
    const yMin = Math.max(YIELD_MIN_FLOOR, ytm - YIELD_RANGE_HALF);
    const yMax = ytm + YIELD_RANGE_HALF;
    const curve: PriceYieldPoint[] = [];
    const numSteps = Math.ceil((yMax - yMin) / YIELD_STEP) + 1;
    for (let i = 0; i < numSteps; i++) {
      const y = yMin + i * YIELD_STEP;
      if (y > yMax) break;
      curve.push({
        yield: parseFloat(y.toFixed(4)),
        price: priceAtAnnualYield(bond, y),
      });
    }
    return { curve, ytm };
  }

  private toBond(dto: CalculateBondDto): Bond {
    const couponFrequency =
      dto.couponFrequency === CouponFrequencyDto.SEMI_ANNUAL
        ? 'semi-annual'
        : 'annual';
    return new Bond(
      dto.faceValue,
      dto.annualCouponRate,
      dto.marketPrice,
      dto.yearsToMaturity,
      couponFrequency,
    );
  }
}
