import {
  editorRepository,
  type MediaInsertItem,
} from "../repositories";
import type {
  FormDetailResult,
  SaveFormInput,
  SaveFormResult,
} from "../types/editor.type";
import type {
  FormSchemaJson,
  ImageFieldData,
} from "@/features/form-builder/types/formBuilder.types";
import { getStorageService, isValidStorageKey } from "@/lib/storage";
import { hydrateImageUrls } from "../utils/schema-hydrate";

// Re-export hàm hydrate để các module khác vẫn dùng được qua editor.service nếu cần
export { hydrateImageUrls };

export const editorService = {
  /** Lưu biểu mẫu (tạo mới hoặc cập nhật) */
  async saveForm(userId: number, input: SaveFormInput): Promise<SaveFormResult> {
    // Tên mặc định khi người dùng chưa đặt tên
    const title = input.title?.trim() || "Biểu mẫu chưa có tên";

    // Sao chép schema để tránh làm biến đổi state của client
    const clonedSchema: FormSchemaJson = structuredClone(input.schema);

    const mediaList: MediaInsertItem[] = [];
    const storage = getStorageService();

    // Bóc tách media và dọn dẹp URL tạm thời khỏi schema
    for (const field of clonedSchema.fields) {
      if (field.type === "signature") {
        const signatureData = field.data as { value?: string } | undefined;
        if (signatureData?.value) {
          mediaList.push({
            mediaType: "signature",
            signatureBase64: signatureData.value,
            fileKey: null,
            fileUrl: null,
          });
        }
      } 
      else if (field.type === "image") {
        const imageData = field.data as ImageFieldData | undefined;
        const key = imageData?.key;

        if (key) {
          // Chỉ chấp nhận key đúng định dạng do hệ thống sinh ra
          if (!isValidStorageKey(key)) {
            throw new Error("Key ảnh không hợp lệ");
          }

          mediaList.push({
            mediaType: "image",
            signatureBase64: null,
            fileKey: key,
            fileUrl: storage.getUrl(key),
          });

          // Canvas-DB chỉ giữ fileKey (tên file)
          imageData.value = "";
        } else if (imageData?.value && imageData.value.startsWith("blob:")) {
          // Xóa blob URL tạm thời để không lưu URL rác vào cơ sở dữ liệu
          imageData.value = "";
        }
      }
    }

    // Lưu vào cơ sở dữ liệu qua repository
    let result: SaveFormResult | null = null;
    try {
      result = await editorRepository.saveForm({
        formId: input.formId,
        userId,
        title,
        description: input.description,
        schemaContent: clonedSchema,
        mediaList,
      });
    } catch (error) {
      console.error("Lỗi khi lưu biểu mẫu:", error);
      throw new Error("Đã xảy ra lỗi khi lưu biểu mẫu");
    }

    if (!result) {
      throw new Error("Không tìm thấy biểu mẫu hoặc bạn không có quyền chỉnh sửa");
    }

    return result;
  },

  /** Lấy chi tiết biểu mẫu và schema theo ID */
  async getFormDetail(formId: number, userId: number): Promise<FormDetailResult> {
    let detail: FormDetailResult | null = null;
    try {
      detail = await editorRepository.getFormById(formId, userId);
    } catch (error) {
      console.error(`Lỗi khi tải biểu mẫu id ${formId}:`, error);
      throw new Error("Đã xảy ra lỗi khi lấy thông tin biểu mẫu");
    }

    if (!detail) {
      throw new Error("Không tìm thấy biểu mẫu hoặc bạn không có quyền xem");
    }

    if (detail.schemaContent) {
      hydrateImageUrls(detail.schemaContent);
    }

    return detail;
  },
};
