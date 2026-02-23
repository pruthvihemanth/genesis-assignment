import { IsNumber, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CouponFrequencyDto {
  ANNUAL = 'annual',
  SEMI_ANNUAL = 'semi-annual',
}

export class CalculateBondDto {
  @ApiProperty({ example: 1000, description: 'Face value of the bond' })
  @IsNumber()
  @Min(0.01, { message: 'Face value must be positive' })
  faceValue!: number;

  @ApiProperty({ example: 5, description: 'Annual coupon rate in percent' })
  @IsNumber()
  @Min(0, { message: 'Coupon rate cannot be negative' })
  @Max(100, { message: 'Coupon rate cannot exceed 100%' })
  annualCouponRate!: number;

  @ApiProperty({ example: 950, description: 'Current market price' })
  @IsNumber()
  @Min(0.01, { message: 'Market price must be positive' })
  marketPrice!: number;

  @ApiProperty({ example: 10, description: 'Years to maturity' })
  @IsNumber()
  @Min(0.01, { message: 'Years to maturity must be positive' })
  @Max(100, { message: 'Years to maturity must be reasonable' })
  yearsToMaturity!: number;

  @ApiProperty({
    enum: CouponFrequencyDto,
    default: CouponFrequencyDto.ANNUAL,
  })
  @IsEnum(CouponFrequencyDto)
  couponFrequency!: CouponFrequencyDto;
}
