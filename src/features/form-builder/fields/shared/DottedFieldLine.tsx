import type { ReactNode } from "react";
import { DotDecoration } from "./DotDecoration";
import { InputOverlay } from "./InputOverlay";
import { useInlineEdit } from "./useInlineEdit";

export type DottedFieldLineProps = {
  label: string;
  value?: string;
  width?: number;
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

export function FieldValue({ value }: { value?: string }) {
  if (!value) {
    return (
      <span className="invisible relative z-10 select-none leading-[1.25]">
        &nbsp;
      </span>
    );
  }
  return (
    <span className="relative z-10 bg-white pr-1 leading-[1.25]">
      {value}
    </span>
  );
}

/**
 * DottedFieldLine: Khung hiển thị dùng chung chuẩn cho các trường dạng dòng kẻ chấm (Text, Number, Date, Select)
 * Hỗ trợ nhấp đúp vào bất kỳ đâu trên dòng để chỉnh sửa trực tiếp nhãn
 */
export function DottedFieldLine({
  label: initialLabel,
  value,
  width,
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

  return (
    <span
      style={width !== undefined ? { width: "100%" } : undefined}
      onDoubleClick={handleDoubleClick}
      className={`
        relative inline-flex items-baseline whitespace-nowrap overflow-hidden select-none cursor-text 
        ${width === undefined ? "w-max" : "w-full"}`
      }
    >
      <FieldLabel
        label={label}
        isEditing={isEditing}
        onLabelChange={setLabel}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        inputRef={inputRef}
      />
      <span className="relative inline-block min-w-0 flex-1 overflow-hidden leading-[1.25]">
        <DotDecoration />
        <FieldValue value={value} />
        {children}
      </span>
    </span>
  );
}
