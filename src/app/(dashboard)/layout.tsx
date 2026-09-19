import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AuthUser } from "@/features/auth/types/auth.type";
import { AppSidebar } from "@/features/dashboard"
import { verifyJwtToken } from "@/lib/jwt";
import { ROUTES } from "@/shared/constants/routes";
import { UserRole } from "@/shared/types/user.type";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookiesStore = await cookies()
  const token = cookiesStore.get('auth_token')?.value;
  if (!token) return redirect(ROUTES.LOGIN);

  const user = await verifyJwtToken(token)

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  if (user.role !== UserRole.USER) {
    redirect(ROUTES.ADMIN_DASHBOARD)
  }


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