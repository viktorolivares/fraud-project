import { ApiProperty } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty()
  nationalIdType: string;

  @ApiProperty()
  nationalId: string;

  @ApiProperty({ required: false })
  birthday?: Date;

  @ApiProperty({ required: false })
  calimacoUser?: number;

  @ApiProperty({ required: false })
  mvtId?: number;

  @ApiProperty({ required: false })
  calimacoStatus?: string;
}
