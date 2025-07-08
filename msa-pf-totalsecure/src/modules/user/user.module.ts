import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './application/user.service';
import { User } from './domain/user.entity';
import { UserRole } from './domain/user-role.entity';
import { Role } from '../role/domain/role.entity';
import { Channel } from '../channel/domain/channel.entity';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, Role, Channel]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, PermissionsGuard],
  exports: [UserService],
})
export class UserModule {}

