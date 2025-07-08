import { ApiProperty } from '@nestjs/swagger';

export class CollectorResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ required: false })
  createdBy?: number;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty({ required: false })
  updatedBy?: number;

  @ApiProperty({ required: false })
  creator?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty({ required: false })
  updater?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty({ required: false })
  conciliationsCount?: number;
}
