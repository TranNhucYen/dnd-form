import { Metadata } from 'next'
import { Settings } from 'lucide-react'
import { AdminPageHeader } from '@/features/admin/shared/components/table/AdminPageHeader'
import { AppearanceSettings } from '@/features/settings/components/AppearanceSettings'

export const metadata: Metadata = {
  title: 'Cài đặt hệ thống - Quản trị',
  description: 'Tùy chỉnh giao diện hiển thị cho trang quản trị',
}

export default function AdminSettingsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-5 overflow-y-auto p-1 sm:p-1.5">
      <AdminPageHeader
        title="Cài đặt hệ thống"
        description="Tùy chỉnh giao diện hiển thị sáng/tối cho trang quản trị hệ thống"
        icon={<Settings className="size-4" />}
      />

      <div className="max-w-4xl w-full">
        <AppearanceSettings />
      </div>
    </div>
  )
}
