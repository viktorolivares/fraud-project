import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from '../domain/case.entity';
import { CaseResponseDto } from '../dto/case-response.dto';
import { UpdateCaseDto } from '../dto/update-case.dto';

@Injectable()
export class CaseService {
  constructor(
    @InjectRepository(Case) private caseRepo: Repository<Case>,
  ) {}

  private toResponseDto(caseEntity: Case, includeRelations = false): CaseResponseDto {
    return {
      id: caseEntity.id,
      executionId: caseEntity.executionId,
      captureDate: caseEntity.captureDate.toISOString(),
      description: caseEntity.description,
      stateId: caseEntity.stateId,
      affectedUserId: caseEntity.affectedUserId ?? undefined,
      closeDate: caseEntity.closeDate?.toISOString() ?? undefined,
      closeDetail: caseEntity.closeDetail ?? undefined,
      closeEvidence: caseEntity.closeEvidence ?? undefined,
      ...(includeRelations && {
        state: caseEntity.state ? {
          id: caseEntity.state.id,
          name: caseEntity.state.name
        } : undefined,
        affectedUser: caseEntity.affectedUser ? {
          id: caseEntity.affectedUser.id,
          firstName: caseEntity.affectedUser.firstName,
          lastName: caseEntity.affectedUser.lastName,
          email: caseEntity.affectedUser.email,
          username: caseEntity.affectedUser.username,
          profileImage: caseEntity.affectedUser.profileImage,
          isActive: caseEntity.affectedUser.isActive,
          darkMode: caseEntity.affectedUser.darkMode,
          channelId: caseEntity.affectedUser.channelId,
          expirationPassword: caseEntity.affectedUser.expirationPassword,
          flagPassword: caseEntity.affectedUser.flagPassword,
          createdAt: caseEntity.affectedUser.createdAt,
          updatedAt: caseEntity.affectedUser.updatedAt,
          deletedAt: caseEntity.affectedUser.deletedAt ?? undefined
        } : undefined,
        incidents: caseEntity.incidents?.map(incident => ({
          id: incident.id,
          caseId: incident.caseId,
          dataJson: incident.dataJson,
          clientId: incident.clientId,
          client: incident.client ? {
            id: incident.client.id,
            firstName: incident.client.firstName,
            lastName: incident.client.lastName,
            email: incident.client.email,
            nationalIdType: incident.client.nationalIdType,
            nationalId: incident.client.nationalId,
            birthday: incident.client.birthday,
            calimacoUser: incident.client.calimacoUser,
            mvtId: incident.client.mvtId,
            calimacoStatus: incident.client.calimacoStatus
          } : undefined
        })) ?? [],
        // notes: caseEntity.notes?.map(note => ({
        //   id: note.id,
        //   caseId: note.caseId,
        //   authorId: note.authorId,
        //   dateTime: note.dateTime,
        //   comment: note.comment,
        //   attachment: note.attachment
        // })) ?? [],
        notes: [], // Temporalmente vacío hasta arreglar esquema BD
        assignments: caseEntity.assignments?.map(assignment => ({
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
          } : undefined
        })) ?? []
      })
    };
  }

  async findAll(fromDate?: string, toDate?: string): Promise<CaseResponseDto[]> {
    try {
      const queryBuilder = this.caseRepo.createQueryBuilder('case')
        .leftJoinAndSelect('case.state', 'state')
        .leftJoinAndSelect('case.affectedUser', 'affectedUser')
        .leftJoinAndSelect('case.assignments', 'assignments', 'assignments.active = true')
        .leftJoinAndSelect('assignments.analyst', 'analyst')
        .leftJoinAndSelect('assignments.assignedByUser', 'assignedByUser');
      
      if (fromDate) {
        queryBuilder.andWhere('case.capture_date >= :fromDate', { fromDate });
      }
      
      if (toDate) {
        queryBuilder.andWhere('case.capture_date <= :toDate', { toDate });
      }
      
      queryBuilder.orderBy('case.id', 'DESC');
      
      const cases = await queryBuilder.getMany();
      return cases.map(caseEntity => this.toResponseDto(caseEntity, true));
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<CaseResponseDto> {
    try {
      const caseEntity = await this.caseRepo.findOne({ 
        where: { id },
        relations: [
          'state', 
          'affectedUser'
        ]
      });
      if (!caseEntity) throw new NotFoundException('Caso no encontrado');
      return this.toResponseDto(caseEntity, true);
    } catch (error) {
      console.error('Error in findOne:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error interno del servidor');
    }
  }

  async findOneWithDetails(id: number): Promise<CaseResponseDto> {
    try {
      console.log(`🔍 Buscando caso ${id} con detalles completos...`);
      
      const caseEntity = await this.caseRepo.findOne({ 
        where: { id },
        relations: [
          'state', 
          'affectedUser',
          'incidents',
          'incidents.client',
          'assignments',
          'assignments.analyst',
          'assignments.assignedByUser'
        ]
      });
      
      if (!caseEntity) {
        console.log(`❌ Caso ${id} no encontrado en la BD`);
        throw new NotFoundException('Caso no encontrado');
      }
      
      console.log(`✅ Caso ${id} encontrado:`, {
        id: caseEntity.id,
        description: caseEntity.description,
        incidentsCount: caseEntity.incidents?.length || 0,
        notesCount: caseEntity.notes?.length || 0,
        assignmentsCount: caseEntity.assignments?.length || 0
      });
      
      const result = this.toResponseDto(caseEntity, true);
      console.log(`✅ DTO generado exitosamente para caso ${id}`);
      return result;
    } catch (error) {
      console.error(`❌ Error en findOneWithDetails para caso ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error interno del servidor');
    }
  }

  async findByExecutionId(executionId: number, fromDate?: string, toDate?: string): Promise<CaseResponseDto[]> {
    const queryBuilder = this.caseRepo.createQueryBuilder('case');
    
    queryBuilder.where('case.execution_id = :executionId', { executionId });
    
    if (fromDate) {
      queryBuilder.andWhere('case.capture_date >= :fromDate', { fromDate });
    }
    
    if (toDate) {
      queryBuilder.andWhere('case.capture_date <= :toDate', { toDate });
    }
    
    queryBuilder.orderBy('case.id', 'DESC');
    
    const cases = await queryBuilder.getMany();
    return cases.map(caseEntity => this.toResponseDto(caseEntity));
  }

  async findByStateId(stateId: number, fromDate?: string, toDate?: string): Promise<CaseResponseDto[]> {
    const queryBuilder = this.caseRepo.createQueryBuilder('case');
    
    queryBuilder.where('case.state_id = :stateId', { stateId });
    
    if (fromDate) {
      queryBuilder.andWhere('case.capture_date >= :fromDate', { fromDate });
    }
    
    if (toDate) {
      queryBuilder.andWhere('case.capture_date <= :toDate', { toDate });
    }
    
    queryBuilder.orderBy('case.id', 'DESC');
    
    const cases = await queryBuilder.getMany();
    return cases.map(caseEntity => this.toResponseDto(caseEntity));
  }

  async update(id: number, dto: UpdateCaseDto): Promise<CaseResponseDto> {
    const caseEntity = await this.caseRepo.findOne({ where: { id } });
    if (!caseEntity) {
      throw new NotFoundException(`Caso con ID ${id} no encontrado`);
    }
    // Aplicar cambios
    if (dto.stateId !== undefined) caseEntity.stateId = dto.stateId;
    if (dto.closeDate !== undefined) caseEntity.closeDate = new Date(dto.closeDate);
    if (dto.closeDetail !== undefined) caseEntity.closeDetail = dto.closeDetail;
    // Guardar entidad
    const saved = await this.caseRepo.save(caseEntity);
    // Retornar DTO con relaciones mínimas
    return this.toResponseDto(saved, false);
  }
}
