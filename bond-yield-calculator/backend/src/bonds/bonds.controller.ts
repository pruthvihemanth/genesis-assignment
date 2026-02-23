import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BondsService } from './bonds.service';
import { CalculateBondDto } from '../dto/calculate-bond.dto';
import { BondCalculationResponseDto } from '../dto/bond-calculation-response.dto';
import { PriceYieldCurveResponseDto } from '../dto/price-yield-curve-response.dto';

@ApiTags('bonds')
@Controller('bonds')
export class BondsController {
  constructor(private readonly bondsService: BondsService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate bond yield and cash flows' })
  @ApiResponse({ status: 200, description: 'Calculation result', type: BondCalculationResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  calculate(@Body() dto: CalculateBondDto): BondCalculationResponseDto {
    return this.bondsService.calculate(dto) as BondCalculationResponseDto;
  }

  @Post('price-yield-curve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get price–yield curve for visualization' })
  @ApiResponse({ status: 200, description: 'Curve points and YTM', type: PriceYieldCurveResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  getPriceYieldCurve(@Body() dto: CalculateBondDto): PriceYieldCurveResponseDto {
    return this.bondsService.getPriceYieldCurve(dto) as PriceYieldCurveResponseDto;
  }
}
