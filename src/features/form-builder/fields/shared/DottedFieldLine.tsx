import type { ReactNode } from "react";
import { DotDecoration } from "./DotDecoration";
import { InputOverlay } from "./InputOverlay";
import { useInlineEdit } from "./useInlineEdit";

export type DottedFieldLineProps = {
  label: string;
  value?: string;
  width?: number;
  showLabel?: boolean;
  showDottedLine?: boolean;
  placeholder?: string;
  children?: ReactNode;
  onLabelSave?: (newLabel: string) => void;
};

export function FieldLabel({
  label,
  isEditing,
  onLabelChange,
  onSubmit,
  onCancel,
  inputRef,
}: {
  label: string;
  isEditing: boolean;
  onLabelChange: (val: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <span className="shrink-0">
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
  placeholderHint,
}: {
  value?: string;
  placeholderHint?: string;
}) {
  if (!value) {
    if (placeholderHint) {
      return (
        <span className="relative z-10 select-none leading-[1.25] text-neutral-400 italic text-[11px] print:hidden px-1">
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
    <span className="relative z-10 pr-1 leading-[1.25]">
      {value}
    </span>
  );
}

/**
 * DottedFieldLine: Khung hiển thị dùng chung chuẩn cho các trường dạng dòng kẻ chấm (Text, Number, Date, Select)
 * Hỗ trợ nhấp đúp vào bất kỳ đâu trên dòng để chỉnh sửa trực tiếp nhãn khi nhãn hiển thị
 */
export function DottedFieldLine({
  label: initialLabel,
  value,
  width,
  showLabel = true,
  showDottedLine = true,
  placeholder,
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
        relative inline-flex items-baseline whitespace-nowrap overflow-hidden select-none cursor-text 
        ${width === undefined ? "w-max min-w-16" : "w-full"}`
      }
    >
      {showLabel && (
        <FieldLabel
          label={label}
          isEditing={isEditing}
          onLabelChange={setLabel}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          inputRef={inputRef}
        />
      )}
      <span className="relative inline-block min-w-0 flex-1 overflow-hidden leading-[1.25]">
        {showDottedLine && <DotDecoration />}
        <FieldValue value={value} placeholderHint={placeholderHint} />
        {children}
      </span>
    </span>
  );
}
