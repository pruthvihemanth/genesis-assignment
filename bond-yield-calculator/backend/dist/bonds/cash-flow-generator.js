"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashFlowGenerator = void 0;
const MONTHS_PER_PERIOD_ANNUAL = 12;
const MONTHS_PER_PERIOD_SEMI_ANNUAL = 6;
class CashFlowGenerator {
    generate(bond, baseDate = new Date()) {
        const flows = [];
        const periods = bond.totalPeriods;
        const couponPerPeriod = bond.couponPerPeriod;
        const monthsPerPeriod = bond.periodsPerYear === 2
            ? MONTHS_PER_PERIOD_SEMI_ANNUAL
            : MONTHS_PER_PERIOD_ANNUAL;
        let cumulativeInterest = 0;
        for (let period = 1; period <= periods; period++) {
            cumulativeInterest += couponPerPeriod;
            const paymentDate = this.addMonths(baseDate, period * monthsPerPeriod);
            const isLastPeriod = period === periods;
            const remainingPrincipal = isLastPeriod ? 0 : bond.faceValue;
            flows.push({
                period,
                paymentDate: paymentDate.toISOString().split('T')[0],
                couponPayment: couponPerPeriod,
                cumulativeInterest,
                remainingPrincipal,
            });
        }
        return flows;
    }
    addMonths(date, months) {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    }
}
exports.CashFlowGenerator = CashFlowGenerator;
//# sourceMappingURL=cash-flow-generator.js.map