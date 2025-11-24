import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { CategoryService } from "../services/category.service";
import { AuthGuardDecorator } from "apps/shared2/src/decorators/auth-guard.decorator";
import { PaginationDefaultPageSize, PaginationDto } from "apps/shared2/src/dto/pagination";
import { plainToInstance } from "class-transformer";
import { MerchCategoryEntity } from "../entities/category.entity";
import { CreateMerchCategoryDto, UpdateMerchCategoryDto } from "../dto/category";


@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  @AuthGuardDecorator()
  async getCategories(
    @Query(new PaginationDefaultPageSize(999)) p: PaginationDto
  ) {
    const resp = await this.categoryService.getCategories(p)
    return resp.map((m) => plainToInstance(MerchCategoryEntity, m))
  }

  @Post()
  @AuthGuardDecorator()
  async createCategory(
    @Body() createCatDto: CreateMerchCategoryDto
  ) {
    const resp = await this.categoryService.createCategory(createCatDto)
    return plainToInstance(MerchCategoryEntity, resp)
  }

  @Put('/:slug')
  @AuthGuardDecorator()
  async updateCategory(
    @Param('slug') slug: string,
    @Body() updateCatDto: UpdateMerchCategoryDto
  ) {
    const resp = await this.categoryService.updateCategory(slug, updateCatDto)
    return plainToInstance(MerchCategoryEntity, resp)
  }

  @Delete('/:slug')
  @AuthGuardDecorator()
  async deleteCategory(@Param('slug') slug: string) {
    await this.categoryService.deleteCategory(slug);
  }
}