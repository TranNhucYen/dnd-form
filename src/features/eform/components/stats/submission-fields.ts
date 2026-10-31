import type { FormSubmissionItem } from "../../services/collect.service";
import type { SchemaField } from "@/features/form-builder/types/formBuilder.types";

/**
 * Thông tin của một trường dữ liệu đã được bóc tách từ bản nộp (Submission)
 */
export interface ParsedSubmissionField {
  id: string;
  label: string;
  type: string;
  value: unknown;
  formattedValue: string;
  isFilled: boolean;
  signatureDataUrl?: string;
  signerName?: string;
}

/**
 * Tổng hợp thông tin các trường của một bản ghi phản hồi
 */
export interface SubmissionFieldsSummary {
  totalCount: number;
  filledCount: number;
  fields: ParsedSubmissionField[];
}

/**
 * Các loại trường cho phép người dùng nhập liệu / phản hồi
 */
export const INPUT_FIELD_TYPES = new Set([
  "text",
  "number",
  "select",
  "date",
  "textarea",
  "checkbox",
  "signature",
  "datatable",
]);

/**
 * Tên loại trường theo ngôn ngữ tự nhiên
 */
export const FIELD_TYPE_LABELS: Record<string, string> = {
  text: "Văn bản",
  number: "Số",
  select: "Lựa chọn",
  date: "Ngày tháng",
  textarea: "Văn bản dài",
  checkbox: "Hộp kiểm",
  signature: "Chữ ký",
  datatable: "Bảng dữ liệu",
};

/**
 * Mặc định khi người thiết kế form không đặt label
 */
export const DEFAULT_FIELD_LABELS: Record<string, string> = {
  ...FIELD_TYPE_LABELS,
  date: "Ngày tháng năm",
};


function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, "").trim();
}

/**
 * Lấy tên tự nhiên của loại trường (dùng cho badge, tooltip, thống kê)
 * @param type Mã loại trường (text, number, date...)
 */
export function getFieldTypeLabel(type: string): string {
  return FIELD_TYPE_LABELS[type] || "Trường";
}

/**
 * Lấy nhãn mặc định cho trường khi không được đặt tên (ví dụ: date -> "Ngày tháng năm")
 * @param type Mã loại trường
 */
export function getDefaultFieldLabel(type: string): string {
  return DEFAULT_FIELD_LABELS[type] || "Trường dữ liệu";
}

/**
 * Trích xuất giá trị thô từ `data` object của SchemaField
 */
function extractDataObjValue(dataObj?: Record<string, unknown>): unknown {
  if (!dataObj) return undefined;
  return dataObj.value ?? dataObj.html ?? dataObj.checked;
}

/**
 * Định dạng giá trị và đánh giá trạng thái điền của một trường
 * @param fieldType Loại trường
 * @param rawVal Giá trị thô nhận được từ submittedData hoặc schema
 */
function formatFieldValue(
  fieldType: string,
  rawVal: unknown,
): {
  isFilled: boolean;
  formattedValue: string;
  signatureDataUrl?: string;
  signerName?: string;
} {
  // 1. Trường Checkbox
  if (fieldType === "checkbox") {
    const isFilled = Boolean(rawVal);
    return {
      isFilled,
      formattedValue: isFilled ? "Đã chọn" : "Không chọn",
    };
  }

  // 2. Trường Chữ ký (Signature)
  if (fieldType === "signature") {
    if (typeof rawVal === "string" && rawVal.trim()) {
      return {
        isFilled: true,
        formattedValue: "Đã ký",
        signatureDataUrl: rawVal.trim(),
      };
    }
    if (rawVal && typeof rawVal === "object") {
      const sigObj = rawVal as { value?: string; signerName?: string };
      const hasSig = Boolean(sigObj.value || sigObj.signerName);
      return {
        isFilled: hasSig,
        formattedValue: hasSig ? "Đã ký" : "(Chưa điền)",
        signatureDataUrl: sigObj.value,
        signerName: sigObj.signerName,
      };
    }
    return { isFilled: false, formattedValue: "(Chưa điền)" };
  }

  // 3. Trường Bảng dữ liệu (Datatable)
  if (fieldType === "datatable") {
    let htmlStr = "";
    if (typeof rawVal === "string") {
      htmlStr = rawVal;
    } else if (rawVal && typeof rawVal === "object" && "html" in rawVal) {
      htmlStr = String((rawVal as { html?: unknown }).html ?? "");
    }
    const isFilled = Boolean(htmlStr && stripHtml(htmlStr).length > 0);
    return {
      isFilled,
      formattedValue: isFilled ? "Đã điền đủ" : "(Chưa điền)",
    };
  }

  // 4. Trường Văn bản dài (Textarea có chứa HTML)
  if (fieldType === "textarea") {
    const cleanText = stripHtml(String(rawVal ?? ""));
    const isFilled = cleanText.length > 0;
    return {
      isFilled,
      formattedValue: isFilled ? cleanText : "(Chưa điền)",
    };
  }

  // 5. Các trường thông thường (Text, Number, Date, Select...)
  if (rawVal !== undefined && rawVal !== null && rawVal !== "") {
    if (typeof rawVal === "string") {
      const trimmed = rawVal.trim();
      return {
        isFilled: trimmed.length > 0,
        formattedValue: trimmed.length > 0 ? trimmed : "(Chưa điền)",
      };
    }
    if (typeof rawVal === "number") {
      const isFilled = Number.isFinite(rawVal);
      return {
        isFilled,
        formattedValue: isFilled ? String(rawVal) : "(Chưa điền)",
      };
    }
    if (typeof rawVal === "object") {
      const isFilled = Object.keys(rawVal).length > 0;
      return {
        isFilled,
        formattedValue: isFilled ? JSON.stringify(rawVal) : "(Chưa điền)",
      };
    }
    return {
      isFilled: true,
      formattedValue: String(rawVal),
    };
  }

  return { isFilled: false, formattedValue: "(Chưa điền)" };
}

