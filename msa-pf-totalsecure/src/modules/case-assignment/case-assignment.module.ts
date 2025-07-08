import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseAssignment } from './domain/case-assignment.entity';
import { AuthModule } from '../auth/auth.module';
import { CaseAssignmentService } from './application/case-assignment.service';
import { CaseAssignmentController } from './presentation/case-assignment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CaseAssignment]),
    AuthModule
  ],
  controllers: [CaseAssignmentController],
  providers: [CaseAssignmentService],
  exports: [CaseAssignmentService],
})
export class CaseAssignmentModule {}
