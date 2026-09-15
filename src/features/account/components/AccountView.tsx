'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  LogOut,
  Mail,
  Calendar,
  Camera,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Globe,
} from 'lucide-react'
import {
  UserProfile,
  UpdateProfileInput,
  ChangePasswordInput,
} from '../types/account.type'
import { ProfileForm } from './ProfileForm'
import { ChangePasswordForm } from './ChangePasswordForm'
import { LogoutModal } from './LogoutModal'

const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-101',
  name: 'Trần Nhực Yên',
  email: 'yen.tran@dragform.io',
  role: 'Quản trị viên (Admin)',
  joinedAt: '15/07/2026',
}

export function AccountView() {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  const handleUpdateProfile = async (data: UpdateProfileInput) => {
    // Simulate save
    await new Promise((r) => setTimeout(r, 600))
    setProfile((prev) => ({ ...prev, ...data }))
  }

  const handleChangePassword = async (data: ChangePasswordInput) => {
    // Simulate password change
    await new Promise((r) => setTimeout(r, 800))
    if (data.currentPassword !== '123456') {
      throw new Error('Mật khẩu hiện tại không chính xác (mật khẩu mẫu: 123456).')
    }
  }

  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5">
        <div className="flex items-center gap-4">
          {/* Avatar with Camera Trigger */}
          <div className="relative group">
            <Avatar className="size-16 sm:size-18 border-2 border-primary/20 shadow-xs">
              <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className={cn(
                'absolute -bottom-0.5 -right-0.5 p-1.5 rounded-full',
                'bg-primary text-primary-foreground shadow-sm',
                'hover:scale-105 transition-transform cursor-pointer'
              )}
              title="Thay đổi ảnh đại diện"
            >
              <Camera className="size-3" />
            </button>
          </div>

          {/* Names & Metadata */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {profile.name}
              </h1>
              <Badge
                variant="secondary"
                className="text-xs font-semibold bg-primary/10 text-primary border-primary/20"
              >
                {profile.role}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5" />
                {profile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Gia nhập {profile.joinedAt}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-center">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground flex items-center gap-1">
              <FileSpreadsheet className="size-3.5 text-primary" />
              12
            </span>
            <span className="text-xs text-muted-foreground">Biểu mẫu</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground flex items-center gap-1">
              <Globe className="size-3.5 text-primary" />
              3
            </span>
            <span className="text-xs text-muted-foreground">Đóng góp</span>
          </div>
        </div>
      </div>

      {/* Row: Profile Information & Change Password (2 Columns) */}
      <div
        className={cn(
          'grid grid-cols-1 lg:grid-cols-2 gap-6',
          'items-stretch'
        )}
      >
        <ProfileForm initialProfile={profile} onSave={handleUpdateProfile} />
        <ChangePasswordForm onChangePassword={handleChangePassword} />
      </div>

      {/* Block 2: Account Status */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold">Trạng thái tài khoản</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Thông tin phân quyền và trạng thái hoạt động tài khoản
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border bg-muted/20 flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs">Trạng thái hoạt động</span>
              <div className="flex items-center">
                <Badge
                  variant="outline"
                  className="gap-1 border-primary/30 text-primary font-medium"
                >
                  <CheckCircle2 className="size-3" />
                  Đang hoạt động
                </Badge>
              </div>
            </div>

            <div className="p-3 rounded-lg border bg-muted/20 flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs">Xác thực email</span>
              <div className="flex items-center">
                <Badge
                  variant="outline"
                  className="gap-1 border-primary/30 text-primary font-medium"
                >
                  <CheckCircle2 className="size-3" />
                  Chính chủ
                </Badge>
              </div>
            </div>

            <div className="p-3 rounded-lg border bg-muted/20 flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs">Phân quyền</span>
              <span className="font-semibold text-foreground">
                {profile.role}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Block 4: Logout */}
      <Card className="border-border/80 shadow-xs border-destructive/20">
        <CardHeader className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-md bg-destructive/10 text-destructive flex items-center justify-center">
                <LogOut className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-foreground">Đăng xuất</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Đăng xuất khỏi phiên làm việc hiện tại trên thiết bị này
                </CardDescription>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setLogoutModalOpen(true)}
              className="text-xs gap-1.5 self-start sm:self-center shrink-0"
            >
              <LogOut className="size-3.5" />
              Đăng xuất
            </Button>
          </div>
        </CardHeader>
      </Card>

      <LogoutModal open={logoutModalOpen} onOpenChange={setLogoutModalOpen} />
    </div>
  )
}
