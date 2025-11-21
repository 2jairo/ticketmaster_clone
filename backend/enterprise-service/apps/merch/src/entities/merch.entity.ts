import { Exclude, Type } from 'class-transformer';
import { IsString, IsArray, IsNotEmpty, Min, IsInt } from 'class-validator';
import { MerchCategoryEntity } from './category.entity';

export class MerchEntity {
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

  @IsArray()
  @IsString({ each: true })
  images: string[]

  @IsString()
  @IsNotEmpty()
  description: string

  @Exclude()
  @IsString()
  @IsNotEmpty()
  categoryId: string

  @Type(() => MerchCategoryEntity)
  category: MerchCategoryEntity

  @IsInt()
  @Min(0)
  stock: number

  @IsInt()
  @Min(0)
  sold: number

  @IsInt()
  @Min(0)
  price: number
}