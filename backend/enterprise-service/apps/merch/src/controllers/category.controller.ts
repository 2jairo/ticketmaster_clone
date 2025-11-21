import { Controller, Get, Query } from "@nestjs/common";
import { CategoryService } from "../services/category.service";
import { AuthGuardDecorator } from "apps/shared2/src/decorators/auth-guard.decorator";
import { PaginationDefaultPageSize, PaginationDto } from "apps/shared2/src/dto/pagination";
import { plainToInstance } from "class-transformer";
import { MerchCategoryEntity } from "../entities/category.entity";


@Controller('category')
export class CategoryController {
  constructor(private readonly categryService: CategoryService) {}
  
  @Get()
  @AuthGuardDecorator()
  async getMerch(
    @Query(new PaginationDefaultPageSize(50)) p: PaginationDto
  ) {
    const resp = await this.categryService.getCategories(p)
    return resp.map((m) => plainToInstance(MerchCategoryEntity, m))
  }
}