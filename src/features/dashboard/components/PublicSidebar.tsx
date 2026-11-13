'use client'

import { useTranslation } from 'react-i18next'
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

export function PublicSidebar() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const publicItems = [
    { href: ROUTES.PUBLIC_TEMPLATES, label: t('dashboard.templates'), icon: LayoutTemplate },
    { href: ROUTES.PUBLIC_BUILDER, label: t('dashboard.builder'), icon: PanelsTopLeft },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href={ROUTES.PUBLIC_TEMPLATES} className="flex items-center gap-2 px-2 py-1.5">
          <Image src="/icon.svg" alt="Logo Dnd Form" width={24} height={24} className="size-6 rounded-sm" />
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
