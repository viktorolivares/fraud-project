import { Module } from '@nestjs/common';
import { PermissionService } from './application/permission.service';
import { PermissionController } from './presentation/permission.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './domain/permission.entity';
import { User } from '../user/domain/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, User]),
    AuthModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
