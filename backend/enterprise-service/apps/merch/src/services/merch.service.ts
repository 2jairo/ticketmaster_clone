import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'apps/shared2/src/dto/pagination';
import { PrismaService } from 'apps/shared2/src/prisma/prisma.service';
import { CreateMerchDto, UpdateMerchDto } from '../dto/merch';

@Injectable()
export class MerchService {
  constructor(private prismaService: PrismaService) { }

  async getMerch(p: PaginationDto) {
    return this.prismaService.merch.findMany({
      skip: p.offset,
      take: p.size,
      include: {
        category: true
      }
    })
  }

  async createMerch(dto: CreateMerchDto) {
    const category = await this.prismaService.merchCategory.findFirstOrThrow({
      where: { slug: dto.categorySlug }
    })

    return this.prismaService.merch.create({
      data: {
        slug: '', // auto generated,
        title: dto.title,
        description: dto.description,
        images: dto.images,
        categoryId: category.id,
        price: dto.price,
        stock: dto.stock,
      }
    })
  }

  async updateMerch(slug: string, dto: UpdateMerchDto) {
    const { categorySlug, ...rest } = dto

    const category = await this.prismaService.merchCategory.findFirstOrThrow({
      where: { slug: dto.categorySlug }
    })

    return this.prismaService.merch.update({
      where: { slug },
      data: {
        ...rest,
        categoryId: category.id
      }
    })
  }

  async deleteMerch(slug: string) {
    return this.prismaService.merch.delete({
      where: { slug }
    })
  }
}
