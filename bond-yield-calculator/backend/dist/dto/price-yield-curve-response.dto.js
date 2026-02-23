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
exports.PriceYieldCurveResponseDto = exports.PriceYieldPointDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PriceYieldPointDto {
    yield;
    price;
}
exports.PriceYieldPointDto = PriceYieldPointDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Annual yield as decimal (0.05 = 5%)' }),
    __metadata("design:type", Number)
], PriceYieldPointDto.prototype, "yield", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bond price at this yield' }),
    __metadata("design:type", Number)
], PriceYieldPointDto.prototype, "price", void 0);
class PriceYieldCurveResponseDto {
    curve;
    ytm;
}
exports.PriceYieldCurveResponseDto = PriceYieldCurveResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PriceYieldPointDto] }),
    __metadata("design:type", Array)
], PriceYieldCurveResponseDto.prototype, "curve", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Computed yield to maturity (decimal)' }),
    __metadata("design:type", Number)
], PriceYieldCurveResponseDto.prototype, "ytm", void 0);
//# sourceMappingURL=price-yield-curve-response.dto.js.map