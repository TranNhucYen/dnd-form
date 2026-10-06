'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  FilePlus,
  LayoutTemplate,
  Users,
  ArrowRight,
  FileText,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/shared/constants/routes'
import { createBlankFormAction } from '@/features/my-form/actions/my-form.action'
import { CreateFormModal } from '@/features/my-form/components/CreateFormModal'
import { Card as TemplateCard, CardSkeleton as TemplateCardSkeleton } from '@/features/templates/components/Card'
import type { CreateBlankFormInput, MyForm } from '@/features/my-form/types/my-form.type'
import { useHomeData } from '../hooks/useHomeData'
import { RecentFormCard, RecentFormCardSkeleton } from './RecentFormCard'
import { QuickActionCard } from './QuickActionCard'

interface HomeViewProps {
  user: {
    fullName?: string
    email?: string
  } | null
}

export function HomeView({ user }: HomeViewProps) {
  const { recentForms, featuredTemplates, totalFormsCount, isLoading } = useHomeData()
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const displayName = user?.fullName || 'bạn'

  const handleCreateBlank = async (data: CreateBlankFormInput): Promise<MyForm> => {
    const res = await createBlankFormAction(data)
    if (!res.success) {
      throw new Error(res.error)
    }
    return res.data
  }

  return (
    <div className="w-full mx-auto flex flex-col gap-8 pb-12">
      {/* 1. Welcome & Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 text-xs font-semibold bg-primary/15 text-primary border-transparent">
                <Sparkles className="size-3" />
                DragForm
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Xin chào, {displayName} 👋
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bắt đầu thiết kế biểu mẫu in ấn chuyên nghiệp hoặc tiếp tục hoàn thiện các dự án đang làm dở của bạn.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="gap-2 text-sm font-semibold shadow-xs cursor-pointer h-10 px-5"
            >
              <Plus className="size-4" />
              Tạo biểu mẫu mới
            </Button>
            <Link href={ROUTES.TEMPLATES}>
              <Button
                variant="outline"
                className="gap-2 text-sm font-semibold cursor-pointer h-10 px-4 bg-background/80 hover:bg-background"
              >
                <LayoutTemplate className="size-4" />
                Khám phá mẫu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Quick Starters Grid */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Bắt đầu nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Tạo biểu mẫu trống"
            description="Bắt đầu từ trang trắng khổ giấy A4 tiêu chuẩn và kéo thả tùy ý."
            icon={FilePlus}
            iconBgClassName="bg-emerald-500/10"
            iconColorClassName="text-emerald-600 dark:text-emerald-400"
            actionLabel="Tạo ngay"
            onClick={() => setCreateModalOpen(true)}
          />
          <QuickActionCard
            title="Sử dụng mẫu sẵn"
            description="Lựa chọn từ các mẫu biểu mẫu thông dụng đã chuẩn hóa quy chuẩn in ấn."
            icon={LayoutTemplate}
            iconBgClassName="bg-blue-500/10"
            iconColorClassName="text-blue-600 dark:text-blue-400"
            actionLabel="Xem kho mẫu"
            href={ROUTES.TEMPLATES}
          />
          <QuickActionCard
            title="Đóng góp cộng đồng"
            description="Chia sẻ các biểu mẫu hữu ích của bạn để mọi người cùng sử dụng."
            icon={Users}
            iconBgClassName="bg-purple-500/10"
            iconColorClassName="text-purple-600 dark:text-purple-400"
            actionLabel="Khám phá"
            href={ROUTES.COMMUNITY}
          />
        </div>
      </section>

      {/* 3. Recent Forms Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">Biểu mẫu gần đây</h2>
            {totalFormsCount > 0 ? (
              <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5">
                {totalFormsCount}
              </Badge>
            ) : null}
          </div>
          <Link
            href={ROUTES.MY_FORM}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Xem tất cả
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <RecentFormCardSkeleton key={i} />
            ))}
          </div>
        ) : recentForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-card border border-dashed border-border rounded-xl text-center gap-3">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <FileText className="size-6" />
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="font-semibold text-sm text-foreground">Bạn chưa có biểu mẫu nào</h3>
              <p className="text-xs text-muted-foreground">
                Hãy bắt đầu tạo biểu mẫu đầu tiên hoặc chọn một mẫu từ thư viện để tiết kiệm thời gian.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="gap-1.5 text-xs font-semibold mt-1 cursor-pointer"
            >
              <Plus className="size-3.5" />
              Tạo biểu mẫu đầu tiên
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentForms.map((form) => (
              <RecentFormCard key={form.id} form={form} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Featured Templates Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-bold text-foreground">Mẫu biểu mẫu nổi bật</h2>
            <p className="text-xs text-muted-foreground">
              Các mẫu được thiết kế sẵn theo quy chuẩn in ấn tối ưu
            </p>
          </div>
          <Link
            href={ROUTES.TEMPLATES}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Khám phá kho mẫu
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <TemplateCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </section>

      {/* Modal tạo biểu mẫu mới */}
      <CreateFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreateBlank={handleCreateBlank}
      />
    </div>
  )
}
