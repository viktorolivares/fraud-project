import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './domain/log.entity';
import { LogService } from './application/log.service';
import { LogController } from './presentation/log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService, TypeOrmModule],
})
export class LogModule {}
