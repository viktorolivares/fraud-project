import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConciliationFile } from './domain/conciliation-file.entity';
import { ConciliationFileService } from './application/conciliation-file.service';
import { ConciliationFileController } from './presentation/conciliation-file.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConciliationFile])],
  controllers: [ConciliationFileController],
  providers: [ConciliationFileService],
  exports: [ConciliationFileService, TypeOrmModule],
})
export class ConciliationFileModule {}
