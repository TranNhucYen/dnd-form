import type { Metadata } from 'next'
import { Table } from '@/features/admin/template'

export const metadata: Metadata = {
  title: 'Quản lý form mẫu',
}

export default function AdminTemplatesPage() {
  return <Table />
}
