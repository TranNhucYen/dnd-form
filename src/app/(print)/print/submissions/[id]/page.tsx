import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { form, formSubmission } from "@/db/schema";
import { verifyJwtToken } from "@/lib/jwt";
import { hydrateImageUrls } from "@/features/editor/utils/schema-hydrate";
import { formatDate } from "@/shared/utils";
import type { FormSchemaJson } from "@/features/form-builder/types/formBuilder.types";
import { SubmissionPrintViewer } from "@/features/eform/components/collect/SubmissionPrintViewer";

export const metadata: Metadata = {
  title: "Xem & tải xuống biểu mẫu đã điền",
};

interface SubmissionPrintPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionPrintPage({
  params,
}: SubmissionPrintPageProps) {
  const { id } = await params;
  const submissionId = Number(id);

  if (!submissionId || Number.isNaN(submissionId)) {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = token ? await verifyJwtToken(token) : null;

  if (!user) {
    notFound();
  }

  const [record] = await db
    .select({
      id: formSubmission.id,
      formName: form.name,
      filledSchema: formSubmission.filledSchema,
      createdAt: formSubmission.createdAt,
    })
    .from(formSubmission)
    .innerJoin(form, eq(formSubmission.formId, form.id))
    .where(
      and(eq(formSubmission.id, submissionId), eq(form.ownerId, user.id)),
    );

  if (!record || !record.filledSchema) {
    notFound();
  }

  const schema = record.filledSchema as FormSchemaJson;
  hydrateImageUrls(schema);

  return (
    <SubmissionPrintViewer
      submissionId={record.id}
      formName={record.formName}
      submittedAt={formatDate(record.createdAt.toISOString())}
      schema={schema}
    />
  );
}
