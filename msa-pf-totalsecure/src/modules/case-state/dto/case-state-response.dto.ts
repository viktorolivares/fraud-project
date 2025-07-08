import { ApiProperty } from '@nestjs/swagger';

export class CaseStateResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
