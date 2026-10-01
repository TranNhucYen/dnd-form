import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { myFormService } from '@/features/my-form/services/my-form.service'
import { PublicFormViewer } from '@/features/my-form/components/PublicFormViewer'
import { PublicFormUnavailable } from '@/features/my-form/components/PublicFormUnavailable'

interface PublicSharePageProps {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: PublicSharePageProps): Promise<Metadata> {
  const { token } = await params
  if (!token) return { title: 'Biểu mẫu chia sẻ' }

  try {
    const formDetail = await myFormService.getPublicFormByToken(token)
    if (!formDetail) {
      return { title: 'Biểu mẫu không tìm thấy' }
    }
    return {
      title: `${formDetail.name} | DragForm`,
      description: formDetail.description || 'Xem biểu mẫu chia sẻ',
    }
  } catch {
    return { title: 'Biểu mẫu chia sẻ' }
  }
}

export default async function PublicSharePage({
  params,
}: PublicSharePageProps) {
  const { token } = await params
  if (!token) {
    notFound()
  }

  const formDetail = await myFormService.getPublicFormByToken(token)

  if (!formDetail) {
    return <PublicFormUnavailable />
  }

  return <PublicFormViewer form={formDetail} />
}
