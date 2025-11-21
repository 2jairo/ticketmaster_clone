import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'apps/shared2/src/dto/pagination';
import { PrismaService } from 'apps/shared2/src/prisma/prisma.service';
import { CreateMerchDto, UpdateMerchDto } from '../dto/merch';

@Injectable()
export class MerchService {
  constructor(private prismaService: PrismaService) { }

  getMerch(p: PaginationDto) {
    return this.prismaService.merch.findMany({
      skip: p.offset,
      take: p.size,
      include: {
        category: true
      }
    })
  }

  createMerch(dto: CreateMerchDto) {

  }

  updateMerch(slug: string, dto: UpdateMerchDto) {
    return this.prismaService.merch.update({
      where: { slug },
      data: {

      }
    })
  }

  deleteMerch(slug: string) {
    return this.prismaService.merch.delete({
      where: { slug }
    })
  }
}
