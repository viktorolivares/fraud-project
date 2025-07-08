import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { getJwtConfig } from '../../config';
import { User } from '../user/domain/user.entity';
import { UserRole } from '../user/domain/user-role.entity';
import { Role } from '../role/domain/role.entity';
import { RolePermission } from '../role/domain/role-permission.entity';
import { Permission } from '../permission/domain/permission.entity';
import { Channel } from '../channel/domain/channel.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, UserRole, Role, RolePermission, Permission, Channel]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getJwtConfig(configService),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule, TypeOrmModule],
})
export class AuthModule {}
