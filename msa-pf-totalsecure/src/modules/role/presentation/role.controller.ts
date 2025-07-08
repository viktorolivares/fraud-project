import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleService } from '../application/role.service';
import { RoleResponseDto } from '../dto/role-response.dto';
import { RoleCreateDto } from '../dto/role-create.dto';
import { RoleUpdateDto } from '../dto/role-update.dto';
import { RolePermissionResponseDto } from '../dto/role-permission-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';

@ApiTags('Roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Obtiene todos los roles del sistema
   * @returns Lista de todos los roles con sus permisos asociados
   */
  @Get()
  @Permissions('system-administration.roles.view')
  @ApiOperation({ summary: 'Obtener todos los roles' })
  @ApiResponse({ status: 200, type: [RoleResponseDto] })
  findAll() {
    return this.roleService.findAll();
  }

  /**
   * Busca un rol específico por su ID
   * @param id - ID del rol a buscar
   * @returns Datos del rol encontrado con sus permisos
   */
  @Get(':id')
  @Permissions('system-administration.roles.view')
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiResponse({ status: 200, type: RoleResponseDto })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(Number(id));
  }

  /**
   * Crea un nuevo rol en el sistema
   * @param data - Datos del rol a crear (RoleCreateDto)
   * @returns Datos del rol creado con permisos asignados
   */
  @Post()
  @Permissions('system-administration.roles.create')
  @ApiOperation({ summary: 'Crear un rol' })
  @ApiResponse({ status: 201, type: RoleResponseDto })
  create(@Body() data: RoleCreateDto) {
    return this.roleService.create(data);
  }

  /**
   * Actualiza los datos de un rol existente
   * @param id - ID del rol a actualizar
   * @param data - Datos actualizados del rol (RoleUpdateDto)
   * @returns Datos del rol actualizado
   */
  @Patch(':id')
  @Permissions('system-administration.roles.update')
  @ApiOperation({ summary: 'Actualizar un rol' })
  @ApiResponse({ status: 200, type: RoleResponseDto })
  update(@Param('id') id: string, @Body() data: RoleUpdateDto) {
    return this.roleService.update(Number(id), data);
  }

  /**
   * Elimina un rol del sistema (soft delete)
   * El rol se marca como eliminado pero no se borra físicamente
   * @param id - ID del rol a eliminar
   * @returns Datos del rol eliminado
   */
  @Delete(':id')
  @Permissions('system-administration.roles.delete')
  @ApiOperation({ summary: 'Eliminar un rol' })
  @ApiResponse({ status: 200, type: RoleResponseDto })
  remove(@Param('id') id: string) {
    return this.roleService.remove(Number(id));
  }

  /**
   * Restaura un rol previamente eliminado
   * Revierte el soft delete y reactiva el rol
   * @param id - ID del rol a restaurar
   * @returns Datos del rol restaurado
   */
  @Patch('restore/:id')
  @Permissions('system-administration.roles.update')
  @ApiOperation({ summary: 'Restaurar un rol eliminado' })
  @ApiResponse({ status: 200, type: RoleResponseDto })
  restore(@Param('id') id: string) {
    return this.roleService.restore(Number(id));
  }

  /**
   * Obtiene todos los permisos disponibles para asignar a roles
   * @returns Lista de permisos disponibles
   */
  @Get('permissions/available')
  @Permissions('system-administration.permissions.view')
  @ApiOperation({ summary: 'Obtener permisos disponibles para asignar a roles' })
  @ApiResponse({ status: 200, type: [RolePermissionResponseDto], description: 'Lista de permisos disponibles' })
  getAvailablePermissions() {
    return this.roleService.getAvailablePermissions();
  }
}
