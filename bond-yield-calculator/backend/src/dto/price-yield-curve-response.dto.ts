import { ApiProperty } from '@nestjs/swagger';

export class PriceYieldPointDto {
  @ApiProperty({ description: 'Annual yield as decimal (0.05 = 5%)' })
  yield!: number;

  @ApiProperty({ description: 'Bond price at this yield' })
  price!: number;
}

export class PriceYieldCurveResponseDto {
  @ApiProperty({ type: [PriceYieldPointDto] })
  curve!: PriceYieldPointDto[];

  @ApiProperty({ description: 'Computed yield to maturity (decimal)' })
  ytm!: number;
}
