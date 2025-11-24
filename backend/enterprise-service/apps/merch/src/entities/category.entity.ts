import { Exclude } from "class-transformer"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class MerchCategoryEntity {
  @Exclude()
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  slug: string

  @IsString()
  @IsNotEmpty()
  image: string

  @IsOptional()
  _count?: {
    products: number
  }
}
