import { Module } from '@nestjs/common';
import { RoleService } from './application/role.service';
import { RoleController } from './presentation/role.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './domain/role.entity';
import { RolePermission } from './domain/role-permission.entity';
import { UserRole } from '../user/domain/user-role.entity';
import { User } from '../user/domain/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RolePermission, UserRole, User]),
    AuthModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
