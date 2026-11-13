'use client'

import { useTranslation } from 'react-i18next'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Mail, Share2, Globe, Sparkles } from 'lucide-react'
import { NotificationSettings } from '../types/settings.type'

interface NotificationPreferencesProps {
  settings: NotificationSettings
  onChange: (updated: Partial<NotificationSettings>) => void
}

export function NotificationPreferences({
  settings,
  onChange,
}: NotificationPreferencesProps) {
  const { t } = useTranslation()
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold">{t('settings.generated.tuyChonThongBao')}</CardTitle>
        <CardDescription className="text-xs">
          {t('settings.generated.quanLyCacLoaiThongBaoBanMuonNhan')}
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
              <Label className="text-xs font-semibold">{t('settings.generated.thongBaoQuaEmail')}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('settings.generated.nhanEmailTongHopKhiCoCapNhatQuan')}
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
              <Label className="text-xs font-semibold">{t('settings.generated.chiaSeBieuMau')}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('settings.generated.thongBaoNgayKhiCoThanhVienKhacMoi')}
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
              <Label className="text-xs font-semibold">{t('settings.generated.ketQuaXetDuyetCongDong')}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('settings.generated.thongBaoKhiBieuMauDongGopCuaBan')}
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
              <Label className="text-xs font-semibold">{t('settings.generated.capNhatHeThongTinhNangMoi')}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('settings.generated.nhanTinTucVeCacBanCapNhatMau')}
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
