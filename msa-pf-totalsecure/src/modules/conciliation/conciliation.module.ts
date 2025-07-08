import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conciliation } from './domain/conciliation.entity';
import { ConciliationService } from './application/conciliation.service';
import { ConciliationController } from './presentation/conciliation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Conciliation])],
  controllers: [ConciliationController],
  providers: [ConciliationService],
  exports: [ConciliationService, TypeOrmModule],
})
export class ConciliationModule {}
