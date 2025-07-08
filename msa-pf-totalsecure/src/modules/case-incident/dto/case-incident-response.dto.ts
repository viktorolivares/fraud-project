import { ApiProperty } from '@nestjs/swagger';
import { ClientResponseDto } from '@modules/client/dto/client-response.dto';

export class CaseIncidentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  caseId: number;

  @ApiProperty({ description: 'Datos del incidente en formato JSON' })
  dataJson: Record<string, any>;

  @ApiProperty({ required: false })
  clientId?: number;

  @ApiProperty({ description: 'Información del cliente', required: false })
  client?: ClientResponseDto;
}
