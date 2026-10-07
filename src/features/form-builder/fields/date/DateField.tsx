import { DotDecoration } from "../shared/DotDecoration";
import { InputOverlay } from "../shared/InputOverlay";
import { useInlineEdit } from "../shared/useInlineEdit";
import type { FieldProps, DateFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";

/**
 * DateSlot: Ô trong ngày tháng năm
 */
function DateSlot({ value, className }: { value?: string; className: string }) {
  return (
    <span
      className={`relative inline-flex h-[1lh] items-center justify-center overflow-hidden leading-[1.25] ${className}`}
    >
      <DotDecoration />
      {value && <span className="relative z-10 px-0.5 leading-[1.25]">{value}</span>}
    </span>
  );
}

export function DateField({
  data,
  width,
  onDataChange,
}: FieldProps<DateFieldData> = {}) {
  const location = data?.label ?? DEFAULT_FIELD_DATA.date.label;
  const {
    value: locationText,
    setValue: setLocationText,
    isEditing,
    inputRef,
    handleDoubleClick,
    handleSubmit,
    handleCancel,
  } = useInlineEdit(location, (newLabel) => {
    onDataChange?.({ label: newLabel });
  });

  // Ngày được lưu dạng "dd/MM/yyyy" (xem DateToolbar)
  const [day, month, year] = data?.value?.split("/") ?? [];

  return (
    <span
      style={width !== undefined ? { width: "100%" } : undefined}
      onDoubleClick={handleDoubleClick}
      className={`
        relative inline-flex items-center whitespace-nowrap overflow-hidden select-none cursor-text
        ${width === undefined ? "w-max" : "w-full"}
      `}
    >
      {/* Vùng địa điểm dạng chấm (tái sử dụng DotDecoration) */}
      <span className="relative inline-block h-[1lh] min-w-6 flex-1 overflow-hidden leading-[1.25]">
        <DotDecoration />
        {locationText && (
          <span
            className={`relative z-10 pr-1 leading-[1.25] ${
              isEditing ? "invisible" : ""
            }`}
          >
            {locationText}
          </span>
        )}
        {isEditing && (
          <InputOverlay
            value={locationText}
            onChange={setLocationText}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            inputRef={inputRef}
          />
        )}
      </span>
      {/* Phần value ngày tháng năm */}
      <span className="shrink-0 inline-flex items-center leading-[1.25]">
        <span>, ngày </span>
        <DateSlot value={day} className="min-w-7" />
        <span> tháng </span>
        <DateSlot value={month} className="min-w-7" />
        <span> năm </span>
        <DateSlot value={year} className="min-w-10" />
      </span>
    </span>
  );
}
