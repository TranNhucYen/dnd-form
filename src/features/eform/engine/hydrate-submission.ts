import type {
  CheckboxFieldData,
  DatatableFieldData,
  DateFieldData,
  FormSchemaJson,
  NumberFieldData,
  SelectFieldData,
  SignatureFieldData,
  TextFieldData,
  TextareaFieldData,
} from "@/features/form-builder/types/formBuilder.types";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Chuyển chuỗi ngày YYYY-MM-DD (từ input[type="date"]) sang dd/MM/yyyy (chuẩn DateField trên Canvas)
 */
function normalizeDateForCanvas(raw: string): string {
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-");
    return `${day}/${month}/${year}`;
  }
  return trimmed;
}

/**
 * Điền dữ liệu người dùng nộp trên E-Form ngược vào FormSchemaJson gốc
 * để hiển thị/in trên đúng toạ độ 2D của Form thật
 */
export function hydrateFormDataIntoSchema(
  baseSchema: FormSchemaJson,
  submittedData: Record<string, unknown>,
): FormSchemaJson {
  const clonedSchema = structuredClone(baseSchema);

  if (!Array.isArray(clonedSchema.pages)) {
    return clonedSchema;
  }

  for (const page of clonedSchema.pages) {
    if (!Array.isArray(page.fields)) continue;

    for (const field of page.fields) {
      const submittedValue = submittedData[field.id];
      if (submittedValue === undefined) continue;

      switch (field.type) {
        case "text": {
          const data = field.data as TextFieldData;
          data.value = String(submittedValue ?? "");
          break;
        }

        case "number": {
          const data = field.data as NumberFieldData;
          if (submittedValue === "" || submittedValue === null) {
            data.value = undefined;
          } else {
            const num = Number(submittedValue);
            data.value = Number.isFinite(num) ? num : undefined;
          }
          break;
        }

        case "select": {
          const data = field.data as SelectFieldData;
          data.value = String(submittedValue ?? "");
          break;
        }

        case "date": {
          const data = field.data as DateFieldData;
          if (typeof submittedValue === "string" && submittedValue.trim()) {
            data.value = normalizeDateForCanvas(submittedValue);
          }
          break;
        }

        case "checkbox": {
          const data = field.data as CheckboxFieldData;
          data.checked = Boolean(submittedValue);
          break;
        }

        case "textarea": {
          const data = field.data as TextareaFieldData;
          const text = String(submittedValue ?? "");
          const html = text
            .split("\n")
            .map((line) => `<p>${escapeHtml(line)}</p>`)
            .join("");
          data.html = html || "<p></p>";
          delete data.content;
          break;
        }

        case "signature": {
          const data = field.data as SignatureFieldData;
          if (typeof submittedValue === "string") {
            data.value = submittedValue || undefined;
          } else if (
            submittedValue &&
            typeof submittedValue === "object" &&
            "value" in submittedValue
          ) {
            const sigObj = submittedValue as { value?: string; signerName?: string };
            data.value = sigObj.value || undefined;
            if (sigObj.signerName !== undefined) {
              data.signerName = sigObj.signerName;
            }
          }
          break;
        }

        case "datatable": {
          const data = field.data as DatatableFieldData;
          if (typeof submittedValue === "string" && submittedValue.trim()) {
            data.html = submittedValue;
            delete data.content;
          } else if (
            submittedValue &&
            typeof submittedValue === "object" &&
            "html" in submittedValue &&
            typeof (submittedValue as { html?: unknown }).html === "string"
          ) {
            data.html = (submittedValue as { html: string }).html;
            delete data.content;
          }
          break;
        }
      }
    }
  }

  return clonedSchema;
}
