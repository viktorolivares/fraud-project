import { Module } from '@nestjs/common';
import { ReportService } from './application/report.service';
import { ReportController } from './presentation/report.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
