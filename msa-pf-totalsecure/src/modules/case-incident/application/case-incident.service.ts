import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CaseIncident } from '../domain/case-incident.entity';
import { CaseIncidentResponseDto } from '../dto/case-incident-response.dto';

@Injectable()
export class CaseIncidentService {
  constructor(
    @InjectRepository(CaseIncident)
    private readonly caseIncidentRepository: Repository<CaseIncident>,
  ) {}

  private toResponseDto(incident: CaseIncident): CaseIncidentResponseDto {
    return {
      id: incident.id,
      caseId: incident.caseId,
      dataJson: incident.dataJson as Record<string, unknown>,
      clientId: incident.clientId,
    };
  }

  async findAll(fromDate?: string, toDate?: string): Promise<CaseIncidentResponseDto[]> {
    // Si no se proporcionan fechas, usar desde ayer hasta hoy (últimas 24 horas)
    const now = new Date();
    const defaultFromDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 día atrás (ayer)
    
    const startDate = fromDate ? new Date(fromDate) : defaultFromDate;
    const endDate = toDate ? new Date(toDate) : now;
    
    // Ajustar las horas para incluir todo el día
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const incidents = await this.caseIncidentRepository.find({
      relations: ['case', 'client'],
      where: {
        case: {
          captureDate: Between(startDate, endDate)
        }
      },
      order: { id: 'DESC' },
    });
    return incidents.map(incident => this.toResponseDto(incident));
  }

  async findOne(id: number): Promise<CaseIncidentResponseDto> {
    const incident = await this.caseIncidentRepository.findOne({
      where: { id },
      relations: ['case', 'client'],
    });
    
    if (!incident) {
      throw new NotFoundException(`Incidente con ID ${id} no encontrado`);
    }
    
    return this.toResponseDto(incident);
  }

  async findByCase(caseId: number, fromDate?: string, toDate?: string): Promise<CaseIncidentResponseDto[]> {
    let whereCondition: Record<string, any> = { caseId };
    
    // Si se proporcionan fechas, agregar filtro de fecha en el caso relacionado
    if (fromDate || toDate) {
      const now = new Date();
      const defaultFromDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 día atrás (ayer)
      
      const startDate = fromDate ? new Date(fromDate) : defaultFromDate;
      const endDate = toDate ? new Date(toDate) : now;
      
      // Ajustar las horas para incluir todo el día
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      
      whereCondition = {
        caseId,
        case: {
          captureDate: Between(startDate, endDate)
        }
      };
    }

    const incidents = await this.caseIncidentRepository.find({
      where: whereCondition,
      relations: ['case', 'client'],
      order: { id: 'DESC' },
    });
    return incidents.map(incident => this.toResponseDto(incident));
  }
}
