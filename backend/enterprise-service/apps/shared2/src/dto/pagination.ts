import { IsInt, IsOptional } from "class-validator"
import {  } from 'class-transformer'
import { ArgumentMetadata, PipeTransform } from "@nestjs/common"

export interface Pagination {
  offset: number
  size: number
}

export class PaginationDto {
  @IsInt()
  @IsOptional()
  offset: number = 0
  
  @IsInt()
  @IsOptional()
  size: number = 0
}

export class PaginationDefaultPageSize implements PipeTransform {
  constructor(private size: number) {}

  transform(value: PaginationDto, metadata: ArgumentMetadata) {
    value.size = this.size
    return value
  }
}


// export const paginationSchema = (pageSize: number) => {
//   return S.object()
//     .prop('offset', S.number().default(0))
//     .prop('size', S.number().default(pageSize))
// } 
  