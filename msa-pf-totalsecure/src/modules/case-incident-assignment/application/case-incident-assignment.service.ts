import { Injectable, NotFoundException } from '@nestjs/common';
import { CaseIncidentAssignmentCreateDto } from '../dto/case-incident-assignment-create.dto';
import { CaseIncidentAssignmentUpdateDto } from '../dto/case-incident-assignment-update.dto';
import { CaseIncidentAssignmentResponseDto } from '../dto/case-incident-assignment-response.dto';

@Injectable()
export class CaseIncidentAssignmentService {
  constructor() {}

  private toResponseDto(assign: {
    id: number;
    caseId: number;
    incidentId: number;
    assignedAt: Date;
    assignedBy: number;
    reason?: string | null;
    active: boolean;
  }): CaseIncidentAssignmentResponseDto {
    return {
      id: assign.id,
      caseId: assign.caseId,
      incidentId: assign.incidentId,
      assignedAt: assign.assignedAt,
      assignedBy: assign.assignedBy,
      reason: assign.reason ?? undefined,
      active: assign.active,
    };
  }

  async findAll(): Promise<CaseIncidentAssignmentResponseDto[]> {
    // TODO: Implementar con TypeORM cuando se cree la entidad
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findOne(_id: number): Promise<CaseIncidentAssignmentResponseDto> {
    // TODO: Implementar con TypeORM cuando se cree la entidad
    throw new NotFoundException('Asignación de incidente no encontrada');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(_data: CaseIncidentAssignmentCreateDto): Promise<CaseIncidentAssignmentResponseDto> {
    // TODO: Implementar con TypeORM cuando se cree la entidad
    throw new Error('No implementado aún');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(_id: number, _data: CaseIncidentAssignmentUpdateDto): Promise<CaseIncidentAssignmentResponseDto> {
    // TODO: Implementar con TypeORM cuando se cree la entidad
    throw new Error('No implementado aún');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(_id: number): Promise<CaseIncidentAssignmentResponseDto> {
    // TODO: Implementar con TypeORM cuando se cree la entidad
    throw new Error('No implementado aún');
  }
}
