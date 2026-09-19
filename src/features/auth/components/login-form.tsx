"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/shared/constants/routes"
import { useLogin } from "../hooks/useLogin"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const { login, isLoading, error } = useLogin()
  // hàm xử lí login 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const user = await login({ email, password })
    if (user) {

      if (user.role === "super_admin" || user.role === "admin") {
        router.push(ROUTES.ADMIN_DASHBOARD)
      } else {
        router.push(ROUTES.HOME)
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-87.5 space-y-6 rounded-xl border bg-card p-6 shadow-sm">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Đăng nhập</h1>
          <p className="text-sm text-muted-foreground">Nhập email và mật khẩu của bạn để tiếp tục</p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-xs font-medium text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-9.5 px-3"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mật khẩu</label>
                <Link href="#" className="text-xs text-muted-foreground hover:underline">Quên mật khẩu?</Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-9.5 px-3"
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full h-9.5">
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Hoặc</span></div>
        </div>
        <Button variant="outline" type="button" className="w-full h-9.5">
          Google
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href={ROUTES.REGISTER} className="font-semibold text-primary hover:underline">Đăng ký</Link>
        </div>
      </div>
    </div>
  )
}
