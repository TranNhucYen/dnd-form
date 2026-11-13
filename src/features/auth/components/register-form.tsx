"use client"

import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/shared/constants/routes"
import { useRegister } from "../hooks/useRegister"

export function RegisterForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const { register, isLoading, error } = useRegister()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    const user = await register(formData)
    if (user) {
      router.push(ROUTES.HOME)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-87.5 space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{t('auth.generated.taoTaiKhoan')}</h1>
          <div className="flex items-center justify-center gap-1.5 py-1">
            <Image
              src="/icon.svg"
              alt="Logo Dnd Form"
              width={20}
              height={20}
              className="size-5 rounded-sm"
            />
            <span className="text-sm font-semibold tracking-tight">Dnd Form</span>
          </div>
          <p className="text-sm text-muted-foreground">{t('auth.generated.nhapThongTinBenDuoiDeTaoTaiKhoan')}</p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-xs font-medium text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('auth.generated.hoVaTen')}</label>
              <Input
                type="text"
                name="fullName"
                placeholder={t('auth.generated.nguyenVanA')}
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="h-9.5 px-3"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                name="email"
                placeholder={t('auth.emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="h-9.5 px-3"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('auth.generated.matKhau')}</label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="h-9.5 px-3"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('auth.generated.xacNhanMatKhau')}</label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="h-9.5 px-3"
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full h-9.5">
            {isLoading ? t('auth.generated.dangXuLy') : t('auth.generated.dangKy')}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">{t('auth.generated.hoac')}</span></div>
        </div>
        <Button variant="outline" type="button" className="w-full h-9.5">
          Google
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          {t('auth.generated.daCoTaiKhoan')}{" "}
          <Link href={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">{t('auth.generated.dangNhap')}</Link>
        </div>
      </div>
    </div>
  )
}
