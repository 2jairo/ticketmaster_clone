import { Injectable } from "@nestjs/common";
import { PaginationDto } from "apps/shared2/src/dto/pagination";
import { PrismaService } from "apps/shared2/src/prisma/prisma.service";

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) { }
  
  getCategories(p: PaginationDto) {
    return this.prismaService.merchCategory.findMany({
      skip: p.offset,
      take: p.size,
    })
  }
}