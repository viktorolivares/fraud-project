import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
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

  @ApiProperty({ required: false })
  profileImage?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  darkMode: boolean;

  @ApiProperty({ required: false })
  channelId?: number;

  @ApiProperty({ required: false })
  expirationPassword?: Date;

  @ApiProperty()
  flagPassword: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date;

  @ApiProperty({ required: false })
  role?: string;

  @ApiProperty({ required: false })
  roleId?: number;

  @ApiProperty({ required: false })
  channel?: string;
}
