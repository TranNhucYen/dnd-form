'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutTemplate, PanelsTopLeft } from 'lucide-react'
import { ROUTES } from '@/shared/constants/routes'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const publicItems = [
  { href: ROUTES.PUBLIC_TEMPLATES, label: 'Form mẫu', icon: LayoutTemplate },
  { href: ROUTES.PUBLIC_BUILDER, label: 'Form Builder', icon: PanelsTopLeft },
]

export function PublicSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href={ROUTES.PUBLIC_TEMPLATES} className="flex items-center gap-2 px-2 py-1.5">
          <Image src="/icon.svg" alt="Dnd Form" width={24} height={24} className="size-6 rounded-sm" />
          <span className="font-semibold group-data-[collapsible=icon]:hidden">Dnd Form</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {publicItems.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === href || pathname.startsWith(`${href}/`)}
                >
                  <Link href={href} title={label} aria-label={label}>
                    <Icon />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
