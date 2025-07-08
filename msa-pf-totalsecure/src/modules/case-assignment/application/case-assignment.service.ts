import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseAssignment } from '../domain/case-assignment.entity';
import { CaseAssignmentCreateDto } from '../dto/case-assignment-create.dto';
import { CaseAssignmentUpdateDto } from '../dto/case-assignment-update.dto';
import { CaseAssignmentResponseDto } from '../dto/case-assignment-response.dto';

@Injectable()
export class CaseAssignmentService {
  constructor(
    @InjectRepository(CaseAssignment)
    private readonly caseAssignmentRepository: Repository<CaseAssignment>,
  ) {}

  private toResponseDto(assignment: CaseAssignment): CaseAssignmentResponseDto {
    return {
      id: assignment.id,
      caseId: assignment.caseId,
      analystId: assignment.analystId,
      assignedAt: assignment.assignedAt,
      assignedBy: assignment.assignedBy,
      reason: assignment.reason ?? undefined,
      active: assignment.active,
      analyst: assignment.analyst ? {
        id: assignment.analyst.id,
        firstName: assignment.analyst.firstName,
        lastName: assignment.analyst.lastName,
        email: assignment.analyst.email,
        username: assignment.analyst.username,
        profileImage: assignment.analyst.profileImage,
        isActive: assignment.analyst.isActive,
        darkMode: assignment.analyst.darkMode,
        channelId: assignment.analyst.channelId,
        expirationPassword: assignment.analyst.expirationPassword,
        flagPassword: assignment.analyst.flagPassword,
        createdAt: assignment.analyst.createdAt,
        updatedAt: assignment.analyst.updatedAt,
        deletedAt: assignment.analyst.deletedAt ?? undefined
      } : undefined,
      assigner: assignment.assignedByUser ? {
        id: assignment.assignedByUser.id,
        firstName: assignment.assignedByUser.firstName,
        lastName: assignment.assignedByUser.lastName,
        email: assignment.assignedByUser.email,
        username: assignment.assignedByUser.username,
        profileImage: assignment.assignedByUser.profileImage,
        isActive: assignment.assignedByUser.isActive,
        darkMode: assignment.assignedByUser.darkMode,
        channelId: assignment.assignedByUser.channelId,
        expirationPassword: assignment.assignedByUser.expirationPassword,
        flagPassword: assignment.assignedByUser.flagPassword,
        createdAt: assignment.assignedByUser.createdAt,
        updatedAt: assignment.assignedByUser.updatedAt,
        deletedAt: assignment.assignedByUser.deletedAt ?? undefined
      } : undefined,
    };
  }

  async findAll(): Promise<CaseAssignmentResponseDto[]> {
    const assignments = await this.caseAssignmentRepository.find({
      relations: ['analyst', 'assignedByUser'],
      order: { assignedAt: 'DESC' },
    });
    return assignments.map(assignment => this.toResponseDto(assignment));
  }

  async findOne(id: number): Promise<CaseAssignmentResponseDto> {
    const assignment = await this.caseAssignmentRepository.findOne({
      where: { id },
      relations: ['analyst', 'assignedByUser'],
    });
    
    if (!assignment) {
      throw new NotFoundException('Asignación no encontrada');
    }
    
    return this.toResponseDto(assignment);
  }

  async create(data: CaseAssignmentCreateDto): Promise<CaseAssignmentResponseDto> {
    const assignment = this.caseAssignmentRepository.create({
      caseId: data.caseId,
      analystId: data.analystId,
      assignedBy: data.assignedBy,
      reason: data.reason,
      active: data.active ?? true,
      assignedAt: data.assignedAt ?? new Date(),
    });

    const savedAssignment = await this.caseAssignmentRepository.save(assignment);
    return this.toResponseDto(savedAssignment);
  }

