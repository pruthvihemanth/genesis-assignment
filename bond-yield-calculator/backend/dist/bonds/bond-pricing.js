"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceAtPeriodRate = priceAtPeriodRate;
exports.priceAtAnnualYield = priceAtAnnualYield;
function priceAtPeriodRate(bond, periodRate) {
    const { faceValue, totalPeriods, couponPerPeriod } = bond;
    if (totalPeriods <= 0)
        return 0;
    let pv = 0;
    for (let t = 1; t <= totalPeriods; t++) {
        pv += couponPerPeriod / Math.pow(1 + periodRate, t);
    }
    pv += faceValue / Math.pow(1 + periodRate, totalPeriods);
    return pv;
}
function priceAtAnnualYield(bond, annualYield) {
    const periodRate = bond.periodsPerYear === 2
        ? Math.pow(1 + annualYield, 0.5) - 1
        : annualYield;
    return priceAtPeriodRate(bond, periodRate);
}
//# sourceMappingURL=bond-pricing.js.map