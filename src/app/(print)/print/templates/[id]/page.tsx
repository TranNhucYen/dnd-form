import { notFound } from 'next/navigation';
import { templateRepository } from '@/features/templates/repositories';
import { PrintCanvas } from '@/features/form-builder/print/PrintCanvas';

interface PrintTemplatePageProps {
  params: Promise<{ id: string }>;
}

export default async function PrintTemplatePage({ params }: PrintTemplatePageProps) {
  const { id } = await params;
  const templateId = Number(id);

  if (!templateId || Number.isNaN(templateId)) {
    notFound();
  }

  const templateData = await templateRepository.getTemplateById(templateId);

  if (!templateData || !templateData.schemaContent) {
    notFound();
  }

  return (
    <main className="w-full flex justify-center py-6 print:py-0">
      <PrintCanvas schema={templateData.schemaContent} />
    </main>
  );
}
