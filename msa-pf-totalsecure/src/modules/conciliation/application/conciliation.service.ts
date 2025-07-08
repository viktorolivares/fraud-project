import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conciliation } from '../domain/conciliation.entity';
import { ConciliationResponseDto } from '../dto/conciliation-response.dto';
import { ConciliationCreateDto } from '../dto/conciliation-create.dto';

@Injectable()
export class ConciliationService {
  constructor(
    @InjectRepository(Conciliation)
    private conciliationRepo: Repository<Conciliation>,
  ) {}

  private toResponseDto(conciliation: Conciliation, includeRelations = false): ConciliationResponseDto {
    return {
      id: conciliation.id,
      collectorId: conciliation.collectorId,
      conciliationType: conciliation.conciliationType,
      period: conciliation.period,
      amount: Number(conciliation.amount),
      amountCollector: Number(conciliation.amountCollector),
      differenceAmounts: Number(conciliation.differenceAmounts),
      conciliationState: conciliation.conciliationState,
      createdAt: conciliation.createdAt.toISOString(),
      createdBy: conciliation.createdBy,
      ...(includeRelations && {
        collector: conciliation.collector ? {
          id: conciliation.collector.id,
          name: conciliation.collector.name,
        } : undefined,
        creator: conciliation.creator ? {
          id: conciliation.creator.id,
          firstName: conciliation.creator.firstName,
          lastName: conciliation.creator.lastName,
          email: conciliation.creator.email,
        } : undefined,
        files: conciliation.files?.map(file => ({
          id: file.id,
          conciliationId: file.conciliationId,
          conciliationFileType: file.conciliationFileType,
          filePath: file.filePath,
          fileName: file.fileName,
          fileExtension: file.fileExtension,
          fileType: file.fileType,
          createdAt: file.createdAt.toISOString(),
          createdBy: file.createdBy,
          creator: file.creator ? {
            id: file.creator.id,
            firstName: file.creator.firstName,
            lastName: file.creator.lastName,
            email: file.creator.email,
          } : undefined,
        })) || [],
      }),
    };
  }

  async findAll(): Promise<ConciliationResponseDto[]> {
    try {
      const conciliations = await this.conciliationRepo.find({
        relations: ['collector', 'creator', 'files', 'files.creator'],
        order: { createdAt: 'DESC' },
      });
      return conciliations.map(conciliation => this.toResponseDto(conciliation, true));
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findByCollector(collectorId: number): Promise<ConciliationResponseDto[]> {
    try {
      const conciliations = await this.conciliationRepo.find({
        where: { collectorId },
        relations: ['collector', 'creator', 'files', 'files.creator'],
        order: { createdAt: 'DESC' },
      });
      return conciliations.map(conciliation => this.toResponseDto(conciliation, true));
    } catch (error) {
      console.error('Error in findByCollector:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<ConciliationResponseDto> {
    try {
      const conciliation = await this.conciliationRepo.findOne({
        where: { id },
        relations: ['collector', 'creator', 'files', 'files.creator'],
      });
      
      if (!conciliation) {
        throw new NotFoundException(`Conciliación con ID ${id} no encontrada`);
      }
      
      return this.toResponseDto(conciliation, true);
    } catch (error) {
      console.error('Error in findOne:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error interno del servidor');
    }
  }

  async create(createDto: ConciliationCreateDto, userId?: number): Promise<ConciliationResponseDto> {
    try {
      const conciliation = this.conciliationRepo.create({
        ...createDto,
        createdBy: userId,
      });
      
      const savedConciliation = await this.conciliationRepo.save(conciliation);
      
      return this.toResponseDto(savedConciliation);
    } catch (error) {
      console.error('Error in create:', error);
      throw new Error('Error al crear la conciliación');
    }
  }

  async update(id: number, updateDto: Partial<ConciliationCreateDto>): Promise<ConciliationResponseDto> {
    try {
      const conciliation = await this.conciliationRepo.findOne({ where: { id } });
      
      if (!conciliation) {
        throw new NotFoundException(`Conciliación con ID ${id} no encontrada`);
      }
      
      Object.assign(conciliation, updateDto);
      
      const updatedConciliation = await this.conciliationRepo.save(conciliation);
      
      return this.toResponseDto(updatedConciliation);
    } catch (error) {
      console.error('Error in update:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error al actualizar la conciliación');
    }
  }

  async findByPeriod(period: string): Promise<ConciliationResponseDto[]> {
    try {
      const conciliations = await this.conciliationRepo.find({
        where: { period },
        relations: ['collector', 'creator', 'files', 'files.creator'],
        order: { createdAt: 'DESC' },
      });
      return conciliations.map(conciliation => this.toResponseDto(conciliation, true));
    } catch (error) {
      console.error('Error in findByPeriod:', error);
      throw error;
    }
  }

  async findByState(state: boolean): Promise<ConciliationResponseDto[]> {
    try {
      const conciliations = await this.conciliationRepo.find({
        where: { conciliationState: state },
        relations: ['collector', 'creator', 'files', 'files.creator'],
        order: { createdAt: 'DESC' },
      });
      return conciliations.map(conciliation => this.toResponseDto(conciliation, true));
    } catch (error) {
      console.error('Error in findByState:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    return this.remove(id);
  }

  async remove(id: number): Promise<void> {
    try {
      const conciliation = await this.conciliationRepo.findOne({ where: { id } });
      
      if (!conciliation) {
        throw new NotFoundException(`Conciliación con ID ${id} no encontrada`);
      }
      
      await this.conciliationRepo.remove(conciliation);
    } catch (error) {
      console.error('Error in remove:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error al eliminar la conciliación');
    }
  }
}
