import { DotDecoration } from "../shared/DotDecoration";
import { InputOverlay } from "../shared/InputOverlay";
import { useInlineEdit } from "../shared/useInlineEdit";
import type { FieldProps, DateFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";

/**
 * DateSlot: Ô trong ngày tháng năm
 */
function DateSlot({
  value,
  className,
  showDottedLine = true,
}: {
  value?: string;
  className: string;
  showDottedLine?: boolean;
}) {
  return (
    <span
      className={`relative inline-flex h-[1lh] items-center justify-center overflow-hidden leading-[1.25] ${className}`}
    >
      {showDottedLine && <DotDecoration />}
      {value && <span className="relative z-10 px-0.5 leading-[1.25]">{value}</span>}
    </span>
  );
}

export function DateField({
  data,
  width,
  onDataChange,
}: FieldProps<DateFieldData> = {}) {
  const fieldData = { ...DEFAULT_FIELD_DATA.date, ...data };
  const { showDateLabels, showDottedLine } = fieldData;

  const {
    value: locationText,
    setValue: setLocationText,
    isEditing,
    inputRef,
    handleDoubleClick,
    handleSubmit,
    handleCancel,
  } = useInlineEdit(fieldData.label, (newLabel) => {
    onDataChange?.({ label: newLabel });
  });

  // Ngày được lưu dạng "dd/MM/yyyy" (xem DateToolbar)
  const [day, month, year] = fieldData.value?.split("/") ?? [];

  const isCompletelyEmptyAndHidden =
    !showDateLabels && !showDottedLine && !locationText && !day && !month && !year;

  return (
    <span
      style={width !== undefined ? { width: "100%" } : undefined}
      onDoubleClick={handleDoubleClick}
      className={`
        relative inline-flex items-center whitespace-nowrap overflow-hidden select-none cursor-text
        ${width === undefined ? "w-max min-w-16" : "w-full"}
      `}
    >
      {/* Vùng địa điểm dạng chấm */}
      <span className="relative inline-block h-[1lh] min-w-6 flex-1 overflow-hidden leading-[1.25]">
        {showDottedLine && <DotDecoration />}
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

      {/* Placeholder gợi ý khi ẩn hết và chưa có giá trị */}
      {isCompletelyEmptyAndHidden && (
        <span className="relative z-10 select-none leading-[1.25] text-neutral-400 italic text-[11px] print:hidden px-1">
          [Ngày tháng năm]
        </span>
      )}

      {/* Phần value ngày tháng năm */}
      <span className="shrink-0 inline-flex items-center leading-[1.25]">
        {showDateLabels ? <span>, ngày </span> : <span className="w-2 shrink-0 inline-block" />}
        <DateSlot value={day} className="min-w-7" showDottedLine={showDottedLine} />
        {showDateLabels ? <span> tháng </span> : <span className="w-2 shrink-0 inline-block" />}
        <DateSlot value={month} className="min-w-7" showDottedLine={showDottedLine} />
        {showDateLabels ? <span> năm </span> : <span className="w-2 shrink-0 inline-block" />}
        <DateSlot value={year} className="min-w-10" showDottedLine={showDottedLine} />
      </span>
    </span>
  );
}
