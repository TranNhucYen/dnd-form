"use server";

import { cookies } from "next/headers";
import { verifyJwtToken } from "@/lib/jwt";
import { handleActionError } from "@/shared/utils/action.util";
import type { ActionResponse } from "@/shared/types/action.type";
import {
  collectService,
  type CollectingFormSummary,
  type FormCollectionConfig,
} from "../services/collect.service";

async function getAuthenticatedUserId(): Promise<{ userId: number } | { error: string; code: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return {
      error: "Bạn cần đăng nhập để thực hiện thao tác này.",
      code: "UNAUTHORIZED",
    };
  }

  const user = await verifyJwtToken(token);
  if (!user) {
    return {
      error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      code: "UNAUTHORIZED",
    };
  }

  if (user.status === "blocked") {
    cookieStore.delete("auth_token");
    return { error: "Tài khoản của bạn đã bị khóa.", code: "ACCOUNT_BLOCKED" };
  }

  return { userId: user.id };
}

/**
 * Lấy danh sách biểu mẫu của người dùng hiện tại phục vụ trang thống kê
 */
export async function getUserCollectingFormsAction(): Promise<ActionResponse<CollectingFormSummary[]>> {
  try {
    const authResult = await getAuthenticatedUserId();
    if ("error" in authResult) {
      return {
        success: false,
        error: authResult.error,
        code: authResult.code,
      };
    }

    const data = await collectService.getUserCollectingForms(authResult.userId);
    return { success: true, data };
  } catch (error) {
    return handleActionError(error, "getUserCollectingFormsAction");
  }
}

export async function getFormCollectionConfigAction(
  formId: number,
): Promise<ActionResponse<FormCollectionConfig>> {
  try {
    const authResult = await getAuthenticatedUserId();
    if ("error" in authResult) {
      return {
        success: false,
        error: authResult.error,
        code: authResult.code,
      };
    }

    const data = await collectService.getFormCollectionConfig(
      authResult.userId,
      formId,
    );
    return { success: true, data };
  } catch (error) {
    return handleActionError(error, "getFormCollectionConfigAction");
  }
}

export async function toggleFormCollectionAction(
  formId: number,
  isCollecting: boolean,
): Promise<
  ActionResponse<{
    isCollecting: boolean;
    collectToken: string | null;
    collectUrl: string | null;
  }>
> {
  try {
    const authResult = await getAuthenticatedUserId();
    if ("error" in authResult) {
      return {
        success: false,
        error: authResult.error,
        code: authResult.code,
      };
    }

    const data = await collectService.toggleFormCollection(
      authResult.userId,
      formId,
      isCollecting,
    );
    return { success: true, data };
  } catch (error) {
    return handleActionError(error, "toggleFormCollectionAction");
  }
}

export async function deleteFormSubmissionAction(
  formId: number,
  submissionId: number,
): Promise<ActionResponse<boolean>> {
  try {
    const authResult = await getAuthenticatedUserId();
    if ("error" in authResult) {
      return {
        success: false,
        error: authResult.error,
        code: authResult.code,
      };
    }

    const data = await collectService.deleteSubmission(
      authResult.userId,
      formId,
      submissionId,
    );
    return { success: true, data };
  } catch (error) {
    return handleActionError(error, "deleteFormSubmissionAction");
  }
}

/**
 * Server Action công khai (không cần đăng nhập) để người dùng điền dữ liệu dưới dạng eform
 */
export async function submitPublicEFormAction(
  token: string,
  submittedData: Record<string, unknown>,
): Promise<ActionResponse<{ submissionId: number }>> {
  try {
    const data = await collectService.submitPublicEForm(token, submittedData);
    return { success: true, data };
  } catch (error) {
    return handleActionError(error, "submitPublicEFormAction");
  }
}
