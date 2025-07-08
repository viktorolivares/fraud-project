import { Module } from '@nestjs/common';
import { BotExecutionService } from './application/bot-execution.service';
import { BotExecutionController } from './presentation/bot-execution.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotExecution } from './domain/bot-execution.entity';
import { User } from '../user/domain/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BotExecution, User]),
    AuthModule,
  ],
  controllers: [BotExecutionController],
  providers: [BotExecutionService],
  exports: [BotExecutionService],
})
export class BotExecutionModule {}
