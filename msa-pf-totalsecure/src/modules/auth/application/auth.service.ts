import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { LoginDto } from '../dto/login.dto';
import { User } from '../../user/domain/user.entity';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserLoginDto } from '../../user/dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserLoginDto | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .leftJoinAndSelect('role.permissions', 'rolePermission')
      .leftJoinAndSelect('rolePermission.permission', 'permission')
      .leftJoinAndSelect('user.channel', 'channel')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    return this.buildUserLoginDto(user);
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const token = await this.jwtService.signAsync({ sub: user.id });

    return { token, user };
  }

  async verifyToken(token: string): Promise<LoginResponseDto> {
    const payload = await this.jwtService.verifyAsync<{ sub: number }>(token);
    const userId = payload?.sub;

    if (!userId) throw new UnauthorizedException('Token inválido');

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'roles',
        'roles.role',
        'roles.role.permissions',
        'roles.role.permissions.permission',
        'channel',
      ],
    });

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const userDto = this.buildUserLoginDto(user);

    return { token, user: userDto };
  }

  private buildUserLoginDto(user: User): UserLoginDto {
    const roles = user.roles.map((userRole) => {
      const role = userRole.role;

      const permissions = (role.permissions ?? []).map((rp) => {
        const perm = rp.permission;

        return {
          id: perm.id,
          name: perm.name,
          description: perm.description ?? '',
          createdAt: perm.createdAt,
          updatedAt: perm.updatedAt,
        };
      });

      return {
        id: role.id,
        name: role.name,
        description: role.description ?? '',
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        deleted_at: role.deletedAt ?? undefined,
        permissions,
      };
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      darkMode: user.darkMode,
      channelId: user.channel?.id ?? undefined,
      channel: user.channel?.name ?? undefined,
      roles,
    };
  }
}
