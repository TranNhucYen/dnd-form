'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Globe,
  UploadCloud,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'
import { useCommunity } from '../hooks/useCommunity'
import { CommunityContributions } from './CommunityContributions'
import { ContributeFormModal } from './ContributeFormModal'

export function CommunityList() {
  const {
    contributions,
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
            <h1 className="text-xl font-bold text-foreground">Kho biểu mẫu cộng đồng</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Đóng góp biểu mẫu cá nhân của bạn vào kho cộng đồng và theo dõi trạng thái xét duyệt
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={isLoading}
            className="text-xs h-9 gap-1.5"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>

          <Button
            size="sm"
            onClick={() => setContributeModalOpen(true)}
            className="text-xs h-9 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <UploadCloud className="size-4" />
            Đóng góp biểu mẫu
          </Button>
        </div>
      </div>

      {/* Rules Banner (Quy tắc kho cộng đồng theo README) */}
      <Alert className="bg-primary/5 border-primary/20 text-foreground">
        <ShieldCheck className="size-4 text-primary" />
        <AlertTitle className="text-xs font-semibold">Quy tắc kho biểu mẫu cộng đồng</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Biểu mẫu chia sẻ vào cộng đồng được tạo từ bản sao độc lập của biểu mẫu gốc và không ảnh hưởng đến dữ liệu cá nhân của bạn. Sau khi được ban quản trị xét duyệt (Approved), người dùng khác có thể sử dụng mẫu để tạo biểu mẫu mới.
        </AlertDescription>
      </Alert>

      {/* Loading & Error State */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : error ? (
        <div className="py-12 text-center flex flex-col items-center justify-center border border-destructive/30 rounded-xl bg-destructive/5 text-destructive p-6">
          <AlertCircle className="size-8 mb-2" />
          <h3 className="font-semibold text-sm">{error}</h3>
          <Button size="sm" variant="outline" onClick={refetch} className="mt-4 text-xs">
            Thử lại
          </Button>
        </div>
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
        onSubmitContribution={submitContribution}
      />
    </div>
  )
}
