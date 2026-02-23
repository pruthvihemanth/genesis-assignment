"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YtmSolver = void 0;
const bond_pricing_1 = require("./bond-pricing");
const TOLERANCE = 1e-6;
const MAX_ITERATIONS = 1000;
const RATE_LOW = 0;
const RATE_HIGH = 2;
class YtmSolver {
    solve(bond) {
        const { marketPrice, totalPeriods } = bond;
        if (totalPeriods <= 0) {
            return 0;
        }
        let low = RATE_LOW;
        let high = RATE_HIGH;
        if ((0, bond_pricing_1.priceAtPeriodRate)(bond, low) < marketPrice) {
            return 0;
        }
        if ((0, bond_pricing_1.priceAtPeriodRate)(bond, high) > marketPrice) {
            return high;
        }
        for (let i = 0; i < MAX_ITERATIONS; i++) {
            const mid = (low + high) / 2;
            const price = (0, bond_pricing_1.priceAtPeriodRate)(bond, mid);
            if (Math.abs(price - marketPrice) < TOLERANCE) {
                return mid;
            }
            if (price > marketPrice) {
                low = mid;
            }
            else {
                high = mid;
            }
        }
        return (low + high) / 2;
    }
    annualYtm(bond) {
        const periodRate = this.solve(bond);
        return bond.periodsPerYear === 2
            ? Math.pow(1 + periodRate, 2) - 1
            : periodRate;
    }
}
exports.YtmSolver = YtmSolver;
//# sourceMappingURL=ytm-solver.js.map