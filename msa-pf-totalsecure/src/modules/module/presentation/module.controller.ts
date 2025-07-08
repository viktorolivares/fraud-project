import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ModuleService } from '../application/module.service';
import { ModuleCreateDto } from '../dto/module-create.dto';
import { ModuleUpdateDto } from '../dto/module-update.dto';
import { ModuleResponseDto } from '../dto/module-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';

@ApiTags('Module')
@Controller('modules')
export class ModuleController {
  constructor(private readonly service: ModuleService) {}

  /**
   * Obtiene todos los módulos del sistema (público)
   * @returns Lista de todos los módulos para uso público
   */
  @Get('public')
  @ApiOperation({ summary: 'Obtener todos los módulos (público)' })
  @ApiResponse({ status: 200, type: [ModuleResponseDto] })
  findAllPublic() {
    return this.service.findAll();
  }

  /**
   * Obtiene todos los módulos del sistema
   * @returns Lista de todos los módulos con sus permisos asociados
   */
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth('access-token')
  @Permissions('system-administration.modules.view')
  @ApiOperation({ summary: 'Obtener todos los módulos' })
  @ApiResponse({ status: 200, type: [ModuleResponseDto] })
  findAll() {
    return this.service.findAll();
  }

  /**
   * Busca un módulo específico por su ID
   * @param id - ID del módulo a buscar
   * @returns Datos del módulo encontrado con sus permisos
   */
  @Get(':id')
  @Permissions('system-administration.modules.view')
  @ApiOperation({ summary: 'Obtener un módulo por ID' })
  @ApiResponse({ status: 200, type: ModuleResponseDto })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  /**
   * Crea un nuevo módulo en el sistema
   * @param data - Datos del módulo a crear (ModuleCreateDto)
   * @returns Datos del módulo creado
   */
  @Post()
  @Permissions('system-administration.modules.create')
  @ApiOperation({ summary: 'Crear un módulo' })
  @ApiResponse({ status: 201, type: ModuleResponseDto })
  create(@Body() data: ModuleCreateDto) {
    return this.service.create(data);
  }

  /**
   * Actualiza los datos de un módulo existente
   * @param id - ID del módulo a actualizar
   * @param data - Datos actualizados del módulo (ModuleUpdateDto)
   * @returns Datos del módulo actualizado
   */
  @Patch(':id')
  @Permissions('system-administration.modules.update')
  @ApiOperation({ summary: 'Actualizar un módulo' })
  @ApiResponse({ status: 200, type: ModuleResponseDto })
  update(@Param('id') id: string, @Body() data: ModuleUpdateDto) {
    return this.service.update(Number(id), data);
  }

  /**
   * Elimina un módulo del sistema (soft delete)
   * El módulo se marca como eliminado pero no se borra físicamente
   * @param id - ID del módulo a eliminar
   * @returns Datos del módulo eliminado
   */
  @Delete(':id')
  @Permissions('system-administration.modules.delete')
  @ApiOperation({ summary: 'Eliminar un módulo' })
  @ApiResponse({ status: 200, type: ModuleResponseDto })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }

  /**
   * Restaura un módulo previamente eliminado
   * Revierte el soft delete y reactiva el módulo
   * @param id - ID del módulo a restaurar
   * @returns Datos del módulo restaurado
   */
  @Patch('restore/:id')
  @Permissions('system-administration.modules.update')
  @ApiOperation({ summary: 'Restaurar un módulo eliminado' })
  @ApiResponse({ status: 200, type: ModuleResponseDto })
  restore(@Param('id') id: string) {
    return this.service.restore(Number(id));
  }
}
