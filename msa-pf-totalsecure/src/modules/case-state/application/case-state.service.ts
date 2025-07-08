import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseStateCreateDto } from '../dto/case-state-create.dto';
import { CaseStateUpdateDto } from '../dto/case-state-update.dto';
import { CaseStateResponseDto } from '../dto/case-state-response.dto';
import { CaseState } from '../domain/case-state.entity';

@Injectable()
export class CaseStateService {
  constructor(
    @InjectRepository(CaseState)
    private readonly caseStateRepository: Repository<CaseState>,
  ) {}

  private toResponseDto(state: CaseState): CaseStateResponseDto {
    return {
      id: state.id,
      name: state.name,
    };
  }

  async findAll(): Promise<CaseStateResponseDto[]> {
    try {
      const states = await this.caseStateRepository.find({
        order: { id: 'ASC' }
      });
      return states.map(state => this.toResponseDto(state));
    } catch (error) {
      console.error('Error fetching case states:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<CaseStateResponseDto> {
    try {
      const state = await this.caseStateRepository.findOne({
        where: { id }
      });
      
      if (!state) {
        throw new NotFoundException(`Estado con ID ${id} no encontrado`);
      }
      
      return this.toResponseDto(state);
    } catch (error) {
      console.error(`Error fetching case state with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  async create(data: CaseStateCreateDto): Promise<CaseStateResponseDto> {
    try {
      const newState = this.caseStateRepository.create({
        name: data.name
      });
      
      const savedState = await this.caseStateRepository.save(newState);
      return this.toResponseDto(savedState);
    } catch (error) {
      console.error('Error creating case state:', error);
      throw error;
    }
  }

  async update(id: number, data: CaseStateUpdateDto): Promise<CaseStateResponseDto> {
    try {
      const state = await this.caseStateRepository.findOne({
        where: { id }
      });
      
      if (!state) {
        throw new NotFoundException(`Estado con ID ${id} no encontrado`);
      }
      
      Object.assign(state, data);
      const updatedState = await this.caseStateRepository.save(state);
      return this.toResponseDto(updatedState);
    } catch (error) {
      console.error(`Error updating case state with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  async remove(id: number): Promise<CaseStateResponseDto> {
    try {
      const state = await this.caseStateRepository.findOne({
        where: { id }
      });
      
      if (!state) {
        throw new NotFoundException(`Estado con ID ${id} no encontrado`);
      }
      
      await this.caseStateRepository.remove(state);
      return this.toResponseDto(state);
    } catch (error) {
      console.error(`Error removing case state with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }
}
