import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserWhereInput } from '../generated/prisma/models';
import { AuthClient } from '../services/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authClient: AuthClient, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>()
    const authHeader = (req.headers.authorization || req.headers.Authorization)?.toString()

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException()
    }
    
    const token = authHeader.split(' ')[1]
    const params = this.reflector.get<UserWhereInput>('authGuardParams', context.getHandler())
    const claims = await this.authClient.validateToken(token, params)

    if(!claims || 'error' in claims) {
      throw new UnauthorizedException()
    }

    req.user = claims
    return true
  }
}