import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/features/admin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AdminSidebar />
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
