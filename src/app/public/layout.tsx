import type { ReactNode } from 'react'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { PublicSidebar } from '@/features/dashboard/components/PublicSidebar'
import { PublicAuthLinks } from '@/features/templates/components/PublicAuthLinks'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <PublicSidebar />
      <SidebarInset className="flex h-svh min-h-0 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-3 md:px-5">
          <SidebarTrigger />
          <PublicAuthLinks />
        </header>
        <section className="min-h-0 flex-1 overflow-auto">{children}</section>
      </SidebarInset>
    </SidebarProvider>
  )
}
