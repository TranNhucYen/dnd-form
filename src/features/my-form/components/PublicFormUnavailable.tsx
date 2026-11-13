'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { AlertCircle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PublicFormUnavailableProps {
  title?: string
  message?: string
}

export function PublicFormUnavailable({
  title,
  message,
}: PublicFormUnavailableProps) {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-50 text-center">
      <div className="max-w-md bg-white p-8 rounded-lg shadow-sm border border-neutral-200 flex flex-col items-center gap-4">
        <div className="size-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
          <AlertCircle className="size-6" />
        </div>
        <h1 className="text-xl font-bold text-neutral-800">{title || t('myForm.unavailableTitle')}</h1>
        <p className="text-sm text-neutral-500">{message || t('myForm.unavailableMessage')}</p>
        <Button asChild variant="outline" size="sm" className="mt-2">
          <Link href="/">
            <Home className="size-4 mr-1.5" />
            {t('myForm.generated.veTrangChu')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
