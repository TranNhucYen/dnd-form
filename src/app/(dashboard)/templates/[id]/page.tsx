import { TemplateDetail } from "@/features/templates/components/TemplateDetail"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { id } = await params
  return <TemplateDetail id={id} />
}
