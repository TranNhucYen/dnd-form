import { DotDecoration } from "../shared/DotDecoration";
import { FieldScopeSlot } from "../shared/FieldScopeSlot";
import { getFieldPartStyle } from "../shared/fieldStyle.utils";
import { InputOverlay } from "../shared/InputOverlay";
import { useInlineEdit } from "../shared/useInlineEdit";
import type { FieldProps, DateFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";

/**
 * DateSlot: Ô trong ngày tháng năm (Giá trị - Value)
 */
function DateSlot({
  fieldId,
  value,
  className,
  showDottedLine = true,
  style,
}: {
  fieldId?: string;
  value?: string;
  className: string;
  showDottedLine?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <FieldScopeSlot
      fieldId={fieldId}
      scope="value"
      className={`relative inline-flex h-[1lh] items-center justify-center overflow-hidden leading-[1.25] ${className}`}
    >
      {showDottedLine && <DotDecoration />}
      {value && (
        <span style={style} className="relative z-10 select-none px-0.5 leading-[1.25]">
          {value}
        </span>
      )}
    </FieldScopeSlot>
  );
}

export function DateField({
  id,
  data,
  style,
  width,
  onDataChange,
}: FieldProps<DateFieldData>) {
  const fieldData = data;
  const { showDateLabels, showDottedLine } = fieldData;

  const labelCustomStyle = getFieldPartStyle(style, "label");
  const valueCustomStyle = getFieldPartStyle(style, "value");

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
        relative inline-flex items-center whitespace-nowrap overflow-hidden select-none ${isEditing ? "cursor-text" : "cursor-move"}
        ${width === undefined ? "w-max min-w-16" : "w-full"}
      `}
    >
      {/* Vùng địa điểm dạng chấm (Giá trị - Value) */}
      <FieldScopeSlot
        fieldId={id}
        scope="value"
        isEditing={isEditing}
        className="relative inline-block h-[1lh] min-w-6 flex-1 overflow-hidden leading-[1.25]"
      >
        {showDottedLine && <DotDecoration />}
        {locationText && (
          <span
            style={valueCustomStyle}
            className={`relative z-10 select-none pr-1 leading-[1.25] ${
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
      </FieldScopeSlot>

      {/* Placeholder gợi ý khi ẩn hết và chưa có giá trị */}
      {isCompletelyEmptyAndHidden && (
        <span className="relative z-10 select-none leading-[1.25] text-neutral-400 italic text-[11px] print:hidden px-1">
          [Ngày tháng năm]
        </span>
      )}

      {/* Phần ngày tháng năm */}
      <span className="shrink-0 inline-flex items-center leading-[1.25]">
        {showDateLabels ? (
          <FieldScopeSlot
            fieldId={id}
            scope="label"
            style={labelCustomStyle}
            className="select-none"
          >
            , ngày&nbsp;
          </FieldScopeSlot>
        ) : (
          <span className="w-2 shrink-0 inline-block" />
        )}
        <DateSlot
          fieldId={id}
          value={day}
          className="min-w-7"
          showDottedLine={showDottedLine}
          style={valueCustomStyle}
        />
        {showDateLabels ? (
          <FieldScopeSlot
            fieldId={id}
            scope="label"
            style={labelCustomStyle}
            className="select-none"
          >
            &nbsp;tháng&nbsp;
          </FieldScopeSlot>
        ) : (
          <span className="w-2 shrink-0 inline-block" />
        )}
        <DateSlot
          fieldId={id}
          value={month}
          className="min-w-7"
          showDottedLine={showDottedLine}
          style={valueCustomStyle}
        />
        {showDateLabels ? (
          <FieldScopeSlot
            fieldId={id}
            scope="label"
            style={labelCustomStyle}
            className="select-none"
          >
            &nbsp;năm&nbsp;
          </FieldScopeSlot>
        ) : (
          <span className="w-2 shrink-0 inline-block" />
        )}
        <DateSlot
          fieldId={id}
          value={year}
          className="min-w-10"
          showDottedLine={showDottedLine}
          style={valueCustomStyle}
        />
      </span>
    </span>
  );
}
