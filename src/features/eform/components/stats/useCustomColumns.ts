"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormSubmissionItem } from "../../services/collect.service";
import { parseSubmissionFields } from "./submission-fields";

/**
 * Trạng thái của một cột trường tùy chọn trên bảng
 */
export interface CustomColumnState {
  id: string;
  fieldId: string;
  selectKey: number;
}

/**
 * Thông tin trường có thể chọn đưa vào cột
 */
export interface AvailableCustomField {
  id: string;
  label: string;
  type: string;
}

/**
 * Quản lý danh sách các cột trường tùy chọn do người dùng thiết lập
 *
 * @param selectedFormId ID của biểu mẫu đang chọn (dùng để reset cột khi đổi form)
 * @param submissions Danh sách bản nộp của biểu mẫu để trích xuất các trường khả dụng
 */
export function useCustomColumns(
  selectedFormId: number | null,
  submissions?: FormSubmissionItem[],
) {
  const [customColumns, setCustomColumns] = useState<CustomColumnState[]>([
    { id: "col_default", fieldId: "", selectKey: 1 },
  ]);

  // Tự động reset lại cột tùy chọn khi người dùng chuyển sang biểu mẫu khác
  useEffect(() => {
    setCustomColumns([
      { id: `col_${Date.now()}`, fieldId: "", selectKey: Date.now() },
    ]);
  }, [selectedFormId]);

  // Trích xuất danh sách tất cả các trường có thể chọn từ các bản nộp hiện có
  const availableFields = useMemo<AvailableCustomField[]>(() => {
    if (!submissions || submissions.length === 0) return [];

    const fieldMap = new Map<string, AvailableCustomField>();

    // Quét qua các bản nộp để lấy danh sách các trường nhập liệu
    for (const sub of submissions) {
      const { fields } = parseSubmissionFields(sub);
      for (const f of fields) {
        if (!fieldMap.has(f.id)) {
          fieldMap.set(f.id, { id: f.id, label: f.label, type: f.type });
        }
      }
    }

    return Array.from(fieldMap.values());
  }, [submissions]);

  // Chọn một trường cho cột tương ứng
  const handleSelectCustomField = (colId: string, fieldId: string) => {
    setCustomColumns((prev) =>
      prev.map((c) => (c.id === colId ? { ...c, fieldId } : c)),
    );
  };

  // Thêm một cột tùy chọn mới ở cuối bảng
  const handleAddCustomColumn = () => {
    setCustomColumns((prev) => [
      ...prev,
      {
        id: `col_${Date.now()}_${Math.random()}`,
        fieldId: "",
        selectKey: Date.now(),
      },
    ]);
  };

  // Xóa cột tùy chọn hoặc xóa trường đã chọn trong cột
  const handleRemoveOrClearCustomColumn = (colId: string) => {
    setCustomColumns((prev) => {
      const targetCol = prev.find((c) => c.id === colId);
      if (!targetCol) return prev;

      if (targetCol.fieldId) {
        return prev.map((c) =>
          c.id === colId ? { ...c, fieldId: "", selectKey: Date.now() } : c,
        );
      }

      if (prev.length > 1) {
        return prev.filter((c) => c.id !== colId);
      }

      return prev;
    });
  };

  return {
    customColumns,
    availableFields,
    handleSelectCustomField,
    handleAddCustomColumn,
    handleRemoveOrClearCustomColumn,
  };
}
