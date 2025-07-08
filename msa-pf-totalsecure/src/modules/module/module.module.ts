import { Module } from '@nestjs/common';
import { ModuleService } from './application/module.service';
import { ModuleController } from './presentation/module.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from './domain/module.entity';
import { User } from '../user/domain/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModuleEntity, User]),
    AuthModule,
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModuleModule {}
