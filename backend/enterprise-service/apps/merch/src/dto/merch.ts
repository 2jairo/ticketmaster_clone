import { Type } from 'class-transformer'
import { IsArray, ArrayNotEmpty, IsString, IsNotEmpty, IsInt, Min, IsNumber, IsOptional } from 'class-validator'

export class CreateMerchDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsArray()
  @IsString({ each: true })
  images: string[] = ['https://static.productionready.io/images/smiley-cyrus.jpg']

  @IsString()
  @IsOptional()
  description: string = ''

  @IsString()
  @IsNotEmpty()
  categorySlug: string

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number = 0

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number = 0
}


export class UpdateMerchDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  images: string[]

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  categorySlug: string

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  stock: number

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  price: number
}