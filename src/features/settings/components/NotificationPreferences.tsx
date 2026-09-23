'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Bell, Mail, Share2, Globe, Sparkles } from 'lucide-react'
import { NotificationSettings } from '../types/settings.type'

interface NotificationPreferencesProps {
  settings: NotificationSettings
  onChange: (updated: Partial<NotificationSettings>) => void
}

export function NotificationPreferences({
  settings,
  onChange,
}: NotificationPreferencesProps) {
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold">Tùy chọn thông báo</CardTitle>
        <CardDescription className="text-xs">
          Quản lý các loại thông báo bạn muốn nhận trên hệ thống và qua email
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* Email Digest */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="size-4" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Thông báo qua Email</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Nhận email tổng hợp khi có cập nhật quan trọng hoặc biểu mẫu được chia sẻ
              </p>
            </div>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => onChange({ emailNotifications: checked })}
          />
        </div>

        {/* Form Share notification */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
              <Share2 className="size-4" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Chia sẻ biểu mẫu</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Thông báo ngay khi có thành viên khác mời bạn cộng tác hoặc chỉnh sửa biểu mẫu
              </p>
            </div>
          </div>
          <Switch
            checked={settings.formShared}
            onCheckedChange={(checked) => onChange({ formShared: checked })}
          />
        </div>

        {/* Community Review notification */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <Globe className="size-4" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Kết quả xét duyệt cộng đồng</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Thông báo khi biểu mẫu đóng góp của bạn được phê duyệt hoặc cần chỉnh sửa
              </p>
            </div>
          </div>
          <Switch
            checked={settings.communityReview}
            onCheckedChange={(checked) => onChange({ communityReview: checked })}
          />
        </div>

        {/* System updates notification */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="size-4" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Cập nhật hệ thống & Tính năng mới</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Nhận tin tức về các bản cập nhật, mẫu thiết kế mới và mẹo sử dụng DragForm
              </p>
            </div>
          </div>
          <Switch
            checked={settings.systemUpdates}
            onCheckedChange={(checked) => onChange({ systemUpdates: checked })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
