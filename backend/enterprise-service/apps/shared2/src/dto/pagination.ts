import { IsInt, IsOptional } from "class-validator"
import { Type } from 'class-transformer'
import { ArgumentMetadata, PipeTransform } from "@nestjs/common"

export interface Pagination {
  offset: number
  size: number
}

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  offset: number = 0

  @Type(() => Number)
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
  