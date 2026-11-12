import 'server-only'

import { and, eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { db } from '@/db'
import { permission, rolePermission, user } from '@/db/schema'
import { verifyJwtToken } from '@/lib/jwt'
import { AccountBlockedError, ForbiddenError, UnauthorizedError } from '@/shared/errors'
import type { PermissionCode } from './permissions'

export interface AuthenticatedPrincipal {
  userId: number
  fullName: string
  email: string
}

export async function requireAuthenticatedUser(): Promise<AuthenticatedPrincipal> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) throw new UnauthorizedError()

  const session = await verifyJwtToken(token)
  if (!session?.id) throw new UnauthorizedError('Phiên đăng nhập không hợp lệ hoặc đã hết hạn')

  const [principal] = await db
    .select({
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      status: user.status,
    })
    .from(user)
    .where(eq(user.id, session.id))
    .limit(1)

  if (!principal) throw new UnauthorizedError('Tài khoản không còn tồn tại')
  if (principal.status === 'blocked') {
    cookieStore.delete('auth_token')
    throw new AccountBlockedError()
  }

  return {
    userId: principal.userId,
    fullName: principal.fullName,
    email: principal.email,
  }
}

export async function hasPermissionForUser(
  userId: number,
  permissionCode: PermissionCode,
): Promise<boolean> {
  const [grant] = await db
    .select({ permissionId: permission.id })
    .from(user)
    .innerJoin(rolePermission, eq(user.roleId, rolePermission.roleId))
    .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
    .where(
      and(
        eq(user.id, userId),
        eq(user.status, 'active'),
        eq(permission.permissionCode, permissionCode),
      ),
    )
    .limit(1)

  return Boolean(grant)
}

export async function getUserPermissionCodes(userId: number): Promise<PermissionCode[]> {
  const grants = await db
    .select({ permissionCode: permission.permissionCode })
    .from(user)
    .innerJoin(rolePermission, eq(user.roleId, rolePermission.roleId))
    .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
    .where(and(eq(user.id, userId), eq(user.status, 'active')))

  return grants.map((grant) => grant.permissionCode as PermissionCode)
}

export async function requirePermission(
  permissionCode: PermissionCode,
): Promise<AuthenticatedPrincipal> {
  const principal = await requireAuthenticatedUser()
  if (!(await hasPermissionForUser(principal.userId, permissionCode))) {
    throw new ForbiddenError(`Bạn không có quyền ${permissionCode}`)
  }
  return principal
}

export async function requireAnyPermission(
  permissionCodes: readonly PermissionCode[],
): Promise<AuthenticatedPrincipal> {
  const principal = await requireAuthenticatedUser()
  const granted = await getUserPermissionCodes(principal.userId)
  if (!permissionCodes.some((code) => granted.includes(code))) {
    throw new ForbiddenError('Bạn không có quyền truy cập khu vực quản trị')
  }
  return principal
}
