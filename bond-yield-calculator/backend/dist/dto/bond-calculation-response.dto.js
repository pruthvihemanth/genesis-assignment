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
exports.BondCalculationResponseDto = exports.CashFlowResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CashFlowResponseDto {
    period;
    paymentDate;
    couponPayment;
    cumulativeInterest;
    remainingPrincipal;
}
exports.CashFlowResponseDto = CashFlowResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CashFlowResponseDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CashFlowResponseDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CashFlowResponseDto.prototype, "couponPayment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CashFlowResponseDto.prototype, "cumulativeInterest", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CashFlowResponseDto.prototype, "remainingPrincipal", void 0);
class BondCalculationResponseDto {
    currentYield;
    ytm;
    totalInterest;
    premiumOrDiscount;
    cashFlows;
}
exports.BondCalculationResponseDto = BondCalculationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current yield (decimal)' }),
    __metadata("design:type", Number)
], BondCalculationResponseDto.prototype, "currentYield", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Yield to maturity annual (decimal)' }),
    __metadata("design:type", Number)
], BondCalculationResponseDto.prototype, "ytm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total interest over life of bond' }),
    __metadata("design:type", Number)
], BondCalculationResponseDto.prototype, "totalInterest", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['premium', 'discount', 'par'] }),
    __metadata("design:type", String)
], BondCalculationResponseDto.prototype, "premiumOrDiscount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CashFlowResponseDto] }),
    __metadata("design:type", Array)
], BondCalculationResponseDto.prototype, "cashFlows", void 0);
//# sourceMappingURL=bond-calculation-response.dto.js.map