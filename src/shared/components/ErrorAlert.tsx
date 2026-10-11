import * as React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ErrorAlertProps {
  error: string | null
  title?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorAlert({
  error,
  title = 'Đã có lỗi xảy ra',
  onRetry,
  retryLabel = 'Thử lại',
  className,
}: ErrorAlertProps) {
  if (!error) return null

  return (
    <Alert variant="destructive" className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-2">
        <AlertCircle className="size-4 shrink-0" />
        <div>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </div>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="cursor-pointer text-xs shrink-0 gap-1.5"
        >
          <RefreshCw className="size-3.5" data-icon="inline-start" />
          <span>{retryLabel}</span>
        </Button>
      )}
    </Alert>
  )
}
