import { Controller, Get } from '@nestjs/common';
import { MerchService } from './merch.service';
import { AuthGuardDecorator } from 'apps/shared2/src/decorators/auth-guard.decorator';
import type { JwtClaims } from 'apps/shared2/src/types/jwt';
import { CurrentUser } from 'apps/shared2/src/decorators/jwt-claims.decorator';

@Controller()
export class MerchController {
  constructor(private readonly merchService: MerchService) {}

  @Get()
  @AuthGuardDecorator({ role: { in: ['ROOT'] } })
  getHello(
    @CurrentUser() claims: JwtClaims
  ) {
    return claims
  }
}
