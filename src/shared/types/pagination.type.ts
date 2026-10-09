export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
}

export interface PaginatedResult<T> {
  items: T[]
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
}
