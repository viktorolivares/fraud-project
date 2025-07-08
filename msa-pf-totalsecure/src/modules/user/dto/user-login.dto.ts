import { RoleResponseDto } from '@modules/role/dto/role-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  darkMode: boolean;

  @ApiProperty({ required: false })
  channelId?: number;

  @ApiProperty({ required: false })
  channel?: string;

  @ApiProperty({ type: [RoleResponseDto], required: false })
  roles?: RoleResponseDto[];
}
