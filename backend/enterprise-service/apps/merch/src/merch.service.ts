import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'apps/shared2/src/dto/pagination';
import { PrismaService } from 'apps/shared2/src/prisma/prisma.service';

@Injectable()
export class MerchService {
  constructor(private prismaService: PrismaService) { }

  getMerch(p: PaginationDto) {
    return this.prismaService.merch.findMany({
      skip: p.offset,
      take: p.size
    })
  }
}
