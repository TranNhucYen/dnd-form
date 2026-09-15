'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Settings, Save, Check, Loader2, RefreshCw } from 'lucide-react'
import { AppSettings } from '../types/settings.type'
import { AppearanceSettings } from './AppearanceSettings'
import { LocalizationSettings } from './LocalizationSettings'
import { NotificationPreferences } from './NotificationPreferences'

const DEFAULT_SETTINGS: AppSettings = {
  localization: {
    language: 'vi',
    dateFormat: 'dd/mm/yyyy',
    timezone: 'Asia/Ho_Chi_Minh',
  },
  notifications: {
    emailNotifications: true,
    formShared: true,
    communityReview: true,
    systemUpdates: false,
  },
}

export function SettingsView() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleUpdateLocalization = (updated: Partial<AppSettings['localization']>) => {
    setSettings((prev) => ({
      ...prev,
      localization: { ...prev.localization, ...updated },
    }))
  }

  const handleUpdateNotifications = (updated: Partial<AppSettings['notifications']>) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...updated },
    }))
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setIsSaving(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Settings className="size-4" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Cài đặt hệ thống</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Tùy biến giao diện, ngôn ngữ, múi giờ và cấu hình thông báo ứng dụng
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="text-xs h-9"
          >
            Khôi phục mặc định
          </Button>

          <Button
            size="sm"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="text-xs h-9 gap-1.5 font-semibold"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Đang lưu...
              </>
            ) : savedSuccess ? (
              <>
                <Check className="size-3.5" />
                Đã lưu cài đặt!
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                Lưu cài đặt
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="flex flex-col gap-6">
        {/* Section 1: Appearance */}
        <AppearanceSettings />

        {/* Section 2: Localization */}
        <LocalizationSettings
          settings={settings.localization}
          onChange={handleUpdateLocalization}
        />

        {/* Section 3: Notifications */}
        <NotificationPreferences
          settings={settings.notifications}
          onChange={handleUpdateNotifications}
        />
      </div>
    </div>
  )
}
