import type { Metadata } from 'next'
import { AdminDashboardView } from '@/features/admin'

export const metadata: Metadata = {
  title: 'Dashboard Quản trị',
}

export default function AdminDashboardPage() {
  return <AdminDashboardView />
}
