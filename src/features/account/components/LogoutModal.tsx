'use client'

import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { LogOut, Loader2 } from 'lucide-react'
import { logoutAction } from '@/features/auth/actions/auth.action'
import { ROUTES } from '@/shared/constants/routes'

interface LogoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutModal({ open, onOpenChange }: LogoutModalProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutAction()
      queryClient.clear()
      onOpenChange(false)
      router.push(ROUTES.LOGIN)
      router.refresh()
    } catch {
      setIsLoggingOut(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'size-8 rounded-full bg-destructive/10 text-destructive',
                'flex items-center justify-center'
              )}
            >
              <LogOut className="size-4" />
            </div>
            <AlertDialogTitle className="text-base">
              {t('account.generated.xacNhanDangXuat')}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription
            className={cn(
              'text-xs leading-relaxed text-muted-foreground pt-1'
            )}
          >
            {t('account.logoutConfirmation')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoggingOut} className="text-xs">
            {t('account.generated.huy')}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirmLogout}
            disabled={isLoggingOut}
            className="text-xs"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                {t('account.generated.dangDangXuat')}
              </>
            ) : (
              t('account.signOut')
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