/**
 * Phân tích bản ghi submission để lấy danh sách đầy đủ các trường,
 * nhãn hiển thị, giá trị đã điền và số lượng trường đã hoàn thành.
 *
 * @param submission Đối tượng bản nộp từ FormSubmissionItem
 * @returns {SubmissionFieldsSummary} Đối tượng tổng hợp số lượng và chi tiết các trường
 */
export function parseSubmissionFields(
  submission: FormSubmissionItem | null,
): SubmissionFieldsSummary {
  if (!submission) {
    return {
      totalCount: 0,
      filledCount: 0,
      fields: [],
    };
  }

  const rawFieldList: {
    rawField: SchemaField;
    fieldType: string;
    dataObj?: Record<string, unknown>;
    rawVal: unknown;
  }[] = [];
  const submittedData = submission.submittedData || {};

  // 1. Quét qua tất cả các trang và trường nhập liệu trong filledSchema của bản ghi
  if (Array.isArray(submission.filledSchema?.pages)) {
    for (const page of submission.filledSchema.pages) {
      if (!Array.isArray(page.fields)) continue;

      for (const rawField of page.fields) {
        if (!rawField.id || !INPUT_FIELD_TYPES.has(rawField.type)) continue;

        const fieldType = rawField.type;
        const dataObj = rawField.data as Record<string, unknown> | undefined;

        // Ưu tiên lấy giá trị từ submittedData, nếu không có lấy từ dataObj của schema
        let rawVal = submittedData[rawField.id];
        if (rawVal === undefined) {
          rawVal = extractDataObjValue(dataObj);
        }

        rawFieldList.push({
          rawField,
          fieldType,
          dataObj,
          rawVal,
        });
      }
    }
  }

  // Đếm các trường bị thiếu nhãn để đánh số thứ tự (ví dụ: "Ngày tháng năm 1", "Ngày tháng năm 2")
  const fallbackTotalCounts = new Map<string, number>();
  for (const item of rawFieldList) {
    const hasLabel =
      item.dataObj &&
      typeof item.dataObj.label === "string" &&
      item.dataObj.label.trim();
    const hasPlaceholder =
      item.dataObj &&
      typeof item.dataObj.placeholder === "string" &&
      item.dataObj.placeholder.trim();

    if (!hasLabel && !hasPlaceholder) {
      const defaultName = getDefaultFieldLabel(item.fieldType);
      fallbackTotalCounts.set(
        defaultName,
        (fallbackTotalCounts.get(defaultName) || 0) + 1,
      );
    }
  }

  const fallbackIndexCounts = new Map<string, number>();
  const fields: ParsedSubmissionField[] = [];

  for (const item of rawFieldList) {
    const { rawField, fieldType, dataObj, rawVal } = item;

    // Trích xuất Label: ưu tiên label của người thiết kế -> placeholder -> fallback name theo loại trường
    let label = "";
    if (dataObj && typeof dataObj.label === "string" && dataObj.label.trim()) {
      label = dataObj.label.trim();
    } else if (
      dataObj &&
      typeof dataObj.placeholder === "string" &&
      dataObj.placeholder.trim()
    ) {
      label = dataObj.placeholder.trim();
    } else {
      const defaultName = getDefaultFieldLabel(fieldType);
      const totalSame = fallbackTotalCounts.get(defaultName) || 0;
      if (totalSame > 1) {
        const nextIdx = (fallbackIndexCounts.get(defaultName) || 0) + 1;
        fallbackIndexCounts.set(defaultName, nextIdx);
        label = `${defaultName} ${nextIdx}`;
      } else {
        label = defaultName;
      }
    }

    const { isFilled, formattedValue, signatureDataUrl, signerName } =
      formatFieldValue(fieldType, rawVal);

    fields.push({
      id: rawField.id,
      label,
      type: fieldType,
      value: rawVal,
      formattedValue,
      isFilled,
      signatureDataUrl,
      signerName,
    });
  }

  const totalCount = fields.length;
  const filledCount = fields.filter((f) => f.isFilled).length;

  return {
    totalCount,
    filledCount,
    fields,
  };
}
