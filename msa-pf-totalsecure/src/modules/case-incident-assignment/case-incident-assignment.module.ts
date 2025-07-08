import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseIncidentAssignment } from './domain/case-incident-assignment.entity';
import { AuthModule } from '../auth/auth.module';
import { CaseIncidentAssignmentService } from './application/case-incident-assignment.service';
import { CaseIncidentAssignmentController } from './presentation/case-incident-assignment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CaseIncidentAssignment]),
    AuthModule
  ],
  controllers: [CaseIncidentAssignmentController],
  providers: [CaseIncidentAssignmentService],
  exports: [CaseIncidentAssignmentService],
})
export class CaseIncidentAssignmentModule {}
