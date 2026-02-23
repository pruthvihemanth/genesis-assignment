import { ApiProperty } from '@nestjs/swagger';

export class CashFlowResponseDto {
  @ApiProperty() period!: number;
  @ApiProperty() paymentDate!: string;
  @ApiProperty() couponPayment!: number;
  @ApiProperty() cumulativeInterest!: number;
  @ApiProperty() remainingPrincipal!: number;
}

export class BondCalculationResponseDto {
  @ApiProperty({ description: 'Current yield (decimal)' })
  currentYield!: number;

  @ApiProperty({ description: 'Yield to maturity annual (decimal)' })
  ytm!: number;

  @ApiProperty({ description: 'Total interest over life of bond' })
  totalInterest!: number;

  @ApiProperty({ enum: ['premium', 'discount', 'par'] })
  premiumOrDiscount!: 'premium' | 'discount' | 'par';

  @ApiProperty({ type: [CashFlowResponseDto] })
  cashFlows!: CashFlowResponseDto[];
}
