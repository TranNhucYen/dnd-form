import crypto from "crypto";
import { db } from "@/db";
import { form, formSubmission, schemaJson, user } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import type { FormSchemaJson } from "@/features/form-builder/types/formBuilder.types";
import { hydrateImageUrls } from "@/features/editor/utils/schema-hydrate";
import { hydrateFormDataIntoSchema } from "../engine/hydrate-submission";
import { formatDate } from "@/shared/utils";
import { NotFoundError, ValidationError } from "@/shared/errors";

export interface FormSubmissionItem {
  id: number;
  formId: number;
  submittedData: Record<string, unknown>;
  filledSchema: FormSchemaJson;
  createdAt: string;
  formattedCreatedAt: string;
}

export interface FormCollectionConfig {
  formId: number;
  formName: string;
  isCollecting: boolean;
  collectToken: string | null;
  collectUrl: string | null;
  submissions: FormSubmissionItem[];
}

export interface PublicCollectFormDetail {
  id: number;
  name: string;
  description: string | null;
  token: string;
  schemaContent: FormSchemaJson;
}

export const collectService = {
  /**
   * Lấy cấu hình thu thập và danh sách phản hồi của biểu mẫu (dành cho chủ sở hữu)
   */
  async getFormCollectionConfig(
    userId: number,
    formId: number,
  ): Promise<FormCollectionConfig> {
    const [formRecord] = await db
      .select({
        id: form.id,
        name: form.name,
        isCollecting: form.isCollecting,
        collectToken: form.collectToken,
      })
      .from(form)
      .where(and(eq(form.id, formId), eq(form.ownerId, userId)));

    if (!formRecord) {
      throw new NotFoundError(
        "Biểu mẫu không tồn tại hoặc bạn không có quyền quản lý thu thập.",
      );
    }

    const rawSubmissions = await db
      .select({
        id: formSubmission.id,
        formId: formSubmission.formId,
        submittedData: formSubmission.submittedData,
        filledSchema: formSubmission.filledSchema,
        createdAt: formSubmission.createdAt,
      })
      .from(formSubmission)
      .where(eq(formSubmission.formId, formId))
      .orderBy(desc(formSubmission.createdAt));

    const submissions: FormSubmissionItem[] = rawSubmissions.map((item) => {
      const schema = item.filledSchema as FormSchemaJson;
      hydrateImageUrls(schema);
      const iso = item.createdAt.toISOString();
      return {
        id: item.id,
        formId: item.formId,
        submittedData: (item.submittedData as Record<string, unknown>) || {},
        filledSchema: schema,
        createdAt: iso,
        formattedCreatedAt: formatDate(iso),
      };
    });

    const token = formRecord.collectToken ?? null;
    return {
      formId: formRecord.id,
      formName: formRecord.name,
      isCollecting: Boolean(formRecord.isCollecting),
      collectToken: token,
      collectUrl: token ? `/collect/${token}` : null,
      submissions,
    };
  },

  /**
   * Bật / tắt trạng thái thu thập phản hồi qua E-Form
   */
  async toggleFormCollection(
    userId: number,
    formId: number,
    isCollecting: boolean,
  ): Promise<{
    isCollecting: boolean;
    collectToken: string | null;
    collectUrl: string | null;
  }> {
    const [formRecord] = await db
      .select({
        id: form.id,
        collectToken: form.collectToken,
      })
      .from(form)
      .where(and(eq(form.id, formId), eq(form.ownerId, userId)));

    if (!formRecord) {
      throw new NotFoundError(
        "Biểu mẫu không tồn tại hoặc bạn không có quyền thay đổi cài đặt.",
      );
    }

    let token = formRecord.collectToken;
    if (isCollecting && !token) {
      token = `col_${crypto.randomBytes(12).toString("hex")}`;
    }

    await db
      .update(form)
      .set({
        isCollecting,
        collectToken: token,
      })
      .where(eq(form.id, formId));

    return {
      isCollecting,
      collectToken: token ?? null,
      collectUrl: token ? `/collect/${token}` : null,
    };
  },

  /**
   * Xóa một bản ghi phản hồi đã nộp
   */
  async deleteSubmission(
    userId: number,
    formId: number,
    submissionId: number,
  ): Promise<boolean> {
    const [formRecord] = await db
      .select({ id: form.id })
      .from(form)
      .where(and(eq(form.id, formId), eq(form.ownerId, userId)));

    if (!formRecord) {
      throw new NotFoundError("Bạn không có quyền xóa phản hồi này.");
    }

    await db
      .delete(formSubmission)
      .where(
        and(
          eq(formSubmission.id, submissionId),
          eq(formSubmission.formId, formId),
        ),
      );

    return true;
  },

  /**
   * Lấy biểu mẫu công khai theo collectToken để người ngoài điền E-Form (không cần đăng nhập)
   */
  async getPublicCollectFormByToken(
    token: string,
  ): Promise<PublicCollectFormDetail | null> {
    if (!token || !token.trim()) return null;

    const [record] = await db
      .select({
        id: form.id,
        name: form.name,
        description: form.description,
        isCollecting: form.isCollecting,
        collectToken: form.collectToken,
        schemaContent: schemaJson.content,
      })
      .from(form)
      .innerJoin(user, eq(form.ownerId, user.id))
      .innerJoin(schemaJson, eq(form.schemaId, schemaJson.id))
      .where(
        and(
          eq(form.collectToken, token.trim()),
          eq(form.isCollecting, true),
          eq(user.status, "active"),
        ),
      )
      .limit(1);

    if (!record || !record.collectToken) {
      return null;
    }

    const schemaContent = record.schemaContent as FormSchemaJson;
    hydrateImageUrls(schemaContent);

    return {
      id: record.id,
      name: record.name,
      description: record.description,
      token: record.collectToken,
      schemaContent,
    };
  },

  /**
   * Ghi nhận bài nộp từ trang E-Form công khai và tự động điền dữ liệu ngược vào Schema Form thật
   */
  async submitPublicEForm(
    token: string,
    submittedData: Record<string, unknown>,
  ): Promise<{ submissionId: number }> {
    if (!token || !token.trim()) {
      throw new ValidationError("Mã thu thập biểu mẫu không hợp lệ.");
    }

    const [record] = await db
      .select({
        id: form.id,
        isCollecting: form.isCollecting,
        schemaContent: schemaJson.content,
      })
      .from(form)
      .innerJoin(user, eq(form.ownerId, user.id))
      .innerJoin(schemaJson, eq(form.schemaId, schemaJson.id))
      .where(
        and(
          eq(form.collectToken, token.trim()),
          eq(form.isCollecting, true),
          eq(user.status, "active"),
        ),
      )
      .limit(1);

    if (!record) {
      throw new NotFoundError(
        "Biểu mẫu này hiện đã đóng hoặc không còn nhận phản hồi.",
      );
    }

    const baseSchema = record.schemaContent as FormSchemaJson;
    const filledSchema = hydrateFormDataIntoSchema(
      baseSchema,
      submittedData || {},
    );

    const [insertResult] = await db.insert(formSubmission).values({
      formId: record.id,
      token: token.trim(),
      submittedData: submittedData || {},
      filledSchema,
    });

    return {
      submissionId: insertResult.insertId,
    };
  },
};
