import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BotExecution } from '../domain/bot-execution.entity';
import { BotExecutionResponseDto } from '../dto/bot-execution-response.dto';

@Injectable()
export class BotExecutionService {
  constructor(
    @InjectRepository(BotExecution) private botExecutionRepo: Repository<BotExecution>,
  ) {}

  private toResponseDto(exec: BotExecution): BotExecutionResponseDto {
    return {
      id: exec.id,
      botId: exec.botId,
      executedAt: exec.executedAt,
      totalProcessedRecords: exec.totalProcessedRecords,
      totalDetectedIncidents: exec.totalDetectedIncidents,
      bot: exec.bot ? {
        id: exec.bot.id,
        name: exec.bot.name,
        description: exec.bot.description,
        alertType: exec.bot.alertType,
      } : undefined,
    };
  }

  async findAll(startDate?: string, endDate?: string): Promise<BotExecutionResponseDto[]> {
    try {
      const queryBuilder = this.botExecutionRepo.createQueryBuilder('execution')
        .leftJoinAndSelect('execution.bot', 'bot')
        .orderBy('execution.executedAt', 'DESC');

      // Aplicar filtros de fecha si se proporcionan
      if (startDate && endDate) {
        queryBuilder.where('execution.executedAt BETWEEN :startDate AND :endDate', {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        });
      } else if (startDate) {
        queryBuilder.where('execution.executedAt >= :startDate', {
          startDate: new Date(startDate),
        });
      } else if (endDate) {
        queryBuilder.where('execution.executedAt <= :endDate', {
          endDate: new Date(endDate),
        });
      }

      const execs = await queryBuilder.getMany();
      return execs.map(exec => this.toResponseDto(exec));
    } catch (error) {
      console.error('Error fetching bot executions:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<BotExecutionResponseDto> {
    try {
      const exec = await this.botExecutionRepo.findOne({
        where: { id },
        relations: ['bot'],
      });
      if (!exec) throw new NotFoundException('Ejecución no encontrada');
      return this.toResponseDto(exec);
    } catch (error) {
      console.error(`Error fetching bot execution with id ${id}:`, error);
      throw error;
    }
  }
}
