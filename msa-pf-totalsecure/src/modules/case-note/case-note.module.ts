import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseNote } from './domain/case-note.entity';
import { AuthModule } from '../auth/auth.module';
import { CaseNoteService } from './application/case-note.service';
import { CaseNoteController } from './presentation/case-note.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CaseNote]),
    AuthModule
  ],
  controllers: [CaseNoteController],
  providers: [CaseNoteService],
  exports: [CaseNoteService],
})
export class CaseNoteModule {}
