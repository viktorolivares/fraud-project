import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bot } from '../domain/bot.entity';
import { BotCreateDto } from '../dto/bot-create.dto';
import { BotUpdateDto } from '../dto/bot-update.dto';
import { BotResponseDto } from '../dto/bot-response.dto';

@Injectable()
export class BotService {
  constructor(
    @InjectRepository(Bot) private botRepo: Repository<Bot>,
  ) {}

  private toResponseDto(bot: Bot): BotResponseDto {
    return {
      id: bot.id,
      name: bot.name,
      description: bot.description ?? undefined,
      alertType: bot.alertType,
      lastRun: bot.lastRun,
      channelId: bot.channelId,
      channel: bot.channel ? {
        id: bot.channel.id,
        name: bot.channel.name,
        description: bot.channel.description,
        createdAt: bot.channel.createdAt,
        updatedAt: bot.channel.updatedAt,
        deletedAt: bot.channel.deletedAt,
      } : undefined,
    };
  }

  async findAll(): Promise<BotResponseDto[]> {
    const bots = await this.botRepo.find({
      relations: ['channel']
    });
    return bots.map(bot => this.toResponseDto(bot));
  }

  async findOne(id: number): Promise<BotResponseDto> {
    const bot = await this.botRepo.findOne({ 
      where: { id },
      relations: ['channel']
    });
    if (!bot) throw new NotFoundException('Bot no encontrado');
    return this.toResponseDto(bot);
  }

  async create(data: BotCreateDto): Promise<BotResponseDto> {
    const bot = this.botRepo.create(data);
    await this.botRepo.save(bot);
    return this.toResponseDto(bot);
  }

  async update(id: number, data: BotUpdateDto): Promise<BotResponseDto> {
    const bot = await this.botRepo.findOneOrFail({ where: { id } });
    Object.assign(bot, data);
    await this.botRepo.save(bot);
    return this.toResponseDto(bot);
  }

  async remove(id: number): Promise<BotResponseDto> {
    const bot = await this.botRepo.findOneOrFail({ where: { id } });
    await this.botRepo.remove(bot);
    return this.toResponseDto(bot);
  }
}
