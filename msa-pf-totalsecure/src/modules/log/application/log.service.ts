import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Log } from '../domain/log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async findAll(limit: number = 100): Promise<Log[]> {
    return this.logRepository.find({
      order: { registerAt: 'DESC' },
      take: limit,
    });
  }

  async findOne(id: number): Promise<Log | null> {
    return this.logRepository.findOne({ where: { id } });
  }

  async findByTable(tableName: string, limit: number = 100): Promise<Log[]> {
    return this.logRepository.find({
      where: { tableName },
      order: { registerAt: 'DESC' },
      take: limit,
    });
  }

  async findByDateRange(startDate: Date, endDate: Date, limit: number = 100): Promise<Log[]> {
    return this.logRepository.find({
      where: {
        registerAt: Between(startDate, endDate),
      },
      order: { registerAt: 'DESC' },
      take: limit,
    });
  }

  async findByTableAndDateRange(
    tableName: string,
    startDate: Date,
    endDate: Date,
    limit: number = 100
  ): Promise<Log[]> {
    return this.logRepository.find({
      where: {
        tableName,
        registerAt: Between(startDate, endDate),
      },
      order: { registerAt: 'DESC' },
      take: limit,
    });
  }

  async create(logData: Partial<Log>): Promise<Log> {
    const log = this.logRepository.create(logData);
    return this.logRepository.save(log);
  }

  async delete(id: number): Promise<void> {
    await this.logRepository.delete(id);
  }

  async deleteOldLogs(olderThanDays: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    await this.logRepository
      .createQueryBuilder()
      .delete()
      .where('register_at < :cutoffDate', { cutoffDate })
      .execute();
  }
}
