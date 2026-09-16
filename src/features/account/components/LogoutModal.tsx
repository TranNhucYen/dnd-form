'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

interface LogoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutModal({ open, onOpenChange }: LogoutModalProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleConfirmLogout = () => {
    setIsLoggingOut(true)
    setTimeout(() => {
      onOpenChange(false)
      router.push('/login')
    }, 600)
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
              Xác nhận đăng xuất
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription
            className={cn(
              'text-xs leading-relaxed text-muted-foreground pt-1'
            )}
          >
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản DragForm trên thiết bị này? 
            Bạn sẽ cần đăng nhập lại để tiếp tục chỉnh sửa biểu mẫu.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoggingOut} className="text-xs">
            Hủy
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
                Đang đăng xuất...
              </>
            ) : (
              'Đăng xuất'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
