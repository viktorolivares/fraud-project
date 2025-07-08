import { Module } from '@nestjs/common';
import { ChannelService } from './application/channel.service';
import { ChannelController } from './presentation/channel.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './domain/channel.entity';
import { User } from '../user/domain/user.entity';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User]),
    AuthModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService, PermissionsGuard],
  exports: [ChannelService],
})
export class ChannelModule {}
