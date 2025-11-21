import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MerchService } from '../services/merch.service';
import { AuthGuardDecorator } from 'apps/shared2/src/decorators/auth-guard.decorator';
import type { JwtClaims } from 'apps/shared2/src/types/jwt';
import { CurrentUser } from 'apps/shared2/src/decorators/jwt-claims.decorator';
import { PaginationDefaultPageSize, PaginationDto } from 'apps/shared2/src/dto/pagination';
import { MerchEntity } from '../entities/merch.entity';
import { plainToInstance } from 'class-transformer';
import { CreateMerchDto, UpdateMerchDto } from '../dto/merch';

@Controller('')
export class MerchController {
  constructor(private readonly merchService: MerchService) {}

  @Get()
  @AuthGuardDecorator()
  async getMerch(
    @Query(new PaginationDefaultPageSize(50)) p: PaginationDto
  ) {
    const resp = await this.merchService.getMerch(p)
    return resp.map((m) => plainToInstance(MerchEntity, m))
  }

  @Post()
  @AuthGuardDecorator()
  async createMerch(
    @Body() createMerchDto: CreateMerchDto
  ) {
    const resp = await this.merchService.createMerch(createMerchDto)
    return plainToInstance(MerchEntity, resp)
  }

  @Put('/:slug')
  @AuthGuardDecorator()
  async updateMerch(
    @Param('slug') slug: string,
    @Body() updateMerchDto: UpdateMerchDto
  ) {
    const resp = await this.merchService.updateMerch(slug, updateMerchDto)
    return plainToInstance(MerchEntity, resp)
  }

  @Delete('/:slug')
  @AuthGuardDecorator()
  async deleteMerch(@Param('slug') slug: string) {
    await this.merchService.deleteMerch(slug);
  }
}
