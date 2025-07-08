import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CaseStateService } from '../application/case-state.service';
import { CaseStateCreateDto } from '../dto/case-state-create.dto';
import { CaseStateUpdateDto } from '../dto/case-state-update.dto';
import { CaseStateResponseDto } from '../dto/case-state-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';

@ApiTags('Case State')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
@Controller('case-states')
export class CaseStateController {
  constructor(private readonly service: CaseStateService) {}

  @Get()
  @Permissions('fraud-investigation.states.view')
  @ApiOperation({ summary: 'Obtener todos los estados de caso' })
  @ApiResponse({ status: 200, type: [CaseStateResponseDto] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('fraud-investigation.states.view')
  @ApiOperation({ summary: 'Obtener un estado por ID' })
  @ApiResponse({ status: 200, type: CaseStateResponseDto })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  @Permissions('fraud-investigation.states.create')
  @ApiOperation({ summary: 'Crear un estado de caso' })
  @ApiResponse({ status: 201, type: CaseStateResponseDto })
  create(@Body() data: CaseStateCreateDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @Permissions('fraud-investigation.states.update')
  @ApiOperation({ summary: 'Actualizar un estado de caso' })
  @ApiResponse({ status: 200, type: CaseStateResponseDto })
  update(@Param('id') id: string, @Body() data: CaseStateUpdateDto) {
    return this.service.update(Number(id), data);
  }

  @Delete(':id')
  @Permissions('fraud-investigation.states.delete')
  @ApiOperation({ summary: 'Eliminar un estado de caso' })
  @ApiResponse({ status: 200, type: CaseStateResponseDto })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
