import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@common/decorators/permissions.decorator';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserService } from '../application/user.service';

@ApiTags('User')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  /**
   * Obtiene todos los usuarios activos del sistema
   * @returns Lista de todos los usuarios activos (no eliminados)
   */
  @Get()
  @Permissions('system-administration.users.view')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  findAll() {
    return this.service.findAll();
  }

  /**
   * Busca un usuario específico por su ID
   * @param id - ID del usuario a buscar
   * @returns Datos del usuario encontrado
   */
  @Get(':id')
  @Permissions('system-administration.users.view')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  /**
   * Crea un nuevo usuario en el sistema
   * @param data - Datos del usuario a crear (UserCreateDto)
   * @returns Datos del usuario creado con rol asignado
   */
  @Post()
  @Permissions('system-administration.users.create')
  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  create(@Body() data: UserCreateDto) {
    return this.service.create(data);
  }

  /**
   * Actualiza los datos de un usuario existente
   * @param id - ID del usuario a actualizar
   * @param data - Datos actualizados del usuario (UserUpdateDto)
   * @returns Datos del usuario actualizado
   */
  @Patch(':id')
  @Permissions('system-administration.users.update')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  update(@Param('id') id: string, @Body() data: UserUpdateDto) {
    return this.service.update(Number(id), data);
  }

  /**
   * Elimina un usuario de forma lógica (soft delete)
   * El usuario se marca como eliminado pero no se borra físicamente
   * @param id - ID del usuario a eliminar
   * @returns Datos del usuario eliminado
   */
  @Delete(':id')
  @Permissions('system-administration.users.delete')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }

  /**
   * Restaura un usuario previamente eliminado
   * Revierte el soft delete y reactiva el usuario
   * @param id - ID del usuario a restaurar
   * @returns Datos del usuario restaurado
   */
  @Patch('restore/:id')
  @Permissions('system-administration.users.update')
  @ApiOperation({ summary: 'Restaurar un usuario eliminado' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  restore(@Param('id') id: string) {
    return this.service.restore(Number(id));
  }
}
