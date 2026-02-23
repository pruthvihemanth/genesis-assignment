import { BondsService } from './bonds.service';
import { CalculateBondDto } from '../dto/calculate-bond.dto';
import { BondCalculationResponseDto } from '../dto/bond-calculation-response.dto';
import { PriceYieldCurveResponseDto } from '../dto/price-yield-curve-response.dto';
export declare class BondsController {
    private readonly bondsService;
    constructor(bondsService: BondsService);
    calculate(dto: CalculateBondDto): BondCalculationResponseDto;
    getPriceYieldCurve(dto: CalculateBondDto): PriceYieldCurveResponseDto;
}
