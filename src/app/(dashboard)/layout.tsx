import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/features/dashboard"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <SidebarTrigger />
        <div className="p-6">{children}</div> 
      </main>
    </SidebarProvider>
  )
}