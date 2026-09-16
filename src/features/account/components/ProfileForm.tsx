  'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { User, Mail, Check, Loader2, ShieldCheck } from 'lucide-react'
import { UserProfile, UpdateProfileInput } from '../types/account.type'

interface ProfileFormProps {
  initialProfile: UserProfile
  onSave: (data: UpdateProfileInput) => Promise<void>
}

export function ProfileForm({ initialProfile, onSave }: ProfileFormProps) {
  const [name, setName] = useState(initialProfile.name)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSaving(true)
    try {
      await onSave({ name: name.trim() })
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2500)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="border-border/80 shadow-xs h-full flex flex-col">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <User className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold">Thông tin cá nhân</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Cập nhật tên hiển thị liên kết với tài khoản của bạn
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <CardContent className="flex flex-col gap-4 pt-0 pb-6 flex-1">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between h-5">
              <Label
                htmlFor="fullname"
                className="text-xs font-semibold flex items-center gap-1"
              >
                <span>Họ và tên</span>
                <span className="text-destructive">*</span>
              </Label>
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="fullname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên của bạn..."
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between h-5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Địa chỉ Email
              </Label>
              <Badge
                variant="outline"
                className="text-xs font-medium text-primary border-primary/30 gap-1 py-0 h-5"
              >
                <ShieldCheck className="size-3" />
                Đã xác thực
              </Badge>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                value={initialProfile.email}
                disabled
                className={cn(
                  'pl-9 text-xs bg-muted/60 text-muted-foreground',
                  'cursor-not-allowed border-dashed'
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email dùng để đăng nhập và nhận thông báo phân quyền biểu mẫu.
            </p>
          </div>
        </CardContent>

        <CardFooter
          className={cn(
            'border-t py-3 px-6 bg-muted/20 mt-auto',
            'flex justify-between items-center'
          )}
        >
          <div>
            {savedSuccess && (
              <span
                className={cn(
                  'text-xs text-primary font-medium',
                  'flex items-center gap-1.5 animate-in fade-in'
                )}
              >
                <Check className="size-3.5" />
                Đã lưu thay đổi thành công!
              </span>
            )}
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={isSaving || !name.trim()}
            className="text-xs gap-1.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Lưu hồ sơ'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
