import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionService } from '../application/permission.service';
import { PermissionResponseDto } from '../dto/permission-response.dto';
import { PermissionCreateDto } from '../dto/permission-create.dto';
import { PermissionUpdateDto } from '../dto/permission-update.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';

@ApiTags('Permissions')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * Obtiene todos los permisos del sistema
   * @returns Lista de todos los permisos organizados por módulo
   */
  @Get()
  @Permissions('system-administration.permissions.view')
  @ApiOperation({ summary: 'Obtener todos los permisos' })
  @ApiResponse({ status: 200, type: [PermissionResponseDto] })
  findAll() {
    return this.permissionService.findAll();
  }

  /**
   * Busca un permiso específico por su ID
   * @param id - ID del permiso a buscar
   * @returns Datos del permiso encontrado
   */
  @Get(':id')
  @Permissions('system-administration.permissions.view')
  @ApiOperation({ summary: 'Obtener un permiso por ID' })
  @ApiResponse({ status: 200, type: PermissionResponseDto })
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(Number(id));
  }

  /**
   * Crea un nuevo permiso en el sistema
   * @param data - Datos del permiso a crear (PermissionCreateDto)
   * @returns Datos del permiso creado
   */
  @Post()
  @Permissions('system-administration.permissions.create')
  @ApiOperation({ summary: 'Crear un permiso' })
  @ApiResponse({ status: 201, type: PermissionResponseDto })
  create(@Body() data: PermissionCreateDto) {
    return this.permissionService.create(data);
  }

  /**
   * Actualiza los datos de un permiso existente
   * @param id - ID del permiso a actualizar
   * @param data - Datos actualizados del permiso (PermissionUpdateDto)
   * @returns Datos del permiso actualizado
   */
  @Patch(':id')
  @Permissions('system-administration.permissions.update')
  @ApiOperation({ summary: 'Actualizar un permiso' })
  @ApiResponse({ status: 200, type: PermissionResponseDto })
  update(@Param('id') id: string, @Body() data: PermissionUpdateDto) {
    return this.permissionService.update(Number(id), data);
  }

  /**
   * Elimina un permiso del sistema (soft delete)
   * El permiso se marca como eliminado pero no se borra físicamente
   * @param id - ID del permiso a eliminar
   * @returns Datos del permiso eliminado
   */
  @Delete(':id')
  @Permissions('system-administration.permissions.delete')
  @ApiOperation({ summary: 'Eliminar un permiso' })
  @ApiResponse({ status: 200, type: PermissionResponseDto })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(Number(id));
  }

  /**
   * Restaura un permiso previamente eliminado
   * Revierte el soft delete y reactiva el permiso
   * @param id - ID del permiso a restaurar
   * @returns Datos del permiso restaurado
   */
  @Patch('restore/:id')
  @Permissions('system-administration.permissions.update')
  @ApiOperation({ summary: 'Restaurar un permiso eliminado' })
  @ApiResponse({ status: 200, type: PermissionResponseDto })
  restore(@Param('id') id: string) {
    return this.permissionService.restore(Number(id));
  }
}
