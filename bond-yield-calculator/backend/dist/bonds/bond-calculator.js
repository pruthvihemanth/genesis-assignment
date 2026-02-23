"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BondCalculator = void 0;
class BondCalculator {
    static currentYield(bond) {
        if (bond.marketPrice <= 0)
            return 0;
        return bond.annualCouponPayment / bond.marketPrice;
    }
    static totalInterest(bond) {
        return bond.couponPerPeriod * bond.totalPeriods;
    }
    static premiumOrDiscount(bond) {
        const diff = bond.marketPrice - bond.faceValue;
        if (Math.abs(diff) < 1e-9)
            return 'par';
        return diff > 0 ? 'premium' : 'discount';
    }
}
exports.BondCalculator = BondCalculator;
//# sourceMappingURL=bond-calculator.js.map