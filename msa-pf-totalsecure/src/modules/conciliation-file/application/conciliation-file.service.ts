import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConciliationFile } from '../domain/conciliation-file.entity';

@Injectable()
export class ConciliationFileService {
  constructor(
    @InjectRepository(ConciliationFile)
    private readonly conciliationFileRepository: Repository<ConciliationFile>,
  ) {}

  async findAll(): Promise<ConciliationFile[]> {
    return this.conciliationFileRepository.find({
      relations: ['conciliation', 'creator'],
    });
  }

  async findOne(id: number): Promise<ConciliationFile | null> {
    return this.conciliationFileRepository.findOne({
      where: { id },
      relations: ['conciliation', 'creator'],
    });
  }

  async findByConciliation(conciliationId: number): Promise<ConciliationFile[]> {
    return this.conciliationFileRepository.find({
      where: { conciliationId },
      relations: ['conciliation', 'creator'],
    });
  }

  async findByType(fileType: number): Promise<ConciliationFile[]> {
    return this.conciliationFileRepository.find({
      where: { conciliationFileType: fileType },
      relations: ['conciliation', 'creator'],
    });
  }

  async create(fileData: Partial<ConciliationFile>): Promise<ConciliationFile> {
    const file = this.conciliationFileRepository.create(fileData);
    return this.conciliationFileRepository.save(file);
  }

  async update(id: number, fileData: Partial<ConciliationFile>): Promise<ConciliationFile | null> {
    await this.conciliationFileRepository.update(id, fileData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.conciliationFileRepository.delete(id);
  }
}
