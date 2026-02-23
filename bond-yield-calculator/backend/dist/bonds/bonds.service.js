"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BondsService = void 0;
const common_1 = require("@nestjs/common");
const bond_entity_1 = require("../domain/bond.entity");
const bond_pricing_1 = require("./bond-pricing");
const bond_calculator_1 = require("./bond-calculator");
const cash_flow_generator_1 = require("./cash-flow-generator");
const ytm_solver_1 = require("./ytm-solver");
const calculate_bond_dto_1 = require("../dto/calculate-bond.dto");
const YIELD_RANGE_HALF = 0.05;
const YIELD_MIN_FLOOR = -0.5;
const YIELD_STEP = 0.0025;
let BondsService = class BondsService {
    cashFlowGenerator;
    ytmSolver;
    constructor(cashFlowGenerator, ytmSolver) {
        this.cashFlowGenerator = cashFlowGenerator;
        this.ytmSolver = ytmSolver;
    }
    calculate(dto) {
        const bond = this.toBond(dto);
        const currentYield = bond_calculator_1.BondCalculator.currentYield(bond);
        const ytm = this.ytmSolver.annualYtm(bond);
        const totalInterest = bond_calculator_1.BondCalculator.totalInterest(bond);
        const premiumOrDiscount = bond_calculator_1.BondCalculator.premiumOrDiscount(bond);
        const cashFlows = this.cashFlowGenerator.generate(bond);
        return {
            currentYield,
            ytm,
            totalInterest,
            premiumOrDiscount,
            cashFlows,
        };
    }
    getPriceYieldCurve(dto) {
        const bond = this.toBond(dto);
        const ytm = this.ytmSolver.annualYtm(bond);
        const yMin = Math.max(YIELD_MIN_FLOOR, ytm - YIELD_RANGE_HALF);
        const yMax = ytm + YIELD_RANGE_HALF;
        const curve = [];
        const numSteps = Math.ceil((yMax - yMin) / YIELD_STEP) + 1;
        for (let i = 0; i < numSteps; i++) {
            const y = yMin + i * YIELD_STEP;
            if (y > yMax)
                break;
            curve.push({
                yield: parseFloat(y.toFixed(4)),
                price: (0, bond_pricing_1.priceAtAnnualYield)(bond, y),
            });
        }
        return { curve, ytm };
    }
    toBond(dto) {
        const couponFrequency = dto.couponFrequency === calculate_bond_dto_1.CouponFrequencyDto.SEMI_ANNUAL
            ? 'semi-annual'
            : 'annual';
        return new bond_entity_1.Bond(dto.faceValue, dto.annualCouponRate, dto.marketPrice, dto.yearsToMaturity, couponFrequency);
    }
};
exports.BondsService = BondsService;
exports.BondsService = BondsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cash_flow_generator_1.CashFlowGenerator,
        ytm_solver_1.YtmSolver])
], BondsService);
//# sourceMappingURL=bonds.service.js.map