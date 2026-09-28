import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/features/admin'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyJwtToken } from '@/lib/jwt'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookiesStore = await cookies()
  const token = cookiesStore.get('auth_token')?.value

  if (!token) {
    redirect('/login')
  }

  // Xác thực và giải mã JWT token
  const user = await verifyJwtToken(token)

  // Nếu token không hợp lệ hoặc không có quyền admin -> đá về login
  if (!user || (user.role !== 'super_admin' && user.role !== 'admin')) {
    redirect('/login')
  }

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AdminSidebar role={user.role} />
      <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-6 overflow-hidden">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
