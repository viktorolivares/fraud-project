import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collector } from '../domain/collector.entity';
import { CollectorResponseDto } from '../dto/collector-response.dto';
import { CollectorCreateDto } from '../dto/collector-create.dto';

@Injectable()
export class CollectorService {
  constructor(
    @InjectRepository(Collector)
    private collectorRepo: Repository<Collector>,
  ) {}

  private toResponseDto(collector: Collector, includeRelations = false): CollectorResponseDto {
    return {
      id: collector.id,
      name: collector.name,
      createdAt: collector.createdAt.toISOString(),
      createdBy: collector.createdBy,
      updatedAt: collector.updatedAt.toISOString(),
      updatedBy: collector.updatedBy,
      ...(includeRelations && {
        creator: collector.creator ? {
          id: collector.creator.id,
          firstName: collector.creator.firstName,
          lastName: collector.creator.lastName,
          email: collector.creator.email,
        } : undefined,
        updater: collector.updater ? {
          id: collector.updater.id,
          firstName: collector.updater.firstName,
          lastName: collector.updater.lastName,
          email: collector.updater.email,
        } : undefined,
        conciliationsCount: collector.conciliations?.length || 0,
      }),
    };
  }

  async findAll(): Promise<CollectorResponseDto[]> {
    try {
      const collectors = await this.collectorRepo.find({
        relations: ['creator', 'updater', 'conciliations'],
        order: { createdAt: 'DESC' },
      });
      return collectors.map(collector => this.toResponseDto(collector, true));
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<CollectorResponseDto> {
    try {
      const collector = await this.collectorRepo.findOne({
        where: { id },
        relations: ['creator', 'updater', 'conciliations'],
      });
      
      if (!collector) {
        throw new NotFoundException(`Colector con ID ${id} no encontrado`);
      }
      
      return this.toResponseDto(collector, true);
    } catch (error) {
      console.error('Error in findOne:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error interno del servidor');
    }
  }

  async create(createDto: CollectorCreateDto, userId?: number): Promise<CollectorResponseDto> {
    try {
      const collector = this.collectorRepo.create({
        ...createDto,
        createdBy: userId,
        updatedBy: userId,
      });
      
      const savedCollector = await this.collectorRepo.save(collector);
      
      return this.toResponseDto(savedCollector);
    } catch (error) {
      console.error('Error in create:', error);
      throw new Error('Error al crear el colector');
    }
  }

  async update(id: number, updateDto: Partial<CollectorCreateDto>, userId?: number): Promise<CollectorResponseDto> {
    try {
      const collector = await this.collectorRepo.findOne({ where: { id } });
      
      if (!collector) {
        throw new NotFoundException(`Colector con ID ${id} no encontrado`);
      }
      
      Object.assign(collector, updateDto, { updatedBy: userId });
      
      const updatedCollector = await this.collectorRepo.save(collector);
      
      return this.toResponseDto(updatedCollector);
    } catch (error) {
      console.error('Error in update:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error al actualizar el colector');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const collector = await this.collectorRepo.findOne({ where: { id } });
      
      if (!collector) {
        throw new NotFoundException(`Colector con ID ${id} no encontrado`);
      }
      
      await this.collectorRepo.remove(collector);
    } catch (error) {
      console.error('Error in remove:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error al eliminar el colector');
    }
  }
}
