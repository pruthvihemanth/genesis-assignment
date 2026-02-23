import { Module } from '@nestjs/common';
import { BondsController } from './bonds.controller';
import { BondsService } from './bonds.service';
import { CashFlowGenerator } from './cash-flow-generator';
import { YtmSolver } from './ytm-solver';

@Module({
  controllers: [BondsController],
  providers: [BondsService, CashFlowGenerator, YtmSolver],
})
export class BondsModule {}
