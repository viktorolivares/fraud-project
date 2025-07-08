import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Module } from '../domain/module.entity';
import { ModuleCreateDto } from '../dto/module-create.dto';
import { ModuleUpdateDto } from '../dto/module-update.dto';
import { ModuleResponseDto } from '../dto/module-response.dto';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Module) private moduleRepo: Repository<Module>,
  ) {}

  private toResponseDto(module: Module): ModuleResponseDto {
    return {
      id: module.id,
      name: module.name,
      description: module.description ?? undefined,
      createdAt: module.createdAt,
      updatedAt: module.updatedAt,
    };
  }

  async findAll(): Promise<ModuleResponseDto[]> {
    try {
      const modules = await this.moduleRepo.find({
        where: { deletedAt: IsNull() },
      });
      return modules.map(module => this.toResponseDto(module));
    } catch {
      throw new InternalServerErrorException('Error al obtener los módulos');
    }
  }

  async findOne(id: number): Promise<ModuleResponseDto> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException('El ID debe ser un número válido');
      }

      const module = await this.moduleRepo.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!module) {
        throw new NotFoundException('Módulo no encontrado');
      }

      return this.toResponseDto(module);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el módulo');
    }
  }

  async create(data: ModuleCreateDto): Promise<ModuleResponseDto> {
    try {
      // Validar que el nombre no exista
      const existingModule = await this.moduleRepo.findOne({
        where: { name: data.name },
      });

      if (existingModule) {
        throw new ConflictException('Ya existe un módulo con este nombre');
      }

      const module = this.moduleRepo.create(data);
      await this.moduleRepo.save(module);
      return this.toResponseDto(module);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el módulo');
    }
  }

  async update(id: number, data: ModuleUpdateDto): Promise<ModuleResponseDto> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException('El ID debe ser un número válido');
      }

      const module = await this.moduleRepo.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!module) {
        throw new NotFoundException('Módulo no encontrado');
      }

      // Validar que el nombre no exista en otro módulo
      if (data.name && data.name !== module.name) {
        const existingModule = await this.moduleRepo.findOne({
          where: { name: data.name },
        });

        if (existingModule) {
          throw new ConflictException('Ya existe un módulo con este nombre');
        }
      }

      Object.assign(module, data);
      await this.moduleRepo.save(module);
      return this.toResponseDto(module);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el módulo');
    }
  }

  async remove(id: number): Promise<ModuleResponseDto> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException('El ID debe ser un número válido');
      }

      const module = await this.moduleRepo.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!module) {
        throw new NotFoundException('Módulo no encontrado');
      }

      await this.moduleRepo.softDelete(id);
      module.deletedAt = new Date();
      return this.toResponseDto(module);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar el módulo');
    }
  }

  async restore(id: number): Promise<ModuleResponseDto> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException('El ID debe ser un número válido');
      }

      // Verificar que el módulo existe y está eliminado
      const module = await this.moduleRepo.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!module) {
        throw new NotFoundException('Módulo no encontrado');
      }

      if (!module.deletedAt) {
        throw new BadRequestException('El módulo no está eliminado');
      }

      await this.moduleRepo.restore(id);
      const restoredModule = await this.moduleRepo.findOne({
        where: { id },
      });

      if (!restoredModule) {
        throw new InternalServerErrorException('Error al restaurar el módulo');
      }

      return this.toResponseDto(restoredModule);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al restaurar el módulo');
    }
  }
}
