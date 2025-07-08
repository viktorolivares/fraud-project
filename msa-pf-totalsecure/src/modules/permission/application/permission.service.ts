import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../domain/permission.entity';
import { PermissionCreateDto } from '../dto/permission-create.dto';
import { PermissionUpdateDto } from '../dto/permission-update.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission) private permissionRepo: Repository<Permission>,
  ) {}

  async findAll() {
    return this.permissionRepo.find();
  }

  async findOne(id: number) {
    const permission = await this.permissionRepo.findOne({
      where: { id },
    });
    if (!permission) throw new NotFoundException('Permiso no encontrado');
    return permission;
  }

  async create(data: PermissionCreateDto) {
    const permission = this.permissionRepo.create({
      name: data.name,
      description: data.description,
      moduleId: data.moduleId,
    });
    return this.permissionRepo.save(permission);
  }

  async update(id: number, data: PermissionUpdateDto) {
    const permission = await this.permissionRepo.findOneOrFail({ where: { id } });
    Object.assign(permission, data);
    return this.permissionRepo.save(permission);
  }

  async remove(id: number) {
    await this.permissionRepo.delete(id);
    return { deleted: true };
  }

  async restore(id: number) {
    // No implementado ya que no hay soft delete
    return this.permissionRepo.findOne({ where: { id } });
  }
}
