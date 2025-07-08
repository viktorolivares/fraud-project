import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './application/dashboard.service';
import { DashboardController } from './presentation/dashboard.controller';
import { AuthModule } from '../auth/auth.module';
import { Case } from '../case/domain/case.entity';
import { CaseIncident } from '../case-incident/domain/case-incident.entity';
import { CaseState } from '../case-state/domain/case-state.entity';
import { BotExecution } from '../bot-execution/domain/bot-execution.entity';
import { Bot } from '../bot/domain/bot.entity';
import { Channel } from '../channel/domain/channel.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Case,
      CaseIncident,
      CaseState,
      BotExecution,
      Bot,
      Channel,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
