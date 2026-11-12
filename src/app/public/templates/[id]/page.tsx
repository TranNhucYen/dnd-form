import type { Metadata } from 'next'
import { Detail } from '@/features/templates/components/Detail'

export const metadata: Metadata = { title: 'Xem form mẫu' }

interface PublicTemplatePageProps {
  params: Promise<{ id: string }>
}

export default async function PublicTemplatePage({ params }: PublicTemplatePageProps) {
  const { id } = await params
  return (
    <div className="p-4 md:p-6">
      <Detail id={id} publicView />
    </div>
  )
}
