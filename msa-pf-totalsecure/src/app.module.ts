// Importaciones de terceros
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule  } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { APP_FILTER } from '@nestjs/core';

// Importaciones de módulos internos
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { getDatabaseConfig, validateConfig } from './config';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { AuthorizationExceptionFilter } from './common/filters/authorization-exception.filter';
import { ReadOnlyGuard } from './common/guards/read-only.guard';

// Importaciones de módulos de dominio (ordenadas por cantidad de caracteres en la ruta)
import { BotModule } from './modules/bot/bot.module';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CaseModule } from './modules/case/case.module';
import { LogModule } from './modules/log/log.module';
import { ReportModule } from './modules/report/report.module';
import { ModuleModule } from './modules/module/module.module';
import { ClientModule } from './modules/client/client.module';
import { ChannelModule } from './modules/channel/channel.module';
import { CaseNoteModule } from './modules/case-note/case-note.module';
import { CaseStateModule } from './modules/case-state/case-state.module';
import { CollectorModule } from './modules/collector/collector.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PermissionModule } from './modules/permission/permission.module';
import { SystemTypeModule } from './modules/system-type/system-type.module';
import { BotExecutionModule } from './modules/bot-execution/bot-execution.module';
import { ConciliationModule } from './modules/conciliation/conciliation.module';
import { CaseIncidentModule } from './modules/case-incident/case-incident.module';
import { CaseAssignmentModule } from './modules/case-assignment/case-assignment.module';
import { ConciliationFileModule } from './modules/conciliation-file/conciliation-file.module';
import { CaseIncidentAssignmentModule } from './modules/case-incident-assignment/case-incident-assignment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      validate: (config) => {
        const configService = new ConfigService(config);
        validateConfig(configService);
        return config;
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),

    // Módulos de infraestructura
    AuthModule,
    UserModule,
    RoleModule,
    ChannelModule,
    ModuleModule,
    PermissionModule,

    // Módulos de dominio
    BotModule,
    CaseModule,
    CaseNoteModule,
    CaseStateModule,
    BotExecutionModule,
    CaseIncidentModule,
    CaseAssignmentModule,
    CaseIncidentAssignmentModule,

    // Nuevos módulos
    ClientModule,
    SystemTypeModule,
    CollectorModule,
    ConciliationModule,
    ConciliationFileModule,
    LogModule,

    // Módulos de reporte y dashboard
    ReportModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ReadOnlyGuard,
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AuthorizationExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    console.log('Data Source has been initialized!', dataSource.isInitialized);
  }
}
