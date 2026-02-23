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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BondsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bonds_service_1 = require("./bonds.service");
const calculate_bond_dto_1 = require("../dto/calculate-bond.dto");
const bond_calculation_response_dto_1 = require("../dto/bond-calculation-response.dto");
const price_yield_curve_response_dto_1 = require("../dto/price-yield-curve-response.dto");
let BondsController = class BondsController {
    bondsService;
    constructor(bondsService) {
        this.bondsService = bondsService;
    }
    calculate(dto) {
        return this.bondsService.calculate(dto);
    }
    getPriceYieldCurve(dto) {
        return this.bondsService.getPriceYieldCurve(dto);
    }
};
exports.BondsController = BondsController;
__decorate([
    (0, common_1.Post)('calculate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate bond yield and cash flows' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Calculation result', type: bond_calculation_response_dto_1.BondCalculationResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_bond_dto_1.CalculateBondDto]),
    __metadata("design:returntype", bond_calculation_response_dto_1.BondCalculationResponseDto)
], BondsController.prototype, "calculate", null);
__decorate([
    (0, common_1.Post)('price-yield-curve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get price–yield curve for visualization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Curve points and YTM', type: price_yield_curve_response_dto_1.PriceYieldCurveResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_bond_dto_1.CalculateBondDto]),
    __metadata("design:returntype", price_yield_curve_response_dto_1.PriceYieldCurveResponseDto)
], BondsController.prototype, "getPriceYieldCurve", null);
exports.BondsController = BondsController = __decorate([
    (0, swagger_1.ApiTags)('bonds'),
    (0, common_1.Controller)('bonds'),
    __metadata("design:paramtypes", [bonds_service_1.BondsService])
], BondsController);
//# sourceMappingURL=bonds.controller.js.map