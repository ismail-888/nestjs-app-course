import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CURRENT_USER_KEY } from 'src/utils/constants';
import { UserType } from 'src/utils/enums';
import { JWTPayloadType } from 'src/utils/types';
import { UsersService } from '../users.service';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector, // to get the roles from the decorator
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles: UserType[] = this.reflector.getAllAndOverride<UserType[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!roles || roles.length === 0) {
      return false;
    }

    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (token && type === 'Bearer') {
      try {
        const payload: JWTPayloadType = await this.jwtService.verifyAsync(
          token,
          {
            secret: this.config.get<string>('JWT_SECRET'),
          },
        );

        const user = await this.usersService.getCurrentUser(payload.id);
        if (!user) return false;

        if (roles.includes(user.userType)) {
          request[CURRENT_USER_KEY] = payload; // nafess hek => request.user bas bl typescript bya3ti error fa mne3ml hek.
          return true;
        }
      } catch (error) {
        if (error) {
          throw new UnauthorizedException('access denied, invalid token');
        }
      }
    } else {
      throw new UnauthorizedException('access denied, no token provided');
    }
    return false;
  }
}
