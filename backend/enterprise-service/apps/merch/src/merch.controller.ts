import { Controller, Get, Query } from '@nestjs/common';
import { MerchService } from './merch.service';
import { AuthGuardDecorator } from 'apps/shared2/src/decorators/auth-guard.decorator';
import type { JwtClaims } from 'apps/shared2/src/types/jwt';
import { CurrentUser } from 'apps/shared2/src/decorators/jwt-claims.decorator';
import { PaginationDefaultPageSize, PaginationDto } from 'apps/shared2/src/dto/pagination';
import { MerchEntity } from './entities/merch.entity';

@Controller()
export class MerchController {
  constructor(private readonly merchService: MerchService) {}

  @Get()
  @AuthGuardDecorator()
  async getMerch(
    // @CurrentUser() claims: JwtClaims,
    @Query(new PaginationDefaultPageSize(50)) p: PaginationDto
  ) {
    const resp = await this.merchService.getMerch(p)
    return resp.map((m) => new MerchEntity(m))
  }
}
