'use client'

import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Globe,
  UploadCloud,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import { ErrorAlert } from '@/shared/components'
import { useCommunity } from '../hooks/useCommunity'
import { CommunityContributions } from './CommunityContributions'
import { ContributeFormModal } from './ContributeFormModal'

export function CommunityList() {
  const { t } = useTranslation()
  const {
    contributions,
    categories,
    userForms,
    isLoading,
    error,
    submitContribution,
    refetch,
  } = useCommunity()

  const [contributeModalOpen, setContributeModalOpen] = useState(false)

  return (
    <div className="w-full mx-auto flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Globe className="size-4" />
            </div>
            <h1 className="text-xl font-bold text-foreground">{t('community.generated.khoBieuMauCongDong')}</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('community.generated.dongGopBieuMauCaNhanCuaBanVao')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="text-xs h-9 gap-1.5"
            title={t('community.generated.lamMoiDuLieu')}
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ''}`} />
            {t('community.generated.lamMoi')}
          </Button>

          <Button
            size="sm"
            onClick={() => setContributeModalOpen(true)}
            className="text-xs h-9 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <UploadCloud className="size-4" />
            {t('community.generated.dongGopBieuMau')}
          </Button>
        </div>
      </div>

      {/* Rules Banner (Quy tắc kho cộng đồng theo README) */}
      <Alert className="bg-primary/5 border-primary/20 text-foreground">
        <ShieldCheck className="size-4 text-primary" />
        <AlertTitle className="text-xs font-semibold">{t('community.generated.quyTacKhoBieuMauCongDong')}</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {t('community.generated.bieuMauChiaSeVaoCongDongDuocTao')}
        </AlertDescription>
      </Alert>

      {/* Loading & Error State */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      ) : error ? (
        <ErrorAlert error={error} onRetry={refetch} />
      ) : (
        /* Contributions and Status Table */
        <CommunityContributions
          contributions={contributions}
          onOpenContributeModal={() => setContributeModalOpen(true)}
        />
      )}

      {/* Contribute Form Modal */}
      <ContributeFormModal
        open={contributeModalOpen}
        onOpenChange={setContributeModalOpen}
        categories={categories}
        userForms={userForms}
        onSubmitContribution={submitContribution}
      />
    </div>
  )
}
