import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../user/domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Request } from 'express';


interface JwtPayload {
  sub: string;
  email?: string;
  [key: string]: any;
}

interface AuthenticatedUser {
  sub: string;
  email?: string;
  roles: {
    permissions: { name: string }[];
  }[];
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    const token = this.extractToken(req);
    const payload = await this.verifyToken(token);

    console.log('🔍 JWT Payload:', payload);

    // Cargar usuario con las relaciones CORRECTAS según las entidades
    const user = await this.userRepo.findOne({
      where: { id: parseInt(payload.sub, 10) },
      relations: [
        'roles',                    // UserRole[]
        'roles.role',              // Role
        'roles.role.permissions',  // RolePermission[]
        'roles.role.permissions.permission', // Permission
      ],
    });

    console.log('👤 Usuario encontrado:', {
      id: user?.id,
      username: user?.username,
      rolesCount: user?.roles?.length || 0,
      roles: user?.roles?.map(ur => ({
        roleName: ur.role?.name,
        permissionsCount: ur.role?.permissions?.length || 0
      }))
    });

    if (!user) {
      console.log('❌ Usuario no encontrado con ID:', payload.sub);
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const mappedUser = this.mapUserToAuthenticatedUser(payload, user);
    console.log('🔐 Usuario mapeado con permisos:', {
      userSub: mappedUser.sub,
      rolesCount: mappedUser.roles.length,
      totalPermissions: mappedUser.roles.flatMap(r => r.permissions).length,
      hasViewDashboard: mappedUser.roles.some(r => 
        r.permissions.some(p => p.name === 'reporting-analytics.dashboards.view')
      )
    });
    
    req.user = mappedUser;
    return true;
  }

  private extractToken(req: Request): string {
    const authHeader = req.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      throw new UnauthorizedException('Token vacío');
    }

    return token;
  }

  private async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch (err) {
      console.error('❌ Error al verificar el token JWT:', err);
      throw new UnauthorizedException('Token inválido');
    }
  }

  private mapUserToAuthenticatedUser(
    payload: JwtPayload,
    user: User,
  ): AuthenticatedUser {
    console.log('📋 Mapeando usuario. Roles encontrados:', user.roles?.length || 0);
    
    return {
      sub: payload.sub,
      email: payload.email,
      roles: user.roles?.map((userRole) => {
        console.log(`🎭 Procesando rol: ${userRole.role?.name}`);
        console.log(`🔑 Permisos en el rol: ${userRole.role?.permissions?.length || 0}`);
        
        return {
          permissions: userRole.role?.permissions?.map((rolePermission) => {
            console.log(`  ✅ Permiso: ${rolePermission.permission?.name}`);
            return {
              name: rolePermission.permission.name,
            };
          }) || [],
        };
      }) || [],
    };
  }

  
}
