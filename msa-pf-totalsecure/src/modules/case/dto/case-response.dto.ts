import { ApiProperty } from '@nestjs/swagger';
import { BotExecutionResponseDto } from '@modules/bot-execution/dto/bot-execution-response.dto';
import { CaseStateResponseDto } from '@modules/case-state/dto/case-state-response.dto';
import { UserResponseDto } from '@modules/user/dto/user-response.dto';
import { CaseIncidentResponseDto } from '@modules/case-incident/dto/case-incident-response.dto';
import { CaseNoteResponseDto } from '@modules/case-note/dto/case-note-response.dto';
import { CaseAssignmentResponseDto } from '@modules/case-assignment/dto/case-assignment-response.dto';

export class CaseResponseDto {
  @ApiProperty({ description: 'ID único del caso' })
  id: number;

  @ApiProperty({ description: 'ID de la ejecución del bot' })
  executionId: number;

  @ApiProperty({ description: 'Fecha de captura del caso' })
  captureDate: string;

  @ApiProperty({ description: 'Descripción del caso' })
  description: string;

  @ApiProperty({ description: 'ID del estado del caso' })
  stateId: number;

  @ApiProperty({ description: 'ID del usuario afectado', required: false })
  affectedUserId?: number;

  @ApiProperty({ description: 'Fecha de cierre del caso', required: false })
  closeDate?: string;

  @ApiProperty({ description: 'Detalle del cierre del caso', required: false })
  closeDetail?: string;

  @ApiProperty({ description: 'Evidencia del cierre del caso', required: false })
  closeEvidence?: string;

  // Relaciones
  @ApiProperty({ description: 'Información de la ejecución del bot', required: false })
  botExecution?: BotExecutionResponseDto;

  @ApiProperty({ description: 'Estado del caso', required: false })
  state?: CaseStateResponseDto;

  @ApiProperty({ description: 'Usuario afectado', required: false })
  affectedUser?: UserResponseDto;

  @ApiProperty({ 
    description: 'Incidentes del caso', 
    type: [CaseIncidentResponseDto],
    required: false 
  })
  incidents?: CaseIncidentResponseDto[];

  @ApiProperty({ 
    description: 'Notas del caso', 
    type: [CaseNoteResponseDto],
    required: false 
  })
  notes?: CaseNoteResponseDto[];

  @ApiProperty({ 
    description: 'Asignaciones del caso', 
    type: [CaseAssignmentResponseDto],
    required: false 
  })
  assignments?: CaseAssignmentResponseDto[];
}
