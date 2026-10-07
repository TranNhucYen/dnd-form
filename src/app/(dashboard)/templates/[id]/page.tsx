import { Detail } from '@/features/templates/components/Detail'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { id } = await params
  return <Detail id={id} />
}
