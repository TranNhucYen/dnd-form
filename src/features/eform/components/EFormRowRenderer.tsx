import type { EFormRow } from "../types/eform.types";
import { EFormFieldRenderer } from "./fields/EFormFieldRenderer";

interface EFormRowRendererProps {
  row: EFormRow;
  onValueChange?: (fieldId: string, value: unknown) => void;
}

export function EFormRowRenderer({ row, onValueChange }: EFormRowRendererProps) {
  if (!row.elements || row.elements.length === 0) return null;

  // Nếu chỉ có 1 phần tử trên dòng: chiếm trọn 100% chiều ngang
  if (row.elements.length === 1) {
    return (
      <div className="w-full min-w-0 max-w-full my-2">
        <EFormFieldRenderer
          element={row.elements[0]}
          onValueChange={onValueChange}
        />
      </div>
    );
  }

  // Nếu có nhiều phần tử chung dòng: trên màn hình >= sm/md chia đều (md:flex-1), trên mobile xếp chồng dọc
  return (
    <div className="flex w-full min-w-0 max-w-full flex-col md:flex-row gap-4 md:items-end my-2">
      {row.elements.map((element) => (
        <div key={element.id} className="w-full min-w-0 max-w-full md:flex-1">
          <EFormFieldRenderer
            element={element}
            onValueChange={onValueChange}
          />
        </div>
      ))}
    </div>
  );
}
