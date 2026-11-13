'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/shared/constants/routes'

export function PublicAuthLinks() {
  const { t } = useTranslation()
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href={ROUTES.LOGIN}>{t('templates.generated.dangNhap')}</Link>
      </Button>
      <Button asChild size="sm">
        <Link href={ROUTES.REGISTER}>{t('templates.generated.dangKy')}</Link>
      </Button>
    </div>
  )
}
