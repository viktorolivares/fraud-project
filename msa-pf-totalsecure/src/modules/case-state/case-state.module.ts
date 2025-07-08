import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseState } from './domain/case-state.entity';
import { AuthModule } from '../auth/auth.module';
import { CaseStateService } from './application/case-state.service';
import { CaseStateController } from './presentation/case-state.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CaseState]),
    AuthModule
  ],
  controllers: [CaseStateController],
  providers: [CaseStateService],
  exports: [CaseStateService],
})
export class CaseStateModule {}
