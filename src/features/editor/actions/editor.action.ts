"use server";

import { cookies } from "next/headers";
import { verifyJwtToken } from "@/lib/jwt";
import { editorService } from "../services/editor.service";
import type {
  ActionResponse,
  FormDetailResult,
  SaveFormInput,
  SaveFormResult,
} from "../types/editor.type";

/** Lưu biểu mẫu vào cơ sở dữ liệu */
export async function saveFormAction(
  input: SaveFormInput,
): Promise<ActionResponse<SaveFormResult>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để lưu biểu mẫu",
      };
    }

    const user = await verifyJwtToken(token);
    if (!user) {
      return {
        success: false,
        error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại",
      };
    }

    const result = await editorService.saveForm(user.id, input);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi khi lưu biểu mẫu",
    };
  }
}

/** Lấy thông tin chi tiết biểu mẫu theo formId */
export async function getFormDetailAction(
  formId: number,
): Promise<ActionResponse<FormDetailResult>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để xem biểu mẫu",
      };
    }

    const user = await verifyJwtToken(token);
    if (!user) {
      return {
        success: false,
        error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại",
      };
    }

    const detail = await editorService.getFormDetail(formId, user.id);

    return {
      success: true,
      data: detail,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi khi tải thông tin biểu mẫu",
    };
  }
}
