"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BondsModule = void 0;
const common_1 = require("@nestjs/common");
const bonds_controller_1 = require("./bonds.controller");
const bonds_service_1 = require("./bonds.service");
const cash_flow_generator_1 = require("./cash-flow-generator");
const ytm_solver_1 = require("./ytm-solver");
let BondsModule = class BondsModule {
};
exports.BondsModule = BondsModule;
exports.BondsModule = BondsModule = __decorate([
    (0, common_1.Module)({
        controllers: [bonds_controller_1.BondsController],
        providers: [bonds_service_1.BondsService, cash_flow_generator_1.CashFlowGenerator, ytm_solver_1.YtmSolver],
    })
], BondsModule);
//# sourceMappingURL=bonds.module.js.map