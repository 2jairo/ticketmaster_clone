import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMerchCategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  @IsString()
  image: string
}

export class UpdateMerchCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  image: string
}