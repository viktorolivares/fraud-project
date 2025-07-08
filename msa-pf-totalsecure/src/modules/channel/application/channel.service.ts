import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { Channel } from '../domain/channel.entity';
import { ChannelCreateDto } from '../dto/channel-create.dto';
import { ChannelUpdateDto } from '../dto/channel-update.dto';
import { ChannelResponseDto } from '../dto/channel-response.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
  ) {}

  private toResponseDto(channel: Channel): ChannelResponseDto {
    return {
      id: channel.id,
      name: channel.name,
      description: channel.description ?? undefined,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
      deletedAt: channel.deletedAt ?? undefined,
    };
  }

  async findAll(): Promise<ChannelResponseDto[]> {
    const channels = await this.channelRepo.find({
      where: { deletedAt: IsNull() },
      order: { name: 'ASC' },
    });
    return channels.map(channel => this.toResponseDto(channel));
  }

  async findOne(id: number): Promise<ChannelResponseDto> {
    const channel = await this.channelRepo.findOne({ 
      where: { id, deletedAt: IsNull() } 
    });
    if (!channel) {
      throw new NotFoundException(`Canal con ID ${id} no encontrado`);
    }
    return this.toResponseDto(channel);
  }

  async create(data: ChannelCreateDto): Promise<ChannelResponseDto> {
    // Validar que el nombre no esté duplicado
    const existingChannel = await this.channelRepo.findOne({
      where: { 
        name: data.name,
        deletedAt: IsNull() 
      }
    });
    
    if (existingChannel) {
      throw new ConflictException(`Ya existe un canal con el nombre "${data.name}"`);
    }

    const channel = this.channelRepo.create(data);
    await this.channelRepo.save(channel);
    return this.toResponseDto(channel);
  }

  async update(id: number, data: ChannelUpdateDto): Promise<ChannelResponseDto> {
    const channel = await this.channelRepo.findOne({ 
      where: { id, deletedAt: IsNull() } 
    });
    
    if (!channel) {
      throw new NotFoundException(`Canal con ID ${id} no encontrado`);
    }

    // Validar que el nuevo nombre no esté duplicado (si se está cambiando)
    if (data.name && data.name !== channel.name) {
      const existingChannel = await this.channelRepo.findOne({
        where: { 
          name: data.name,
          deletedAt: IsNull(),
          id: Not(id)
        }
      });
      
      if (existingChannel) {
        throw new ConflictException(`Ya existe un canal con el nombre "${data.name}"`);
      }
    }
    
    Object.assign(channel, data);
    await this.channelRepo.save(channel);
    return this.toResponseDto(channel);
  }

  async remove(id: number): Promise<ChannelResponseDto> {
    const channel = await this.channelRepo.findOne({ 
      where: { id, deletedAt: IsNull() } 
    });
    
    if (!channel) {
      throw new NotFoundException(`Canal con ID ${id} no encontrado`);
    }
    
    // TODO: Validar que el canal no esté siendo usado por casos activos
    // Esta validación se puede implementar cuando se tenga la entidad Case
    
    await this.channelRepo.softRemove(channel);
    return this.toResponseDto({ ...channel, deletedAt: new Date() });
  }

  async restore(id: number): Promise<ChannelResponseDto> {
    const channel = await this.channelRepo.findOne({ 
      where: { id },
      withDeleted: true 
    });
    
    if (!channel) {
      throw new NotFoundException(`Canal con ID ${id} no encontrado`);
    }
    
    if (!channel.deletedAt) {
      throw new ConflictException(`El canal con ID ${id} no está eliminado`);
    }

    await this.channelRepo.restore(id);
    const restored = await this.channelRepo.findOne({ where: { id } });
    return this.toResponseDto(restored!);
  }
}
