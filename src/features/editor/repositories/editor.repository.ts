import { db } from "@/db";
import { form, schemaJson, schemaMedia } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { FormSchemaJson } from "@/features/form-builder/types/formBuilder.types";
import type { FormDetailResult, SaveFormResult } from "../types/editor.type";

/** Thông tin media cần lưu vào cơ sở dữ liệu */
export interface MediaInsertItem {
  mediaType: "signature" | "image" | "document";
  signatureBase64?: string | null;
  fileKey?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
}

export interface SaveFormRepoParams {
  formId?: number | null;
  userId: number;
  title: string;
  description?: string;
  schemaContent: FormSchemaJson;
  mediaList: MediaInsertItem[];
}

export interface IEditorRepository {
  saveForm(params: SaveFormRepoParams): Promise<SaveFormResult | null>;
  getFormById(formId: number, userId: number): Promise<FormDetailResult | null>;
}

export const drizzleEditorRepository: IEditorRepository = {
  async saveForm(params: SaveFormRepoParams): Promise<SaveFormResult | null> {
    return await db.transaction(async (tx) => {
      // Tạo mới biểu mẫu nếu chưa có formId
      if (!params.formId) {
        // Lưu nội dung schema vào bảng schema_json
        const [schemaResult] = await tx.insert(schemaJson).values({
          schemaType: "form",
          content: params.schemaContent,
        });
        const schemaId = schemaResult.insertId;

        // Tạo bản ghi biểu mẫu trong bảng form
        const [formResult] = await tx.insert(form).values({
          name: params.title,
          ownerId: params.userId,
          schemaId,
          description: params.description ?? null,
        });
        const formId = formResult.insertId;

        // Lưu danh sách media đính kèm nếu có
        if (params.mediaList.length > 0) {
          await tx.insert(schemaMedia).values(
            params.mediaList.map((m) => ({
              schemaId,
              mediaType: m.mediaType,
              signatureBase64: m.signatureBase64 ?? null,
              fileKey: m.fileKey ?? null,
              fileUrl: m.fileUrl ?? null,
              fileName: m.fileName ?? null,
              mimeType: m.mimeType ?? null,
              fileSize: m.fileSize ?? null,
            })),
          );
        }

        return {
          formId,
          schemaId,
          title: params.title,
          updatedAt: new Date().toISOString(),
        };
      }

      // Cập nhật biểu mẫu khi đã có formId
      // Kiểm tra quyền sở hữu biểu mẫu
      const [existingForm] = await tx
        .select()
        .from(form)
        .where(and(eq(form.id, params.formId), eq(form.ownerId, params.userId)));

      if (!existingForm) {
        return null;
      }

      const schemaId = existingForm.schemaId;

      // Cập nhật nội dung schema
      await tx
        .update(schemaJson)
        .set({
          content: params.schemaContent,
          updatedAt: new Date(),
        })
        .where(eq(schemaJson.id, schemaId));

      // Cập nhật thông tin biểu mẫu
      await tx
        .update(form)
        .set({
          name: params.title,
          description: params.description ?? null,
          updatedAt: new Date(),
        })
        .where(eq(form.id, params.formId));

      // Đồng bộ media: xóa bản ghi cũ và lưu bản ghi mới
      await tx.delete(schemaMedia).where(eq(schemaMedia.schemaId, schemaId));

      if (params.mediaList.length > 0) {
        await tx.insert(schemaMedia).values(
          params.mediaList.map((m) => ({
            schemaId,
            mediaType: m.mediaType,
            signatureBase64: m.signatureBase64 ?? null,
            fileKey: m.fileKey ?? null,
            fileUrl: m.fileUrl ?? null,
            fileName: m.fileName ?? null,
            mimeType: m.mimeType ?? null,
            fileSize: m.fileSize ?? null,
          })),
        );
      }

      return {
        formId: params.formId,
        schemaId,
        title: params.title,
        updatedAt: new Date().toISOString(),
      };
    });
  },

  async getFormById(
    formId: number,
    userId: number,
  ): Promise<FormDetailResult | null> {
    const [existingForm] = await db
      .select({
        form: form,
        schema: schemaJson,
      })
      .from(form)
      .innerJoin(schemaJson, eq(form.schemaId, schemaJson.id))
      .where(and(eq(form.id, formId), eq(form.ownerId, userId)));

    if (!existingForm) {
      return null;
    }

    const mediaRecords = await db
      .select()
      .from(schemaMedia)
      .where(eq(schemaMedia.schemaId, existingForm.form.schemaId));

    return {
      id: existingForm.form.id,
      name: existingForm.form.name,
      description: existingForm.form.description,
      ownerId: existingForm.form.ownerId,
      schemaId: existingForm.form.schemaId,
      schemaContent: existingForm.schema.content as FormSchemaJson,
      media: mediaRecords.map((m) => ({
        id: m.id,
        mediaType: m.mediaType,
        signatureBase64: m.signatureBase64,
        fileUrl: m.fileUrl,
      })),
      createdAt: existingForm.form.createdAt.toISOString(),
      updatedAt: existingForm.form.updatedAt.toISOString(),
    };
  },
};
