import type { Metadata } from 'next'
import { Detail } from '@/features/templates/components/Detail'

export const metadata: Metadata = {
  title: 'Chi tiết form mẫu',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { id } = await params
  return <Detail id={id} />
}
