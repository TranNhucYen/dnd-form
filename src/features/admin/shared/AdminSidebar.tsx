'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/shared/constants/routes'
import { logoutAction } from '@/features/auth/actions/auth.action'
import { LayoutDashboard, Users, ArrowLeft, LayoutTemplate, ChartBarStacked, LogOut, Loader2 } from 'lucide-react'

const adminNavItems = [
  {
    title: 'Dashboard',
    url: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: 'Quản lý người dùng',
    url: ROUTES.ADMIN_USERS,
    icon: Users,
  },
  {
    title: 'Quản lý form mẫu',
    url: ROUTES.ADMIN_TEMPLATES,
    icon: LayoutTemplate,
  },
  {
    title: 'Quản lý loại biểu mẫu',
    url: ROUTES.ADMIN_CATEGORIES,
    icon: ChartBarStacked,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutAction()
      setLogoutOpen(false)
      router.push(ROUTES.LOGIN)
      router.refresh()
    } catch {
      setIsLoggingOut(false)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center px-4 justify-between border-b">
        <Link
          href={ROUTES.ADMIN_DASHBOARD}
          className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground"
        >
          <span
            className="
              size-8 rounded-lg bg-primary flex items-center justify-center
              text-primary-foreground font-extrabold text-sm"
          >
            D
          </span>
          <span className="flex items-center gap-1.5">
            DragForm
            <Badge
              variant="outline"
              className="text-xs px-1.5 py-0 bg-primary/10 text-primary border-primary/30"
            >
              Admin
            </Badge>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2 space-y-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quản trị hệ thống
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {adminNavItems.map((item) => {
                const isActive =
                  item.url === ROUTES.ADMIN_DASHBOARD
                    ? pathname === item.url
                    : pathname === item.url || pathname.startsWith(item.url + '/')

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={item.url}
                        className={cn(
                          'flex items-center gap-3 px-3 py-6 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground',
                          isActive && 'bg-accent text-accent-foreground font-medium'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setLogoutOpen(true)}
                  className="flex items-center gap-3 px-3 py-6 rounded-md transition-colors hover:bg-destructive/10 hover:text-destructive text-muted-foreground cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <Link
          href={ROUTES.HOME}
          className="
            flex items-center gap-3 px-3 py-3 rounded-md transition-colors
            hover:bg-accent hover:text-accent-foreground text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Về trang người dùng</span>
        </Link>
      </SidebarFooter>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'size-8 rounded-full bg-destructive/10 text-destructive',
                  'flex items-center justify-center'
                )}
              >
                <LogOut className="size-4" />
              </div>
              <AlertDialogTitle className="text-base">
                Xác nhận đăng xuất
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-xs leading-relaxed text-muted-foreground pt-1">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản quản trị? Bạn sẽ cần đăng nhập lại để tiếp tục quản lý hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut} className="text-xs">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
              className="text-xs"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Đang đăng xuất...
                </>
              ) : (
                'Đăng xuất'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  )
}
