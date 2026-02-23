"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bond = void 0;
class Bond {
    faceValue;
    annualCouponRatePercent;
    marketPrice;
    yearsToMaturity;
    couponFrequency;
    constructor(faceValue, annualCouponRatePercent, marketPrice, yearsToMaturity, couponFrequency) {
        this.faceValue = faceValue;
        this.annualCouponRatePercent = annualCouponRatePercent;
        this.marketPrice = marketPrice;
        this.yearsToMaturity = yearsToMaturity;
        this.couponFrequency = couponFrequency;
    }
    get periodsPerYear() {
        return this.couponFrequency === 'semi-annual' ? 2 : 1;
    }
    get totalPeriods() {
        return Math.floor(this.yearsToMaturity * this.periodsPerYear);
    }
    get couponPerPeriod() {
        const annualCoupon = this.faceValue * (this.annualCouponRatePercent / 100);
        return annualCoupon / this.periodsPerYear;
    }
    get annualCouponPayment() {
        return this.faceValue * (this.annualCouponRatePercent / 100);
    }
}
exports.Bond = Bond;
//# sourceMappingURL=bond.entity.js.map