import { memo } from "react";
import { CopyPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FIELD_DEFINITIONS_MAP } from "../../constants/fields.config";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import { FieldToolbarRenderer } from "../../fields/FieldToolbarRenderer";
import type { FieldData, FieldType } from "../../types/formBuilder.types";

type FieldFloatingToolbarProps = {
  fieldId: string;
  type: FieldType;
  position: { x: number; y: number };
  data?: FieldData;
  onDataChange: (
    patch: Partial<FieldData>,
    options?: { skipHistory?: boolean },
  ) => void;
};

/**
 * FieldFloatingToolbar: Thanh công cụ nổi xuất hiện ngay trên hoặc dưới Field khi đang được chọn
 */
export const FieldFloatingToolbar = memo(function FieldFloatingToolbar({
  fieldId,
  type,
  position,
  data,
  onDataChange,
}: FieldFloatingToolbarProps) {
  const duplicateField = useFormBuilderStore((state) => state.duplicateField);
  const removeField = useFormBuilderStore((state) => state.removeField);

  // Nếu field nằm quá sát mép trên canvas (y < 42), hiển thị thanh toolbar phía dưới field
  const isNearTopEdge = position.y < 42;
  const def = FIELD_DEFINITIONS_MAP[type];

  return (
    <div
      data-toolbar="true"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        left: 0,
        ...(isNearTopEdge
          ? { top: "calc(100% + 6px)" }
          : { bottom: "calc(100% + 6px)" }),
      }}
      className="
        z-30 flex items-center gap-1 rounded-md border border-neutral-200/90 bg-white/95 px-1.5 py-1 
        shadow-md backdrop-blur-xs select-none animate-in fade-in zoom-in-95 duration-100"
    >
      {/* Badge tên loại field */}
      <div className="flex items-center gap-1 rounded bg-neutral-100/90 px-1.5 py-0.5 text-[11px] font-medium text-neutral-600">
        <span className="size-3.5 [&_svg]:size-3.5">{def?.icon}</span>
        <span className="truncate max-w-20">{def?.label}</span>
      </div>

      <div className="h-3.5 w-px bg-neutral-200" />

      {/* Controls đặc thù theo loại dữ liệu của Field */}
      <FieldToolbarRenderer
        type={type}
        id={fieldId}
        data={data}
        onDataChange={onDataChange}
      />

      <div className="h-3.5 w-px bg-neutral-200" />

      {/* Thao tác chung: Nhân bản & Xóa */}
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => duplicateField(fieldId)}
          className="size-7 p-0 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
          title="Nhân bản (Ctrl+D)"
        >
          <CopyPlus className="size-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeField(fieldId)}
          className="size-7 p-0 text-neutral-500 hover:text-red-600 hover:bg-red-50"
          title="Xóa field (Del)"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
});
