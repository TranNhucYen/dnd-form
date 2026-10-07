import { Metadata } from 'next'
import { Table } from '@/features/admin/category'

export const metadata: Metadata = {
  title: 'Quản lý loại biểu mẫu - Quản trị hệ thống',
  description: 'Quản lý các loại và danh mục biểu mẫu trong hệ thống',
}

export default function AdminCategoriesPage() {
  return <Table />
}
