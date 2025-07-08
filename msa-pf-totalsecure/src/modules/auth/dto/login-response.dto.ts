import { UserLoginDto } from '@modules/user/dto/user-login.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty({ type: UserLoginDto })
  user: UserLoginDto;
}
