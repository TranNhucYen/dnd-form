import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ROUTES } from '@/shared/constants/routes'
import { requireAuthenticatedUser, hasPermissionForUser } from '@/shared/auth/authorization'
import { PERMISSIONS } from '@/shared/auth/permissions'
import { UserTable } from '@/features/admin/user'

export const metadata: Metadata = {
  title: 'Quản lý người dùng',
}

export default async function AdminUsersPage() {
  const user = await requireAuthenticatedUser().catch(() => null)
  if (!user || !(await hasPermissionForUser(user.userId, PERMISSIONS.user.read))) {
    redirect(ROUTES.ADMIN_DASHBOARD)
  }

  return <UserTable />
}
