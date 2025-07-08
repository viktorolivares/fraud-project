import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemType } from './domain/system-type.entity';
import { SystemTypeService } from './application/system-type.service';
import { SystemTypeController } from './presentation/system-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SystemType])],
  controllers: [SystemTypeController],
  providers: [SystemTypeService],
  exports: [SystemTypeService, TypeOrmModule],
})
export class SystemTypeModule {}
