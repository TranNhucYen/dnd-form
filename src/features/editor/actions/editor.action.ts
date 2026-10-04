"use server";

import { cookies } from "next/headers";
import { verifyJwtToken } from "@/lib/jwt";
import { handleActionError } from "@/shared/utils/action.util";
import { editorService } from "../services/editor.service";
import type {
  ActionResponse,
  FormDetailResult,
  SaveFormInput,
  SaveFormResult,
} from "../types/editor.type";

async function getAuthenticatedUserId(): Promise<
  { userId: number } | { error: string; code: string }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return { error: "Bạn cần đăng nhập để thực hiện thao tác này", code: "UNAUTHORIZED" };
  }

  const user = await verifyJwtToken(token);
  if (!user) {
    return {
      error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại",
      code: "UNAUTHORIZED",
    };
  }

  if (user.status === "blocked") {
    cookieStore.delete("auth_token");
    return { error: "Tài khoản của bạn đã bị khóa", code: "ACCOUNT_BLOCKED" };
  }

  return { userId: user.id };
}

/** Lưu biểu mẫu vào cơ sở dữ liệu */
export async function saveFormAction(
  input: SaveFormInput,
): Promise<ActionResponse<SaveFormResult>> {
  try {
    const auth = await getAuthenticatedUserId();
    if ("error" in auth) {
      return { success: false, error: auth.error, code: auth.code };
    }

    const result = await editorService.saveForm(auth.userId, input);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return handleActionError(error, "saveFormAction");
  }
}

/** Lấy thông tin chi tiết biểu mẫu theo formId */
export async function getFormDetailAction(
  formId: number,
): Promise<ActionResponse<FormDetailResult>> {
  try {
    const auth = await getAuthenticatedUserId();
    if ("error" in auth) {
      return { success: false, error: auth.error, code: auth.code };
    }

    const detail = await editorService.getFormDetail(formId, auth.userId);

    return {
      success: true,
      data: detail,
    };
  } catch (error) {
    return handleActionError(error, "getFormDetailAction");
  }
}
