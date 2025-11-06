import S from "fluent-json-schema"

export interface Pagination {
  offset: number
  size: number
}

export const paginationSchema = (pageSize: number) => {
  return S.object()
    .prop('offset', S.number().default(0))
    .prop('size', S.number().default(pageSize))
} 
  