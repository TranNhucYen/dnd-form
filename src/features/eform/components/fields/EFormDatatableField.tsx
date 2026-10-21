"use client";

import { useMemo } from "react";
import type { DatatableFieldData } from "@/features/form-builder/types/formBuilder.types";
import { getEFormTableData } from "../../engine/table-ast-parser";

interface EFormDatatableFieldProps {
  data: DatatableFieldData;
}

export function EFormDatatableField({ data }: EFormDatatableFieldProps) {
  const tableData = useMemo(() => {
    return getEFormTableData(data.html);
  }, [data.html]);

  if (!tableData || tableData.rows.length === 0) {
    return (
      <div className="w-full border border-dashed border-neutral-300 p-4 text-center text-xs text-neutral-400">
        Bảng không có dữ liệu
      </div>
    );
  }

  // Chiều rộng tối thiểu của bảng để bảo đảm không bị ép chữ trên mobile
  const minWidth = Math.max(300, tableData.totalColumns * 85);

  // Ô đầu tiên có thể điền: mặc định được tô viền xanh dù chưa focus
  const firstEditableCellId = tableData.rows
    .flatMap((row) => row.cells)
    .find((cell) => !(cell.isHeader && cell.text))?.id;

  return (
    <div className="w-full min-w-0 max-w-full my-2">
      <div className="group/tbl w-full max-w-full overflow-x-auto overscroll-x-contain border border-neutral-300 bg-white shadow-2xs [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
        <table
          style={{ minWidth: `${minWidth}px` }}
          className="w-full border-collapse table-fixed text-xs md:text-sm"
        >
          {/* Phân bổ các cột đều nhau theo yêu cầu người dùng */}
          <colgroup>
            {Array.from({ length: tableData.totalColumns }).map((_, index) => (
              <col
                key={index}
                style={{ width: `${100 / tableData.totalColumns}%` }}
              />
            ))}
          </colgroup>

          <tbody>
            {tableData.rows.map((row) => (
              <tr key={row.id} className="border-b border-neutral-300 last:border-b-0">
                {row.cells.map((cell) => {
                  const CellTag = cell.isHeader ? "th" : "td";

                  return (
                    <CellTag
                      key={cell.id}
                      colSpan={cell.colSpan > 1 ? cell.colSpan : undefined}
                      rowSpan={cell.rowSpan > 1 ? cell.rowSpan : undefined}
                      className={`border border-neutral-300 p-1.5 md:p-2 align-middle transition-colors focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-primary ${
                        cell.id === firstEditableCellId
                          ? "outline-2 -outline-offset-1 outline-primary group-focus-within/tbl:not-focus-within:outline-transparent"
                          : ""
                      } ${
                        cell.isHeader
                          ? "bg-neutral-100 font-semibold text-neutral-800"
                          : "bg-white text-neutral-800"
                      } ${
                        cell.style?.textAlign === "center"
                          ? "text-center"
                          : cell.style?.textAlign === "right"
                            ? "text-right"
                            : "text-left"
                      } ${cell.style?.bold ? "font-bold" : ""} ${
                        cell.style?.italic ? "italic" : ""
                      }`}
                    >
                      {cell.isHeader && cell.text ? (
                        <div className="break-words select-text">
                          {cell.text}
                        </div>
                      ) : (
                        // Ô thường (td) và ô tiêu đề trống đều có thể điền; nội dung có sẵn là giá trị mặc định
                        <textarea
                          rows={1}
                          defaultValue={cell.text}
                          aria-label="Ô nhập liệu bảng"
                          placeholder="..."
                          className="block w-full resize-none bg-transparent border-0 p-0 text-xs md:text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none [field-sizing:content]"
                        />
                      )}
                    </CellTag>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Chỉ báo cuộn ngang trên màn hình nhỏ */}
      <div className="mt-1 block text-right text-[11px] text-neutral-400 md:hidden">
        ↔ Vuốt ngang nếu bảng bị tràn
      </div>
    </div>
  );
}
