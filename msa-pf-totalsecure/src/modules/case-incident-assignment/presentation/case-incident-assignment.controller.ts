import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CaseIncidentAssignmentService } from '../application/case-incident-assignment.service';
import { CaseIncidentAssignmentCreateDto } from '../dto/case-incident-assignment-create.dto';
import { CaseIncidentAssignmentUpdateDto } from '../dto/case-incident-assignment-update.dto';
import { CaseIncidentAssignmentResponseDto } from '../dto/case-incident-assignment-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';

@ApiTags('Case Incident Assignment')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
@Controller('case-incident-assignments')
export class CaseIncidentAssignmentController {
  constructor(private readonly service: CaseIncidentAssignmentService) {}

  @Get()
  @Permissions('fraud-investigation.incident-assignments.view')
  @ApiOperation({ summary: 'Obtener todas las asignaciones de incidentes de caso' })
  @ApiResponse({ status: 200, type: [CaseIncidentAssignmentResponseDto] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('fraud-investigation.incident-assignments.view')
  @ApiOperation({ summary: 'Obtener una asignación por ID' })
  @ApiResponse({ status: 200, type: CaseIncidentAssignmentResponseDto })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  @Permissions('fraud-investigation.incident-assignments.create')
  @ApiOperation({ summary: 'Crear una asignación de incidente de caso' })
  @ApiResponse({ status: 201, type: CaseIncidentAssignmentResponseDto })
  create(@Body() data: CaseIncidentAssignmentCreateDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @Permissions('fraud-investigation.incident-assignments.update')
  @ApiOperation({ summary: 'Actualizar una asignación de incidente de caso' })
  @ApiResponse({ status: 200, type: CaseIncidentAssignmentResponseDto })
  update(@Param('id') id: string, @Body() data: CaseIncidentAssignmentUpdateDto) {
    return this.service.update(Number(id), data);
  }

  @Delete(':id')
  @Permissions('fraud-investigation.incident-assignments.delete')
  @ApiOperation({ summary: 'Eliminar una asignación de incidente de caso' })
  @ApiResponse({ status: 200, type: CaseIncidentAssignmentResponseDto })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
