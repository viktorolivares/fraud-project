import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemType } from '../domain/system-type.entity';

@Injectable()
export class SystemTypeService {
  constructor(
    @InjectRepository(SystemType)
    private readonly systemTypeRepository: Repository<SystemType>,
  ) {}

  async findAll(): Promise<SystemType[]> {
    return this.systemTypeRepository.find();
  }

  async findOne(id: number): Promise<SystemType | null> {
    return this.systemTypeRepository.findOne({ where: { id } });
  }

  async findByTable(tableName: string): Promise<SystemType[]> {
    return this.systemTypeRepository.find({ where: { tableName } });
  }

  async findByTableAndColumn(tableName: string, columnName: string): Promise<SystemType[]> {
    return this.systemTypeRepository.find({ 
      where: { 
        tableName, 
        columnName 
      } 
    });
  }

  async findActive(): Promise<SystemType[]> {
    return this.systemTypeRepository.find({ where: { isActive: true } });
  }

  async create(systemTypeData: Partial<SystemType>): Promise<SystemType> {
    const systemType = this.systemTypeRepository.create(systemTypeData);
    return this.systemTypeRepository.save(systemType);
  }

  async update(id: number, systemTypeData: Partial<SystemType>): Promise<SystemType | null> {
    await this.systemTypeRepository.update(id, systemTypeData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.systemTypeRepository.delete(id);
  }
}
