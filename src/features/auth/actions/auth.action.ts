'use server'

import { cookies } from "next/headers"
import { authService } from "../services/auth.service"
import { ActionResponse, AuthUser, UserLogin, UserRegister } from "../types/auth.type"
import { signJwtToken } from "@/lib/jwt"
import { handleActionError } from "@/shared/utils/action.util"

export async function loginAction(user: UserLogin): Promise<ActionResponse<AuthUser>> {
  try {
    const authUser = await authService.login(user)
    const token = await signJwtToken(authUser)

    const cookieStore = await cookies()
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return {
      success: true,
      data: authUser,
    }
  } catch (error) {
    return handleActionError(error, 'loginAction')
  }
}

export async function registerAction(user: UserRegister): Promise<ActionResponse<AuthUser>> {
  try {
    const authUser = await authService.register(user)
    const token = await signJwtToken(authUser)

    const cookieStore = await cookies()
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return {
      success: true,
      data: authUser,
    }
  } catch (error) {
    return handleActionError(error, 'registerAction')
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}
