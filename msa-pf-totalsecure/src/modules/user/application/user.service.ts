import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../domain/user.entity';
import { UserRole } from '../domain/user-role.entity';
import { Channel } from '../../channel/domain/channel.entity';
import { Role } from '../../role/domain/role.entity';

import { UserCreateDto } from '../dto/user-create.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserUpdateDto } from '../dto/user-update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserRole) private userRoleRepo: Repository<UserRole>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {
     console.log('✅ Repositories inyectados correctamente');
  }

  /**
   * Convierte una entidad User a UserResponseDto
   * @param user - Entidad User a convertir
   * @returns UserResponseDto con los datos formateados
   */
  private toResponseDto(user: User): UserResponseDto {
    const mainRole = user.roles?.[0]?.role;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage ?? undefined,
      isActive: user.isActive,
      darkMode: user.darkMode,
      channelId: user.channelId ?? undefined,
      expirationPassword: user.expirationPassword ?? undefined,
      flagPassword: user.flagPassword,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? undefined,
      role: mainRole?.name ?? undefined,
      roleId: mainRole?.id ?? undefined,
      channel: user.channel?.name ?? undefined,
    };
  }

  /**
   * Obtiene todos los usuarios activos (no eliminados)
   * @returns Array de UserResponseDto con todos los usuarios activos
   */
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find({
      where: { deletedAt: IsNull() },
      relations: ['roles', 'roles.role', 'channel'],
    });
    return users.map(user => this.toResponseDto(user));
  }

  /**
   * Busca un usuario por ID
   * @param id - ID del usuario a buscar
   * @returns UserResponseDto del usuario encontrado
   * @throws NotFoundException si el usuario no existe
   */
  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['roles', 'roles.role', 'channel'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.toResponseDto(user);
  }

  /**
   * Crea un nuevo usuario con rol asignado
   * @param dto - Datos del usuario a crear (UserCreateDto)
   * @returns UserResponseDto del usuario creado
   */
  async create(dto: UserCreateDto): Promise<UserResponseDto> {
    const { roleId, channelId, ...userData } = dto;

    // Validar que no exista el email
    await this.validateEmailNotExists(userData.email);
    
    // Validar que no exista el username
    await this.validateUsernameNotExists(userData.username);
    
    // Validar que el rol exista
    await this.validateRoleExists(roleId);
    
    // Validar que el canal exista (si se proporciona)
    if (channelId) {
      await this.validateChannelExists(channelId);
    }

    // Calcular fecha de expiración: 6 meses después de la fecha de creación
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 6);

    const user = await this.userRepo.save({
      ...userData,
      password: await bcrypt.hash(userData.password, 10),
      channel: channelId ? ({ id: channelId } as Channel) : null,
      flagPassword: true,
      expirationPassword: expirationDate
    });

    const userRole = this.userRoleRepo.create({
      user,
      role: { id: roleId } as Role

    });
    await this.userRoleRepo.save(userRole);

    const result = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['roles', 'roles.role', 'channel'],
    });

    return this.toResponseDto(result!);
  }

  /**
   * Actualiza los datos de un usuario existente
   * @param id - ID del usuario a actualizar
   * @param dto - Datos actualizados del usuario (UserUpdateDto)
   * @returns UserResponseDto del usuario actualizado
   */
  async update(id: number, dto: UserUpdateDto): Promise<UserResponseDto> {
    const { roleId, channelId, ...userData } = dto;

    const user = await this.userRepo.findOneOrFail({ where: { id } });

    Object.assign(user, userData);

    if (userData.password) {
      user.password = await bcrypt.hash(userData.password, 10);
    }

    if (channelId !== undefined) {
      user.channel = channelId ? { id: channelId } as Channel : null;
    }

    await this.userRepo.save(user);

    if (roleId) {
      await this.userRoleRepo.delete({ user: { id } });
      await this.userRoleRepo.save(this.userRoleRepo.create({
        user: { id } as User,
        role: { id: roleId } as Role,
      }));
    }

    const updated = await this.userRepo.findOne({
      where: { id },
      relations: ['roles', 'roles.role', 'channel'],
    });

    return this.toResponseDto(updated!);
  }

  /**
   * Elimina un usuario de forma lógica (soft delete)
   * Establece deletedAt con la fecha actual y marca isActive como false
   * @param id - ID del usuario a eliminar
   * @returns UserResponseDto del usuario eliminado
   */
  async remove(id: number): Promise<UserResponseDto> {
    await this.userRepo.findOneOrFail({ where: { id } });
    await this.userRepo.softDelete(id);
    await this.userRepo.update(id, { isActive: false });

    const deletedUser = await this.userRepo.findOne({
      where: { id },
      relations: ['roles', 'roles.role', 'channel'],
      withDeleted: true 
    });
    
    return this.toResponseDto(deletedUser!);
  }

  /**
   * Restaura un usuario eliminado lógicamente
   * Establece deletedAt como null y marca isActive como true
   * @param id - ID del usuario a restaurar
   * @returns UserResponseDto del usuario restaurado
   */
  async restore(id: number): Promise<UserResponseDto> {
    await this.userRepo.findOneOrFail({ 
      where: { id }, 
      withDeleted: true 
    });

    await this.userRepo.restore(id);
    await this.userRepo.update(id, { isActive: true });
    const restoredUser = await this.userRepo.findOne({
      where: { id },
      relations: ['roles', 'roles.role', 'channel'],
    });
    
    return this.toResponseDto(restoredUser!);
  }

  /**
   * Valida que un email no exista en el sistema
   * @param email - Email a validar
   * @throws ConflictException si el email ya existe
   */
  private async validateEmailNotExists(email: string): Promise<void> {
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado en el sistema');
    }
  }

  /**
   * Valida que un username no exista en el sistema
   * @param username - Username a validar
   * @throws ConflictException si el username ya existe
   */
  private async validateUsernameNotExists(username: string): Promise<void> {
    const existingUser = await this.userRepo.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }
  }

  /**
   * Valida que un rol exista en el sistema
   * @param roleId - ID del rol a validar
   * @throws BadRequestException si el rol no existe
   */
  private async validateRoleExists(roleId: number): Promise<void> {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) {
      throw new BadRequestException('El rol especificado no existe');
    }
  }

  /**
   * Valida que un canal exista en el sistema
   * @param channelId - ID del canal a validar
   * @throws BadRequestException si el canal no existe
   */
  private async validateChannelExists(channelId: number): Promise<void> {
    const channel = await this.userRepo.manager.findOne('Channel', { where: { id: channelId } });
    if (!channel) {
      throw new BadRequestException('El canal especificado no existe');
    }
  }
}