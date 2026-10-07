"use client"

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
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { mainNavItems, personalNavItems } from "@/shared/config/nav"
import { ROUTES } from "@/shared/constants/routes"
import { AuthUser } from "@/features/auth/types/auth.type"

interface AppSidebarProps {
  user?: Partial<AuthUser> | null
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()

  const displayName = user?.fullName?.trim() || "Người dùng"
  const displayEmail = user?.email?.trim() || ""

  const initials = (user?.fullName || "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U"

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center px-4 justify-start border-b">
        <Link href="/home" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <span className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-sm">D</span>
          DragForm
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2 space-y-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ứng dụng</SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-6 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-accent text-accent-foreground font-medium"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cá nhân</SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {personalNavItems.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-6 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-accent text-accent-foreground font-medium"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <Link
          href={ROUTES.ACCOUNT}
          className="flex items-center gap-3 p-1 -m-1 rounded-md transition-colors hover:bg-accent group"
        >
          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
            {initials}
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-sm font-semibold truncate leading-none group-hover:text-primary transition-colors">
              {displayName}
            </p>
            {displayEmail && (
              <p className="text-xs text-muted-foreground truncate mt-1">
                {displayEmail}
              </p>
            )}
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}



