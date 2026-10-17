import type { ReactNode } from "react";
import type { FieldStyle } from "../../types/formBuilder.types";
import { DotDecoration } from "./DotDecoration";
import { FieldScopeSlot } from "./FieldScopeSlot";
import { getFieldPartStyle } from "./fieldStyle.utils";
import { InputOverlay } from "./InputOverlay";
import { useInlineEdit } from "./useInlineEdit";

export type DottedFieldLineProps = {
  fieldId?: string;
  label: string;
  value?: string;
  width?: number;
  showLabel?: boolean;
  showDottedLine?: boolean;
  placeholder?: string;
  style?: FieldStyle;
  children?: ReactNode;
  onLabelSave?: (newLabel: string) => void;
};

export function FieldLabel({
  label,
  isEditing,
  style,
  onLabelChange,
  onSubmit,
  onCancel,
  inputRef,
}: {
  label: string;
  isEditing: boolean;
  style?: FieldStyle;
  onLabelChange: (val: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const labelCustomStyle = getFieldPartStyle(style, "label");

  return (
    <span className="shrink-0" style={labelCustomStyle}>
      <span className="relative inline-block min-w-6">
        {/* Thẻ span giúp có dãn theo text người dùng nhập */}
        <span className={`select-none whitespace-pre ${isEditing ? "invisible" : ""}`}>
          {label || " "}
        </span>
        {isEditing && (
          <InputOverlay
            value={label}
            onChange={onLabelChange}
            onSubmit={onSubmit}
            onCancel={onCancel}
            inputRef={inputRef}
          />
        )}
      </span>
      <span>: </span>
    </span>
  );
}

export function FieldValue({
  value,
  style,
  placeholderHint,
}: {
  value?: string;
  style?: FieldStyle;
  placeholderHint?: string;
}) {
  const valueCustomStyle = getFieldPartStyle(style, "value");

  if (!value) {
    if (placeholderHint) {
      return (
        <span
          style={valueCustomStyle}
          className="relative z-10 select-none leading-[1.25] text-neutral-400 italic text-[11px] print:hidden px-1"
        >
          {placeholderHint}
        </span>
      );
    }
    return (
      <span className="invisible relative z-10 select-none leading-[1.25]">
        &nbsp;
      </span>
    );
  }
  return (
    <span
      style={valueCustomStyle}
      className="relative z-10 select-none pr-1 leading-[1.25]"
    >
      {value}
    </span>
  );
}

/**
 * DottedFieldLine: Khung hiển thị dùng chung chuẩn cho các trường dạng dòng kẻ chấm (Text, Number, Date, Select)
 * Hỗ trợ nhấp đúp vào bất kỳ đâu trên dòng để chỉnh sửa trực tiếp nhãn khi nhãn hiển thị
 */
export function DottedFieldLine({
  fieldId,
  label: initialLabel,
  value,
  width,
  showLabel = true,
  showDottedLine = true,
  placeholder,
  style,
  children,
  onLabelSave,
}: DottedFieldLineProps) {
  const {
    value: label,
    setValue: setLabel,
    isEditing,
    inputRef,
    handleDoubleClick,
    handleSubmit,
    handleCancel,
  } = useInlineEdit(initialLabel, onLabelSave);

  const isBothHiddenAndEmpty = !showLabel && !showDottedLine && !value;
  const placeholderHint = isBothHiddenAndEmpty ? `[${placeholder || label || "Ô nhập"}]` : undefined;

  return (
    <span
      style={width !== undefined ? { width: "100%" } : undefined}
      onDoubleClick={showLabel ? handleDoubleClick : undefined}
      className={`
        relative inline-flex items-baseline whitespace-nowrap overflow-hidden select-none ${isEditing ? "cursor-text" : "cursor-move"}
        ${width === undefined ? "w-max min-w-16" : "w-full"}`
      }
    >
      {showLabel && (
        <FieldScopeSlot
          fieldId={fieldId}
          scope="label"
          isEditing={isEditing}
          className="shrink-0"
        >
          <FieldLabel
            label={label}
            isEditing={isEditing}
            style={style}
            onLabelChange={setLabel}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            inputRef={inputRef}
          />
        </FieldScopeSlot>
      )}
      <FieldScopeSlot
        fieldId={fieldId}
        scope="value"
        className="relative inline-block min-w-0 flex-1 overflow-hidden leading-[1.25]"
      >
        {showDottedLine && <DotDecoration />}
        <FieldValue value={value} style={style} placeholderHint={placeholderHint} />
        {children}
      </FieldScopeSlot>
    </span>
  );
}
