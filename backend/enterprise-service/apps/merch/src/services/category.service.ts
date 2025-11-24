import { Injectable } from "@nestjs/common";
import { PaginationDto } from "apps/shared2/src/dto/pagination";
import { PrismaService } from "apps/shared2/src/prisma/prisma.service";
import { CreateMerchCategoryDto, UpdateMerchCategoryDto } from "../dto/category";

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) { }
  
  async getCategories(p: PaginationDto) {
    return this.prismaService.c.merchCategory.findMany({
      skip: p.offset,
      take: p.size,
    })
  }

  async createCategory(dto: CreateMerchCategoryDto) {
    return this.prismaService.c.merchCategory.create({
      data: {
        slug: '',
        title: dto.title,
        image: dto.image
      }
    })
  }

  async updateCategory(slug: string, dto: UpdateMerchCategoryDto) {
    return this.prismaService.c.merchCategory.update({
      where: { slug },
      data: {
        title: dto.title,
        image: dto.image,
      }
    })
  }

  async deleteCategory(slug: string) {
    return this.prismaService.c.merchCategory.delete({
      where: { slug }
    })
  }
}