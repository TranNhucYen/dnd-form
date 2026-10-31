"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { FormSubmissionItem } from "../../services/collect.service";
import {
  parseSubmissionFields,
  type ParsedSubmissionField,
} from "./submission-fields";

/**
 * Kiểu trạng thái sắp xếp của một cột
 */
export interface SortState {
  /** Tên cột đang được sort ("stt", "createdAt" hoặc fieldId của cột tùy chọn) */
  column: "stt" | "createdAt" | string | null;
  direction: "asc" | "desc" | null;
}

/**
 * Custom hook quản lý trạng thái và thuật toán sắp xếp danh sách bản nộp E-Form.
 *
 * @param filteredSubmissions Danh sách các bản nộp đã qua bộ lọc tìm kiếm
 */
export function useSubmissionSort(filteredSubmissions: FormSubmissionItem[]) {
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });

  // Chuyển đổi trạng thái sort khi nhấn vào header cột: null -> asc -> desc -> null
  const handleToggleSort = (columnKey: string) => {
    setSortState((prev) => {
      if (prev.column !== columnKey) {
        return { column: columnKey, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { column: columnKey, direction: "desc" };
      }
      return { column: null, direction: null };
    });
  };

  // Hiển thị icon trạng thái sắp xếp theo chuẩn shadcn/ui
  const renderSortIcon = (columnKey: string) => {
    if (sortState.column !== columnKey || !sortState.direction) {
      return (
        <ArrowUpDown className="size-3.5 text-muted-foreground/50 hover:text-foreground shrink-0" />
      );
    }
    if (sortState.direction === "asc") {
      return <ArrowUp className="size-3.5 text-primary shrink-0" />;
    }
    return <ArrowDown className="size-3.5 text-primary shrink-0" />;
  };

  // Danh sách các bản nộp sau khi đã được sắp xếp
  const sortedSubmissions = useMemo(() => {
    if (!sortState.column || !sortState.direction) {
      return filteredSubmissions;
    }

    const { column, direction } = sortState;
    const modifier = direction === "asc" ? 1 : -1;

    // Sắp xếp theo STT (dựa vào id bản nộp)
    if (column === "stt") {
      return [...filteredSubmissions].sort(
        (a, b) => (a.id - b.id) * modifier,
      );
    }

    // Sắp xếp theo Thời gian nộp (createdAt)
    if (column === "createdAt") {
      return [...filteredSubmissions].sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return (timeA - timeB) * modifier;
      });
    }

    // Sắp xếp theo Cột trường tùy chọn (column là fieldId)
    const parsedCache = new Map<number, ParsedSubmissionField | undefined>();
    for (const sub of filteredSubmissions) {
      const { fields } = parseSubmissionFields(sub);
      const matchField = fields.find((f) => f.id === column);
      parsedCache.set(sub.id, matchField);
    }

    return [...filteredSubmissions].sort((a, b) => {
      const fieldA = parsedCache.get(a.id);
      const fieldB = parsedCache.get(b.id);

      const isFilledA = fieldA?.isFilled;
      const isFilledB = fieldB?.isFilled;

      // Ưu tiên dòng có dữ liệu lên trước dòng trống
      if (!isFilledA && !isFilledB) return 0;
      if (!isFilledA) return 1;
      if (!isFilledB) return -1;

      const type = fieldA?.type || fieldB?.type;
      const valA = fieldA?.value;
      const valB = fieldB?.value;

      // So sánh theo kiểu số
      if (type === "number") {
        const numA = Number(valA);
        const numB = Number(valB);
        if (Number.isFinite(numA) && Number.isFinite(numB)) {
          return (numA - numB) * modifier;
        }
      }

      // So sánh theo kiểu ngày tháng
      if (type === "date") {
        const dateA = new Date(String(valA)).getTime();
        const dateB = new Date(String(valB)).getTime();
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return (dateA - dateB) * modifier;
        }
      }

      // So sánh chuỗi tiêu chuẩn
      const strA = String(fieldA?.formattedValue || "");
      const strB = String(fieldB?.formattedValue || "");
      return strA.localeCompare(strB) * modifier;
    });
  }, [filteredSubmissions, sortState]);

  return {
    sortState,
    sortedSubmissions,
    handleToggleSort,
    renderSortIcon,
  };
}
