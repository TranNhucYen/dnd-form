'use client'

import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { PermissionCode } from '@/shared/auth/permissions'

const AdminPermissionsContext = createContext<ReadonlySet<PermissionCode>>(new Set())

export function AdminPermissionsProvider({
  permissions,
  children,
}: {
  permissions: PermissionCode[]
  children: ReactNode
}) {
  const permissionSet = useMemo(() => new Set(permissions), [permissions])
  return (
    <AdminPermissionsContext.Provider value={permissionSet}>
      {children}
    </AdminPermissionsContext.Provider>
  )
}

export function useAdminPermission(permission: PermissionCode): boolean {
  return useContext(AdminPermissionsContext).has(permission)
}
