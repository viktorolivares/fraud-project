import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CaseNoteService } from '../application/case-note.service';
import { CaseNoteCreateDto } from '../dto/case-note-create.dto';
import { CaseNoteUpdateDto } from '../dto/case-note-update.dto';
import { CaseNoteResponseDto } from '../dto/case-note-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';

@ApiTags('Case Note')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
@Controller('case-notes')
export class CaseNoteController {
  constructor(private readonly service: CaseNoteService) {}

  @Get()
  @Permissions('fraud-investigation.notes.view')
  @ApiOperation({ summary: 'Obtener todas las notas de caso' })
  @ApiResponse({ status: 200, type: [CaseNoteResponseDto] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('fraud-investigation.notes.view')
  @ApiOperation({ summary: 'Obtener una nota por ID' })
  @ApiResponse({ status: 200, type: CaseNoteResponseDto })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  @Permissions('fraud-investigation.notes.create')
  @ApiOperation({ summary: 'Crear una nota de caso' })
  @ApiResponse({ status: 201, type: CaseNoteResponseDto })
  create(@Body() data: CaseNoteCreateDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @Permissions('fraud-investigation.notes.update')
  @ApiOperation({ summary: 'Actualizar una nota de caso' })
  @ApiResponse({ status: 200, type: CaseNoteResponseDto })
  update(@Param('id') id: string, @Body() data: CaseNoteUpdateDto) {
    return this.service.update(Number(id), data);
  }

  @Delete(':id')
  @Permissions('fraud-investigation.notes.delete')
  @ApiOperation({ summary: 'Eliminar una nota de caso' })
  @ApiResponse({ status: 200, type: CaseNoteResponseDto })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
