import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Case } from './domain/case.entity';
import { CaseService } from './application/case.service';
import { CaseController } from './presentation/case.controller';
import { AuthModule } from '../auth/auth.module';
import { BotExecution } from '../bot-execution/domain/bot-execution.entity';
import { CaseState } from '../case-state/domain/case-state.entity';
import { User } from '../user/domain/user.entity';
import { CaseIncident } from '../case-incident/domain/case-incident.entity';
import { CaseNote } from '../case-note/domain/case-note.entity';
import { CaseAssignment } from '../case-assignment/domain/case-assignment.entity';
import { Client } from '../client/domain/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Case,
      BotExecution,
      CaseState,
      User,
      CaseIncident,
      CaseNote,
      CaseAssignment,
      Client
    ]),
    AuthModule
  ],
  controllers: [CaseController],
  providers: [CaseService],
  exports: [CaseService],
})
export class CaseModule {}
