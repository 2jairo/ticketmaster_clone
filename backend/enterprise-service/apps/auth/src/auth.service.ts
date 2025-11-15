import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserWhereInput } from 'apps/shared2/src/generated/prisma/models';
import { PrismaService } from 'apps/shared2/src/prisma/prisma.service';
import { JwtClaims } from 'apps/shared2/src/types/jwt';
import jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  private validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtClaims;
      const claims: JwtClaims = { userId: decoded.userId, v: decoded.v, role: decoded.role } 
      return claims
    } catch {
      throw new UnauthorizedException();
    }
  }

  async authenticate(token: string, params: UserWhereInput) {
    const claims = this.validateToken(token)

    const user = await this.prismaService.user.findFirst({
      where: { id: claims.userId, isActive: true, ...params },
    })
    
    if (!user || user.v !== claims.v) {
      throw new UnauthorizedException()
    }

    return claims
  }
}
