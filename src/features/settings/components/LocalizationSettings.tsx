'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Languages, Clock, Calendar } from 'lucide-react'
import { LocalizationSettings as ILocalizationSettings } from '../types/settings.type'

interface LocalizationSettingsProps {
  settings: ILocalizationSettings
  onChange: (updated: Partial<ILocalizationSettings>) => void
}

export function LocalizationSettings({
  settings,
  onChange,
}: LocalizationSettingsProps) {
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold">Cá nhân hóa & Ngôn ngữ</CardTitle>
        <CardDescription className="text-xs">
          Thiết lập ngôn ngữ giao diện, định dạng hiển thị ngày giờ và múi giờ làm việc
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* Language Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Languages className="size-4" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Ngôn ngữ hiển thị (Language)</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Chọn ngôn ngữ sử dụng cho toàn bộ giao diện DragForm
              </p>
            </div>
          </div>

          <Select
            value={settings.language}
            onValueChange={(val: 'vi' | 'en') => onChange({ language: val })}
          >
            <SelectTrigger className="w-full sm:w-48 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vi" className="text-xs">
                Tiếng Việt (Mặc định)
              </SelectItem>
              <SelectItem value="en" className="text-xs">
                English (US)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Format */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="size-4" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Định dạng ngày tháng</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kiểu hiển thị thời gian trong danh sách biểu mẫu và báo cáo
              </p>
            </div>
          </div>

          <Select
            value={settings.dateFormat}
            onValueChange={(val: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd') =>
              onChange({ dateFormat: val })
            }
          >
            <SelectTrigger className="w-full sm:w-48 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dd/mm/yyyy" className="text-xs">
                dd/mm/yyyy (21/08/2026)
              </SelectItem>
              <SelectItem value="mm/dd/yyyy" className="text-xs">
                mm/dd/yyyy (08/21/2026)
              </SelectItem>
              <SelectItem value="yyyy-mm-dd" className="text-xs">
                yyyy-mm-dd (2026-08-21)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Timezone */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="size-4" />
            </div>
            <div>
              <Label className="text-xs font-semibold">Múi giờ (Timezone)</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Múi giờ dùng để ghi nhận thời điểm gửi phản hồi và tạo biểu mẫu
              </p>
            </div>
          </div>

          <Select
            value={settings.timezone}
            onValueChange={(val) => onChange({ timezone: val })}
          >
            <SelectTrigger className="w-full sm:w-48 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Ho_Chi_Minh" className="text-xs">
                GMT+07:00 (Hà Nội, TP.HCM)
              </SelectItem>
              <SelectItem value="UTC" className="text-xs">
                GMT+00:00 (UTC)
              </SelectItem>
              <SelectItem value="America/New_York" className="text-xs">
                GMT-05:00 (New York)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
