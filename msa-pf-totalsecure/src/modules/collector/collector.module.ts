import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collector } from './domain/collector.entity';
import { CollectorService } from './application/collector.service';
import { CollectorController } from './presentation/collector.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Collector])],
  controllers: [CollectorController],
  providers: [CollectorService],
  exports: [CollectorService, TypeOrmModule],
})
export class CollectorModule {}
