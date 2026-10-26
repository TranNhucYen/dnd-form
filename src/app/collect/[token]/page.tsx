import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collectService } from "@/features/eform/services/collect.service";
import { PublicCollectEFormView } from "@/features/eform/components/collect/PublicCollectEFormView";
import { PublicFormUnavailable } from "@/features/my-form/components/PublicFormUnavailable";

interface PublicCollectPageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({
  params,
}: PublicCollectPageProps): Promise<Metadata> {
  const { token } = await params;
  if (!token) return { title: "Điền biểu mẫu" };

  try {
    const formDetail = await collectService.getPublicCollectFormByToken(token);
    if (!formDetail) {
      return { title: "Biểu mẫu không khả dụng" };
    }
    return {
      title: `${formDetail.name} - Điền biểu mẫu`,
      description:
        formDetail.description || "Điền thông tin trực tuyến qua E-Form",
    };
  } catch {
    return { title: "Điền biểu mẫu" };
  }
}

export default async function PublicCollectPage({
  params,
}: PublicCollectPageProps) {
  const { token } = await params;
  if (!token) {
    notFound();
  }

  const formDetail = await collectService.getPublicCollectFormByToken(token);

  if (!formDetail) {
    return <PublicFormUnavailable />;
  }

  return <PublicCollectEFormView form={formDetail} />;
}
