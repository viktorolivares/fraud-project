import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Role } from '../domain/role.entity';
import { RolePermission } from '../domain/role-permission.entity';
import { Permission } from '../../permission/domain/permission.entity';
import { RoleCreateDto } from '../dto/role-create.dto';
import { RoleUpdateDto } from '../dto/role-update.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(RolePermission) private rolePermissionRepo: Repository<RolePermission>,
    @InjectRepository(Permission) private permissionRepo: Repository<Permission>,
  ) {}

  /**
   * Obtiene todos los roles activos del sistema
   * @returns Lista de roles con sus permisos asociados
   */
  async findAll() {
    return this.roleRepo.find({
      where: { deletedAt: IsNull() },
      relations: ['permissions', 'permissions.permission'],
    });
  }

  /**
   * Busca un rol específico por ID
   * @param id - ID del rol a buscar
   * @returns Rol encontrado con sus permisos
   * @throws NotFoundException si el rol no existe
   */
  async findOne(id: number) {
    const role = await this.roleRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['permissions', 'permissions.permission'],
    });
    if (!role) throw new NotFoundException('Rol no encontrado');
    return role;
  }

  /**
   * Crea un nuevo rol con permisos asignados
   * @param data - Datos del rol a crear
   * @returns Rol creado con permisos asociados
   */
  async create(data: RoleCreateDto) {
    const { permissions, ...rest } = data;

    // Validar que no exista un rol con el mismo nombre
    await this.validateRoleNameNotExists(rest.name);

    // Validar que los permisos existan (si se proporcionan)
    if (permissions && permissions.length > 0) {
      await this.validatePermissionsExist(permissions);
    }

    const role = this.roleRepo.create(rest);
    await this.roleRepo.save(role);

    if (permissions && permissions.length > 0) {
      const rolePermissions = permissions.map(permissionId => 
        this.rolePermissionRepo.create({
          role: { id: role.id },
          permission: { id: permissionId },
        })
      );
      await this.rolePermissionRepo.save(rolePermissions);
    }

    return this.roleRepo.findOne({
      where: { id: role.id },
      relations: ['permissions', 'permissions.permission'],
    });
  }

  /**
   * Actualiza un rol existente
   * @param id - ID del rol a actualizar
   * @param data - Datos actualizados del rol
   * @returns Rol actualizado con permisos
   */
  async update(id: number, data: RoleUpdateDto) {
    const { permissions, ...rest } = data;
    
    // Validar que el rol exista
    const role = await this.roleRepo.findOne({ 
      where: { id, deletedAt: IsNull() } 
    });
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }
    
    // Validar nombre único si se está cambiando
    if (rest.name && rest.name !== role.name) {
      await this.validateRoleNameNotExists(rest.name);
    }
    
    // Validar permisos si se proporcionan
    if (permissions && permissions.length > 0) {
      await this.validatePermissionsExist(permissions);
    }
    
    Object.assign(role, rest);
    await this.roleRepo.save(role);

    if (Array.isArray(permissions)) {
      // Eliminar permisos existentes
      await this.rolePermissionRepo.delete({ role: { id } });
      
      // Crear nuevos permisos
      if (permissions.length > 0) {
        const rolePermissions = permissions.map(permissionId => 
          this.rolePermissionRepo.create({
            role: { id },
            permission: { id: permissionId },
          })
        );
        await this.rolePermissionRepo.save(rolePermissions);
      }
    }

    return this.roleRepo.findOne({
      where: { id },
      relations: ['permissions', 'permissions.permission'],
    });
  }

  /**
   * Elimina un rol de forma lógica (soft delete)
   * @param id - ID del rol a eliminar
   * @returns Rol eliminado
   */
  async remove(id: number) {
    await this.roleRepo.softDelete(id);
    return this.roleRepo.findOne({ where: { id } });
  }

  /**
   * Restaura un rol eliminado
   * @param id - ID del rol a restaurar
   * @returns Rol restaurado
   */
  async restore(id: number) {
    await this.roleRepo.restore(id);
    return this.roleRepo.findOne({ where: { id } });
  }

  /**
   * Obtiene todos los permisos disponibles para asignar a roles
   * @returns Lista de permisos disponibles
   */
  async getAvailablePermissions() {
    return this.permissionRepo.find({
      select: ['id', 'name', 'description', 'moduleId'],
      order: { name: 'ASC' }
    });
  }

  /**
   * Valida que el nombre del rol no exista
   * @param name - Nombre del rol a validar
   * @throws ConflictException si el nombre ya existe
   */
  private async validateRoleNameNotExists(name: string): Promise<void> {
    const existingRole = await this.roleRepo.findOne({ 
      where: { name, deletedAt: IsNull() } 
    });
    if (existingRole) {
      throw new ConflictException('Ya existe un rol con este nombre');
    }
  }

  /**
   * Valida que todos los permisos existan
   * @param permissionIds - IDs de permisos a validar
   * @throws BadRequestException si algún permiso no existe
   */
  private async validatePermissionsExist(permissionIds: number[]): Promise<void> {
    const permissions = await this.permissionRepo.find({
      where: permissionIds.map(id => ({ id }))
    });
    if (permissions.length !== permissionIds.length) {
      const foundIds = permissions.map(p => p.id);
      const missingIds = permissionIds.filter(id => !foundIds.includes(id));
      throw new BadRequestException(`Los siguientes permisos no existen: ${missingIds.join(', ')}`);
    }
  }
}
