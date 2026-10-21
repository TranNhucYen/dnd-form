import type {
  FormPageSchema,
  FormSchemaJson,
  SchemaField,
} from "@/features/form-builder/types/formBuilder.types";
import type {
  EFormLayout,
  EFormPage,
  EFormRow,
} from "../types/eform.types";

// Ngưỡng chênh lệch tọa độ Y để xác định các field thuộc cùng một dòng (~4.5mm)
const Y_ROW_THRESHOLD = 450;

/**
 * Gom cụm các field của trang thành các hàng (Rows) dựa trên trục Y
 * Sau đó trong mỗi hàng, sắp xếp các field theo thứ tự trục X từ trái qua phải
 */
function clusterFieldsIntoRows(fields: SchemaField[]): SchemaField[][] {
  if (fields.length === 0) return [];

  // Sắp xếp các field theo tọa độ y tăng dần, sau đó theo x
  const sorted = [...fields].sort((a, b) => {
    if (Math.abs(a.y - b.y) > 100) return a.y - b.y;
    return a.x - b.x;
  });

  const rows: SchemaField[][] = [];
  let currentRow: SchemaField[] = [];
  let currentY = sorted[0].y;

  for (const field of sorted) {
    if (currentRow.length === 0) {
      currentRow.push(field);
      currentY = field.y;
      continue;
    }

    // Nếu field.y nằm trong ngưỡng Y của hàng hiện tại
    if (Math.abs(field.y - currentY) <= Y_ROW_THRESHOLD) {
      currentRow.push(field);
    } else {
      // Sắp xếp các field trong hàng theo x từ trái qua phải
      rows.push(currentRow.sort((a, b) => a.x - b.x));
      currentRow = [field];
      currentY = field.y;
    }
  }

  if (currentRow.length > 0) {
    rows.push(currentRow.sort((a, b) => a.x - b.x));
  }

  return rows;
}

export function transformPageSchemaToEFormPage(
  pageSchema: FormPageSchema,
  pageIndex: number,
): EFormPage {
  const clusteredGroups = clusterFieldsIntoRows(pageSchema.fields);

  const rows: EFormRow[] = clusteredGroups.map((group, rIdx) => ({
    id: `row_${rIdx}`,
    elements: group.map((field, fIdx) => ({
      id: field.id || `f_${rIdx}_${fIdx}`,
      type: field.type,
      rawField: field,
      style: field.style,
    })),
  }));

  return {
    id: pageSchema.id || `page_${pageIndex + 1}`,
    pageNumber: pageSchema.pageNumber || pageIndex + 1,
    name: pageSchema.name || `Trang ${pageSchema.pageNumber || pageIndex + 1}`,
    rows,
  };
}

export function transformSchemaToEForm(schema: FormSchemaJson): EFormLayout {
  if (!schema || !schema.pages || schema.pages.length === 0) {
    return {
      pages: [],
      totalFields: 0,
    };
  }

  let totalFields = 0;
  const pages: EFormPage[] = schema.pages.map((page, index) => {
    totalFields += page.fields.length;
    return transformPageSchemaToEFormPage(page, index);
  });

  return {
    pages,
    totalFields,
  };
}
