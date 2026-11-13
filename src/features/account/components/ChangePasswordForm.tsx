'use client'

import { useTranslation } from 'react-i18next'
import { useState, useMemo } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  KeyRound,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
} from 'lucide-react'
import { ChangePasswordInput } from '../types/account.type'

interface ChangePasswordFormProps {
  onChangePassword: (data: ChangePasswordInput) => Promise<void>
}

export function ChangePasswordForm({ onChangePassword }: ChangePasswordFormProps) {
  const { t } = useTranslation()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Password Strength Calculation
  const strength = useMemo(() => {
    if (!newPassword) return { score: 0, label: '', color: 'bg-muted', text: '' }
    let score = 0
    if (newPassword.length >= 6) score += 1
    if (newPassword.length >= 8) score += 1
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score += 1
    if (/[0-9]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword)) score += 1

    if (score <= 1) {
      return { score: 1, label: t('account.generated.yeu'), color: 'bg-destructive', text: 'text-destructive' }
    }
    if (score <= 3) {
      return { score: 2, label: t('account.generated.trungBinh'), color: 'bg-primary/60', text: 'text-muted-foreground' }
    }
    return { score: 3, label: t('account.generated.manh'), color: 'bg-primary', text: 'text-primary' }
  }, [newPassword, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (newPassword.length < 6) {
      setErrorMessage(t('account.generated.matKhauMoiPhaiCoToiThieu6Ky'))
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t('account.generated.xacNhanMatKhauMoiKhongKhop'))
      return
    }

    setIsSubmitting(true)
    try {
      await onChangePassword({ currentPassword, newPassword, confirmPassword })
      setSuccessMessage(t('account.generated.doiMatKhauThanhCongSuDungMatKhau'))
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSuccessMessage(null), 4000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('account.generated.khongTheDoiMatKhau')
      setErrorMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border/80 shadow-xs h-full flex flex-col">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <KeyRound className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold">{t('account.generated.doiMatKhau')}</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              {t('account.generated.capNhatMatKhauDinhKyDeBaoVe')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <CardContent className="flex flex-col gap-4 pt-0 pb-6 flex-1">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription className="text-xs">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert>
              <CheckCircle2 className="size-4 text-primary" />
              <AlertDescription className="text-xs text-foreground">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Current Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between h-5">
              <Label
                htmlFor="current-pwd"
                className="text-xs font-semibold flex items-center gap-1"
              >
                <span>{t('account.generated.matKhauHienTai')}</span>
                <span className="text-destructive">*</span>
              </Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="current-pwd"
                type={showCurrent ? "text" : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 pr-9 text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  'text-muted-foreground hover:text-foreground transition-colors'
                )}
                title={showCurrent ? t('account.generated.anMatKhau') : t('account.generated.hienMatKhau')}
              >
                {showCurrent ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between h-5">
              <Label
                htmlFor="new-pwd"
                className="text-xs font-semibold flex items-center gap-1"
              >
                <span>{t('account.generated.matKhauMoi')}</span>
                <span className="text-destructive">*</span>
              </Label>
              {strength.label && (
                <span className={cn('text-xs font-semibold', strength.text)}>
                  {t('account.generated.doManh')} {strength.label}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="new-pwd"
                type={showNew ? "text" : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('account.generated.toiThieu6KyTu')}
                className="pl-9 pr-9 text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  'text-muted-foreground hover:text-foreground transition-colors'
                )}
                title={showNew ? t('account.generated.anMatKhau') : t('account.generated.hienMatKhau')}
              >
                {showNew ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </button>
            </div>

            {/* Password Strength Bar */}
            {newPassword && (
              <div className="flex items-center gap-1.5 mt-1">
                <div
                  className={cn(
                    'h-1 flex-1 rounded-full',
                    strength.score >= 1 ? strength.color : 'bg-muted'
                  )}
                />
                <div
                  className={cn(
                    'h-1 flex-1 rounded-full',
                    strength.score >= 2 ? strength.color : 'bg-muted'
                  )}
                />
                <div
                  className={cn(
                    'h-1 flex-1 rounded-full',
                    strength.score >= 3 ? strength.color : 'bg-muted'
                  )}
                />
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {t('account.generated.matKhauManhLaMatKhauCoToiThieu')}
            </p>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between h-5">
              <Label
                htmlFor="confirm-pwd"
                className="text-xs font-semibold flex items-center gap-1"
              >
                <span>{t('account.generated.xacNhanMatKhauMoi')}</span>
                <span className="text-destructive">*</span>
              </Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="confirm-pwd"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('account.generated.nhapLaiMatKhauMoi')}
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t py-3 px-6 flex justify-end bg-muted/20 mt-auto">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !currentPassword || !newPassword || !confirmPassword}
            className="text-xs gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                {t('account.generated.dangXuLy')}
              </>
            ) : (
              t('account.updatePassword')
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
