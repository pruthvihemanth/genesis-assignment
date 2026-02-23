import { Module } from '@nestjs/common';
import { BondsModule } from './bonds/bonds.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [BondsModule, HealthModule],
})
export class AppModule {}
