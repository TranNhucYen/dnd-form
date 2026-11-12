import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/features/admin'
import { AdminPermissionsProvider } from '@/features/admin/shared/AdminPermissionsProvider'
import { redirect } from 'next/navigation'
import { ADMIN_ENTRY_PERMISSIONS } from '@/shared/auth/permissions'
import { getUserPermissionCodes, requireAnyPermission } from '@/shared/auth/authorization'
import type { PermissionCode } from '@/shared/auth/permissions'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const principal = await requireAnyPermission(ADMIN_ENTRY_PERMISSIONS).catch(() => null)
  if (!principal) redirect('/login')

  const permissions: PermissionCode[] = await getUserPermissionCodes(principal.userId)

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AdminSidebar user={principal} permissions={permissions} />
      <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-6 overflow-hidden">
          <AdminPermissionsProvider permissions={permissions}>
            {children}
          </AdminPermissionsProvider>
        </div>
      </main>
    </SidebarProvider>
  )
}
