import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CaseIncidentService } from '../application/case-incident.service';
import { CaseIncidentResponseDto } from '../dto/case-incident-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ReadOnlyGuard } from '../../../common/guards/read-only.guard';
import { ReadOnly } from '../../../common/decorators/read-only.decorator';
import { Permissions } from '../../../common/decorators/permissions.decorator';

@ApiTags('Case Incident')
@UseGuards(JwtAuthGuard, ReadOnlyGuard)
@ApiBearerAuth('access-token')
@ReadOnly()
@Controller('case-incidents')
export class CaseIncidentController {
  constructor(private readonly service: CaseIncidentService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los incidentes de casos (último día por defecto)' })
  @ApiResponse({ status: 200, type: [CaseIncidentResponseDto] })
  @ApiQuery({ name: 'fromDate', required: false, description: 'Fecha desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'toDate', required: false, description: 'Fecha hasta (YYYY-MM-DD)' })
  @Permissions('fraud-investigation.incidents.view')
  findAll(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string
  ) {
    return this.service.findAll(fromDate, toDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un incidente por ID' })
  @ApiResponse({ status: 200, type: CaseIncidentResponseDto })
  @Permissions('fraud-investigation.incidents.view')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Get('case/:caseId')
  @ApiOperation({ summary: 'Obtener incidentes por ID de caso' })
  @ApiResponse({ status: 200, type: [CaseIncidentResponseDto] })
  @ApiQuery({ name: 'fromDate', required: false, description: 'Fecha desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'toDate', required: false, description: 'Fecha hasta (YYYY-MM-DD)' })
  @Permissions('fraud-investigation.incidents.view')
  findByCase(
    @Param('caseId') caseId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string
  ) {
    return this.service.findByCase(Number(caseId), fromDate, toDate);
  }
}
