export interface AdminPaginationProps {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  itemName?: string // tên loại item được nhắc đến ở ui phân trang ,vd: user, form, template, ...
}
