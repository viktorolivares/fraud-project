import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseIncident } from './domain/case-incident.entity';
import { AuthModule } from '../auth/auth.module';
import { CaseIncidentService } from './application/case-incident.service';
import { CaseIncidentController } from './presentation/case-incident.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CaseIncident]),
    AuthModule
  ],
  controllers: [CaseIncidentController],
  providers: [CaseIncidentService],
  exports: [CaseIncidentService],
})
export class CaseIncidentModule {}
