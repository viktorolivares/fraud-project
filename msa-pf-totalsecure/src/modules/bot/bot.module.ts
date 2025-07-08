import { Module } from '@nestjs/common';
import { BotService } from './application/bot.service';
import { BotController } from './presentation/bot.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bot } from './domain/bot.entity';
import { User } from '../user/domain/user.entity';
import { Channel } from '../channel/domain/channel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bot, User, Channel]),
    AuthModule,
  ],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
