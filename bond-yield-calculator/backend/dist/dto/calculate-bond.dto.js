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
exports.CalculateBondDto = exports.CouponFrequencyDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var CouponFrequencyDto;
(function (CouponFrequencyDto) {
    CouponFrequencyDto["ANNUAL"] = "annual";
    CouponFrequencyDto["SEMI_ANNUAL"] = "semi-annual";
})(CouponFrequencyDto || (exports.CouponFrequencyDto = CouponFrequencyDto = {}));
class CalculateBondDto {
    faceValue;
    annualCouponRate;
    marketPrice;
    yearsToMaturity;
    couponFrequency;
}
exports.CalculateBondDto = CalculateBondDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000, description: 'Face value of the bond' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'Face value must be positive' }),
    __metadata("design:type", Number)
], CalculateBondDto.prototype, "faceValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Annual coupon rate in percent' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Coupon rate cannot be negative' }),
    (0, class_validator_1.Max)(100, { message: 'Coupon rate cannot exceed 100%' }),
    __metadata("design:type", Number)
], CalculateBondDto.prototype, "annualCouponRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 950, description: 'Current market price' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'Market price must be positive' }),
    __metadata("design:type", Number)
], CalculateBondDto.prototype, "marketPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Years to maturity' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'Years to maturity must be positive' }),
    (0, class_validator_1.Max)(100, { message: 'Years to maturity must be reasonable' }),
    __metadata("design:type", Number)
], CalculateBondDto.prototype, "yearsToMaturity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: CouponFrequencyDto,
        default: CouponFrequencyDto.ANNUAL,
    }),
    (0, class_validator_1.IsEnum)(CouponFrequencyDto),
    __metadata("design:type", String)
], CalculateBondDto.prototype, "couponFrequency", void 0);
//# sourceMappingURL=calculate-bond.dto.js.map