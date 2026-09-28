import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJwtToken } from '@/lib/jwt'
import { ROUTES } from '@/shared/constants/routes'
import { UserRole } from '@/shared/types/user.type'
import { UserTable } from '@/features/admin/user'

export default async function AdminUsersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  const user = token ? await verifyJwtToken(token) : null

  if (!user || user.role !== UserRole.SUPER_ADMIN) {
    redirect(ROUTES.ADMIN_DASHBOARD)
  }

  return <UserTable />
}
