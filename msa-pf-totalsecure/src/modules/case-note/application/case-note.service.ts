import { Injectable, NotFoundException } from '@nestjs/common';
import { CaseNoteCreateDto } from '../dto/case-note-create.dto';
import { CaseNoteUpdateDto } from '../dto/case-note-update.dto';
import { CaseNoteResponseDto } from '../dto/case-note-response.dto';

@Injectable()
export class CaseNoteService {
  constructor() {}

  private toResponseDto(note: any): CaseNoteResponseDto {
    return {
      id: note.id,
      caseId: note.caseId,
      authorId: note.authorId,
      dateTime: note.dateTime,
      comment: note.comment,
      attachment: note.attachment ?? undefined,
    };
  }

  async findAll(): Promise<CaseNoteResponseDto[]> {
    // Implementación temporal - devolver array vacío
    return [];
  }

  async findOne(_id: number): Promise<CaseNoteResponseDto> {
    throw new NotFoundException('Nota no encontrada - servicio no implementado');
  }

  async create(_data: CaseNoteCreateDto): Promise<CaseNoteResponseDto> {
    // Implementación temporal
    return this.toResponseDto({
      id: 1,
      caseId: 1,
      authorId: 1,
      dateTime: new Date(),
      comment: 'Nota temporal',
      attachment: null,
    });
  }

  async update(_id: number, _data: CaseNoteUpdateDto): Promise<CaseNoteResponseDto> {
    throw new NotFoundException('Nota no encontrada - servicio no implementado');
  }

  async remove(_id: number): Promise<CaseNoteResponseDto> {
    throw new NotFoundException('Nota no encontrada - servicio no implementado');
  }
}