  async update(id: number, data: CaseAssignmentUpdateDto): Promise<CaseAssignmentResponseDto> {
    const assignment = await this.caseAssignmentRepository.findOne({
      where: { id },
      relations: ['analyst', 'assignedByUser'],
    });

    if (!assignment) {
      throw new NotFoundException('Asignación no encontrada');
    }

    Object.assign(assignment, data);
    const updatedAssignment = await this.caseAssignmentRepository.save(assignment);
    return this.toResponseDto(updatedAssignment);
  }

  async remove(id: number): Promise<CaseAssignmentResponseDto> {
    const assignment = await this.caseAssignmentRepository.findOne({
      where: { id },
      relations: ['analyst', 'assignedByUser'],
    });

    if (!assignment) {
      throw new NotFoundException('Asignación no encontrada');
    }

    await this.caseAssignmentRepository.remove(assignment);
    return this.toResponseDto(assignment);
  }

  // Métodos adicionales para el frontend
  async findByAnalyst(analystId: number): Promise<CaseAssignmentResponseDto[]> {
    const assignments = await this.caseAssignmentRepository.find({
      where: { analystId },
      relations: ['analyst', 'assignedByUser'],
      order: { assignedAt: 'DESC' },
    });
    return assignments.map(assignment => this.toResponseDto(assignment));
  }

  async findByCase(caseId: number): Promise<CaseAssignmentResponseDto[]> {
    const assignments = await this.caseAssignmentRepository.find({
      where: { caseId },
      relations: ['analyst', 'assignedByUser'],
      order: { assignedAt: 'DESC' },
    });
    return assignments.map(assignment => this.toResponseDto(assignment));
  }

  async findActive(): Promise<CaseAssignmentResponseDto[]> {
    const assignments = await this.caseAssignmentRepository.find({
      where: { active: true },
      relations: ['analyst', 'assignedByUser'],
      order: { assignedAt: 'DESC' },
    });
    return assignments.map(assignment => this.toResponseDto(assignment));
  }

  async deactivate(id: number): Promise<CaseAssignmentResponseDto> {
    const assignment = await this.caseAssignmentRepository.findOne({
      where: { id },
      relations: ['analyst', 'assignedByUser'],
    });

    if (!assignment) {
      throw new NotFoundException('Asignación no encontrada');
    }

    assignment.active = false;
    const updatedAssignment = await this.caseAssignmentRepository.save(assignment);
    return this.toResponseDto(updatedAssignment);
  }

  async bulkAssign(caseIds: number[], analystId: number, reason?: string): Promise<CaseAssignmentResponseDto[]> {
    console.log(`🔄 Iniciando asignación masiva: ${caseIds.length} casos al analista ${analystId}`);
    
    const results: CaseAssignmentResponseDto[] = [];
    
    // Procesar cada caso individualmente
    for (const caseId of caseIds) {
      try {
        console.log(`📝 Procesando caso ${caseId}...`);
        
        // Verificar si ya existe una asignación activa para este caso
        const existingAssignment = await this.caseAssignmentRepository.findOne({
          where: { caseId, active: true },
          relations: ['analyst', 'assignedByUser'],
        });

        if (existingAssignment) {
          console.log(`⚠️ Caso ${caseId} ya tiene asignación activa. Omitiendo...`);
          continue;
        }

        // Crear nueva asignación
        const createDto: CaseAssignmentCreateDto = {
          caseId,
          analystId,
          assignedBy: 1, // TODO: Usar el ID del usuario autenticado cuando esté disponible
          reason,
          active: true,
        };

        const assignment = await this.create(createDto);
        results.push(assignment);
        console.log(`✅ Caso ${caseId} asignado correctamente`);
        
      } catch (error) {
        console.error(`❌ Error asignando caso ${caseId}:`, error);
        // Continuar con el siguiente caso en lugar de fallar completamente
      }
    }

    console.log(`🎯 Asignación masiva completada: ${results.length}/${caseIds.length} casos asignados exitosamente`);
    return results;
  }
}
