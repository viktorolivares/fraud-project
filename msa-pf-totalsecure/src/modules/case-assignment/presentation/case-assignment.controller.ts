import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CaseAssignmentService } from '../application/case-assignment.service';
import { CaseAssignmentCreateDto } from '../dto/case-assignment-create.dto';
import { CaseAssignmentUpdateDto } from '../dto/case-assignment-update.dto';
import { CaseAssignmentResponseDto } from '../dto/case-assignment-response.dto';
import { BulkAssignCasesDto } from '../dto/bulk-assign-cases.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';

@ApiTags('Case Assignment')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
@Controller('case-assignments')
export class CaseAssignmentController {
  constructor(private readonly service: CaseAssignmentService) {}

  @Get()
  @Permissions('fraud-investigation.assignments.view')
  @ApiOperation({ summary: 'Obtener todas las asignaciones de casos' })
  @ApiResponse({ status: 200, type: [CaseAssignmentResponseDto] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('fraud-investigation.assignments.view')
  @ApiOperation({ summary: 'Obtener una asignación por ID' })
  @ApiResponse({ status: 200, type: CaseAssignmentResponseDto })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  @Permissions('fraud-investigation.assignments.create')
  @ApiOperation({ summary: 'Crear una asignación de caso' })
  @ApiResponse({ status: 201, type: CaseAssignmentResponseDto })
  create(@Body() data: CaseAssignmentCreateDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @Permissions('fraud-investigation.assignments.update')
  @ApiOperation({ summary: 'Actualizar una asignación de caso' })
  @ApiResponse({ status: 200, type: CaseAssignmentResponseDto })
  update(@Param('id') id: string, @Body() data: CaseAssignmentUpdateDto) {
    return this.service.update(Number(id), data);
  }

  @Delete(':id')
  @Permissions('fraud-investigation.assignments.delete')
  @ApiOperation({ summary: 'Eliminar una asignación de caso' })
  @ApiResponse({ status: 200, type: CaseAssignmentResponseDto })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }

  // Rutas adicionales
  @Get('analyst/:analystId')
  @Permissions('fraud-investigation.assignments.view')
  @ApiOperation({ summary: 'Obtener asignaciones por analista' })
  @ApiResponse({ status: 200, type: [CaseAssignmentResponseDto] })
  findByAnalyst(@Param('analystId') analystId: string) {
    return this.service.findByAnalyst(Number(analystId));
  }

  @Get('case/:caseId')
  @Permissions('fraud-investigation.assignments.view')
  @ApiOperation({ summary: 'Obtener asignaciones por caso' })
  @ApiResponse({ status: 200, type: [CaseAssignmentResponseDto] })
  findByCase(@Param('caseId') caseId: string) {
    return this.service.findByCase(Number(caseId));
  }

  @Get('active')
  @Permissions('fraud-investigation.assignments.view')
  @ApiOperation({ summary: 'Obtener asignaciones activas' })
  @ApiResponse({ status: 200, type: [CaseAssignmentResponseDto] })
  findActive() {
    return this.service.findActive();
  }

  @Patch(':id/deactivate')
  @Permissions('fraud-investigation.assignments.update')
  @ApiOperation({ summary: 'Desactivar una asignación de caso' })
  @ApiResponse({ status: 200, type: CaseAssignmentResponseDto })
  deactivate(@Param('id') id: string) {
    return this.service.deactivate(Number(id));
  }

  @Post('bulk-assign')
  @Permissions('fraud-investigation.assignments.create')
  @ApiOperation({ summary: 'Asignación masiva de casos a un analista' })
  @ApiResponse({ status: 201, type: [CaseAssignmentResponseDto] })
  bulkAssign(@Body() data: BulkAssignCasesDto) {
    return this.service.bulkAssign(data.caseIds, data.analystId, data.reason);
  }
}
