import { Controller, Get, Param, UseGuards, Query, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CaseService } from '../application/case.service';
import { CaseResponseDto } from '../dto/case-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ReadOnlyGuard } from '../../../common/guards/read-only.guard';
import { ReadOnly } from '../../../common/decorators/read-only.decorator';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { UpdateCaseDto } from '../dto/update-case.dto';

@ApiTags('Case')
@UseGuards(JwtAuthGuard, ReadOnlyGuard)
@ApiBearerAuth('access-token')
@ReadOnly()
@Controller('cases')
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los casos' })
  @ApiResponse({ status: 200, type: [CaseResponseDto] })
  @ApiQuery({ name: 'fromDate', required: false, description: 'Fecha desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'toDate', required: false, description: 'Fecha hasta (YYYY-MM-DD)' })
  @Permissions('fraud-investigation.cases.view')
  findAll(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string
  ) {
    return this.caseService.findAll(fromDate, toDate);
  }

  @Get('by-execution/:executionId')
  @ApiOperation({ summary: 'Obtener casos por ID de ejecución' })
  @ApiResponse({ status: 200, type: [CaseResponseDto] })
  @ApiQuery({ name: 'fromDate', required: false, description: 'Fecha desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'toDate', required: false, description: 'Fecha hasta (YYYY-MM-DD)' })
  @Permissions('fraud-investigation.cases.view')
  findByExecution(
    @Param('executionId') executionId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string
  ) {
    return this.caseService.findByExecutionId(Number(executionId), fromDate, toDate);
  }

  @Get('by-state/:stateId')
  @ApiOperation({ summary: 'Obtener casos por ID de estado' })
  @ApiResponse({ status: 200, type: [CaseResponseDto] })
  @ApiQuery({ name: 'fromDate', required: false, description: 'Fecha desde (YYYY-MM-DD)' })
  @ApiQuery({ name: 'toDate', required: false, description: 'Fecha hasta (YYYY-MM-DD)' })
  @Permissions('fraud-investigation.cases.view')
  findByState(
    @Param('stateId') stateId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string
  ) {
    return this.caseService.findByStateId(Number(stateId), fromDate, toDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un caso por ID' })
  @ApiResponse({ status: 200, type: CaseResponseDto })
  @Permissions('fraud-investigation.cases.view')
  findOne(@Param('id') id: string) {
    return this.caseService.findOne(Number(id));
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Obtener un caso por ID con detalles completos' })
  @ApiResponse({ status: 200, type: CaseResponseDto })
  @Permissions('fraud-investigation.cases.view')
  findOneWithDetails(@Param('id') id: string) {
    return this.caseService.findOneWithDetails(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar caso' })
  @ApiResponse({ status: 200, type: CaseResponseDto })
  @Permissions('fraud-investigation.cases.update')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCaseDto
  ): Promise<CaseResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.caseService.update(Number(id), dto);
  }
}
