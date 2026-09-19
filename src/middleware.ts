import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJwtToken } from '@/lib/jwt'
import { ROUTES } from '@/shared/constants/routes'
import { UserRole, UserStatus } from '@/shared/types/user.type'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value
  const user = token ? await verifyJwtToken(token) : null

  if (pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL(ROUTES.LOGIN, request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)

      const response = NextResponse.redirect(loginUrl)
      if (token) {
        response.cookies.delete('auth_token')
      }
      return response
    }

    // kiểm tra trạng thái tài khoản xem active hay blocked
    if (user.status === UserStatus.BLOCKED) {
      const loginUrl = new URL(ROUTES.LOGIN, request.url)
      loginUrl.searchParams.set('error', 'blocked')

      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('auth_token')
      return response
    }
    // kiểm tra quyền để vào trang admin
    if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url))
    }
  }

  if (pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER) {
    if (user && user.status !== UserStatus.BLOCKED) {
      const target =
        user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN
          ? ROUTES.ADMIN_DASHBOARD
          : ROUTES.HOME
      return NextResponse.redirect(new URL(target, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/register'],
}
