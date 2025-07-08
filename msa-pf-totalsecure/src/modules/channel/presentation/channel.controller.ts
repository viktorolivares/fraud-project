import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChannelService } from '../application/channel.service';
import { ChannelCreateDto } from '../dto/channel-create.dto';
import { ChannelUpdateDto } from '../dto/channel-update.dto';
import { ChannelResponseDto } from '../dto/channel-response.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permissions.decorator';

@ApiTags('Channels')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  /**
   * Obtiene todos los canales activos del sistema
   * 
   * Este endpoint permite listar todos los canales disponibles en el sistema,
   * que son utilizados para categorizar y organizar los casos de fraude.
   * 
   * @returns {Promise<ChannelResponseDto[]>} Lista de todos los canales activos (no eliminados)
   * @throws {UnauthorizedException} Si no se tiene el permiso 'view.channel'
   * @throws {InternalServerErrorException} Si hay un error en la base de datos
   * 
   * @example
   * // Respuesta típica
   * [
   *   {
   *     "id": 1,
   *     "name": "Tarjeta de Crédito",
   *     "description": "Casos de fraude con tarjetas de crédito",
   *     "createdAt": "2024-01-01T00:00:00.000Z",
   *     "updatedAt": "2024-01-01T00:00:00.000Z"
   *   },
   *   {
   *     "id": 2,
   *     "name": "Transferencias",
   *     "description": "Casos de fraude en transferencias bancarias",
   *     "createdAt": "2024-01-01T00:00:00.000Z",
   *     "updatedAt": "2024-01-01T00:00:00.000Z"
   *   }
   * ]
   */
  @Get()
  @Permissions('system-administration.channels.view')
  @ApiOperation({ 
    summary: 'Obtener todos los canales',
    description: 'Obtiene una lista de todos los canales activos del sistema'
  })
  @ApiResponse({ 
    status: 200, 
    type: [ChannelResponseDto],
    description: 'Lista de canales obtenida exitosamente'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token inválido o faltante'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Prohibido - No tiene permisos para ver canales'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Error interno del servidor'
  })
  findAll() {
    return this.channelService.findAll();
  }

  /**
   * Busca un canal específico por su ID
   * 
   * Este endpoint permite obtener información detallada de un canal específico,
   * incluyendo su nombre, descripción y metadatos de creación/actualización.
   * 
   * @param {string} id - ID del canal a buscar
   * @returns {Promise<ChannelResponseDto>} Datos del canal encontrado
   * @throws {UnauthorizedException} Si no se tiene el permiso 'view.channel'
   * @throws {NotFoundException} Si el canal no existe o fue eliminado
   * @throws {BadRequestException} Si el ID no es un número válido
   * @throws {InternalServerErrorException} Si hay un error en la base de datos
   * 
   * @example
   * // GET /channels/1
   * {
   *   "id": 1,
   *   "name": "Tarjeta de Crédito",
   *   "description": "Casos de fraude con tarjetas de crédito",
   *   "createdAt": "2024-01-01T00:00:00.000Z",
   *   "updatedAt": "2024-01-01T00:00:00.000Z"
   * }
   */
  @Get(':id')
  @Permissions('system-administration.channels.view')
  @ApiOperation({ 
    summary: 'Obtener un canal por ID',
    description: 'Obtiene un canal específico por su ID'
  })
  @ApiResponse({ 
    status: 200, 
    type: ChannelResponseDto,
    description: 'Canal obtenido exitosamente'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'ID inválido - Debe ser un número válido'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token inválido o faltante'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Prohibido - No tiene permisos para ver canales'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Canal no encontrado'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Error interno del servidor'
  })
  findOne(@Param('id') id: string) {
    return this.channelService.findOne(Number(id));
  }

  /**
   * Crea un nuevo canal en el sistema
   * 
   * Este endpoint permite crear un nuevo canal que puede ser utilizado
   * para categorizar casos de fraude. Valida que el nombre sea único.
   * 
   * @param {ChannelCreateDto} data - Datos del canal a crear
   * @returns {Promise<ChannelResponseDto>} Datos del canal creado
   * @throws {UnauthorizedException} Si no se tiene el permiso 'create.channel'
   * @throws {BadRequestException} Si hay errores de validación en los datos
   * @throws {ConflictException} Si el nombre del canal ya existe
   * @throws {InternalServerErrorException} Si hay un error en la base de datos
   * 
   * @example
   * // POST /channels
   * // Body:
   * {
   *   "name": "Banca en Línea",
   *   "description": "Casos de fraude en plataformas de banca en línea"
   * }
   * 
   * // Respuesta:
   * {
   *   "id": 3,
   *   "name": "Banca en Línea",
   *   "description": "Casos de fraude en plataformas de banca en línea",
   *   "createdAt": "2024-01-01T00:00:00.000Z",
   *   "updatedAt": "2024-01-01T00:00:00.000Z"
   * }
   */
  @Post()
  @Permissions('system-administration.channels.create')
  @ApiOperation({ 
    summary: 'Crear un canal',
    description: 'Crea un nuevo canal en el sistema'
  })
  @ApiResponse({ 
    status: 201, 
    type: ChannelResponseDto,
    description: 'Canal creado exitosamente'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos - Errores de validación'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token inválido o faltante'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Prohibido - No tiene permisos para crear canales'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflicto - El nombre del canal ya existe'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Error interno del servidor'
  })
  create(@Body() data: ChannelCreateDto) {
    return this.channelService.create(data);
  }

  /**
   * Actualiza los datos de un canal existente
   * 
   * Este endpoint permite actualizar la información de un canal existente,
   * incluyendo su nombre y descripción. Valida que el nuevo nombre no esté duplicado.
   * 
   * @param {string} id - ID del canal a actualizar
   * @param {ChannelUpdateDto} data - Datos actualizados del canal
   * @returns {Promise<ChannelResponseDto>} Datos del canal actualizado
   * @throws {UnauthorizedException} Si no se tiene el permiso 'update.channel'
   * @throws {NotFoundException} Si el canal no existe o fue eliminado
   * @throws {BadRequestException} Si hay errores de validación en los datos
   * @throws {ConflictException} Si el nuevo nombre ya existe en otro canal
   * @throws {InternalServerErrorException} Si hay un error en la base de datos
   * 
   * @example
   * // PATCH /channels/1
   * // Body:
   * {
   *   "name": "Tarjeta de Crédito y Débito",
   *   "description": "Casos de fraude con tarjetas de crédito y débito"
   * }
   * 
   * // Respuesta:
   * {
   *   "id": 1,
   *   "name": "Tarjeta de Crédito y Débito",
   *   "description": "Casos de fraude con tarjetas de crédito y débito",
   *   "createdAt": "2024-01-01T00:00:00.000Z",
   *   "updatedAt": "2024-01-01T12:00:00.000Z"
   * }
   */
  @Patch(':id')
  @Permissions('system-administration.channels.update')
  @ApiOperation({ 
    summary: 'Actualizar un canal',
    description: 'Actualiza los datos de un canal existente'
  })
  @ApiResponse({ 
    status: 200, 
    type: ChannelResponseDto,
    description: 'Canal actualizado exitosamente'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos - Errores de validación'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token inválido o faltante'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Prohibido - No tiene permisos para actualizar canales'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Canal no encontrado'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflicto - El nombre del canal ya existe'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Error interno del servidor'
  })
  update(@Param('id') id: string, @Body() data: ChannelUpdateDto) {
    return this.channelService.update(Number(id), data);
  }

  /**
   * Elimina un canal de forma lógica (soft delete)
   * 
   * Este endpoint realiza un soft delete del canal, manteniéndolo en la base
   * de datos pero marcándolo como eliminado. Los casos asociados a este canal
   * no se verán afectados pero no se podrán crear nuevos casos en este canal.
   * 
   * @param {string} id - ID del canal a eliminar
   * @returns {Promise<ChannelResponseDto>} Datos del canal eliminado
   * @throws {UnauthorizedException} Si no se tiene el permiso 'delete.channel'
   * @throws {NotFoundException} Si el canal no existe o ya fue eliminado
   * @throws {BadRequestException} Si el ID no es un número válido
   * @throws {ConflictException} Si el canal está siendo usado por casos activos
   * @throws {InternalServerErrorException} Si hay un error en la base de datos
   * 
   * @example
   * // DELETE /channels/1
   * {
   *   "id": 1,
   *   "name": "Tarjeta de Crédito",
   *   "description": "Casos de fraude con tarjetas de crédito",
   *   "createdAt": "2024-01-01T00:00:00.000Z",
   *   "updatedAt": "2024-01-01T12:00:00.000Z",
   *   "deletedAt": "2024-01-01T12:30:00.000Z"
   * }
   */
  @Delete(':id')
  @Permissions('system-administration.channels.delete')
  @ApiOperation({ 
    summary: 'Eliminar un canal',
    description: 'Elimina un canal de forma lógica (soft delete)'
  })
  @ApiResponse({ 
    status: 200, 
    type: ChannelResponseDto,
    description: 'Canal eliminado exitosamente'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'ID inválido - Debe ser un número válido'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token inválido o faltante'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Prohibido - No tiene permisos para eliminar canales'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Canal no encontrado'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflicto - El canal está siendo usado por casos activos'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Error interno del servidor'
  })
  remove(@Param('id') id: string) {
    return this.channelService.remove(Number(id));
  }

  /**
   * Restaura un canal previamente eliminado
   * 
   * Este endpoint revierte el soft delete y reactiva el canal,
   * permitiendo que vuelva a ser utilizado para crear nuevos casos.
   * 
   * @param {string} id - ID del canal a restaurar
   * @returns {Promise<ChannelResponseDto>} Datos del canal restaurado
   * @throws {UnauthorizedException} Si no se tiene el permiso 'update.channel'
   * @throws {NotFoundException} Si el canal no existe
   * @throws {BadRequestException} Si el ID no es un número válido o el canal no estaba eliminado
   * @throws {InternalServerErrorException} Si hay un error en la base de datos
   * 
   * @example
   * // PATCH /channels/restore/1
   * {
   *   "id": 1,
   *   "name": "Tarjeta de Crédito",
   *   "description": "Casos de fraude con tarjetas de crédito",
   *   "createdAt": "2024-01-01T00:00:00.000Z",
   *   "updatedAt": "2024-01-01T12:30:00.000Z",
   *   "deletedAt": null
   * }
   */
  @Patch('restore/:id')
  @Permissions('system-administration.channels.update')
  @ApiOperation({ 
    summary: 'Restaurar un canal eliminado',
    description: 'Restaura un canal previamente eliminado'
  })
  @ApiResponse({ 
    status: 200, 
    type: ChannelResponseDto,
    description: 'Canal restaurado exitosamente'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'ID inválido o el canal no estaba eliminado'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token inválido o faltante'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Prohibido - No tiene permisos para restaurar canales'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Canal no encontrado'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Error interno del servidor'
  })
  restore(@Param('id') id: string) {
    return this.channelService.restore(Number(id));
  }
}
