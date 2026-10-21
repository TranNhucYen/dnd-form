import { Check } from "lucide-react";
import type { FieldProps, CheckboxFieldData } from "../types/field.types";
import { InputOverlay } from "../shared/InputOverlay";
import { useInlineEdit } from "../shared/useInlineEdit";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function CheckboxField({
  data,
  onDataChange,
}: FieldProps<CheckboxFieldData>) {
  const { checked, showLabel, showBorder } = data;

  const {
    value: labelText,
    setValue: setLabelText,
    isEditing,
    inputRef,
    handleDoubleClick,
    handleSubmit,
    handleCancel,
  } = useInlineEdit(data.label, (newLabel) => {
    onDataChange?.({ label: newLabel });
  });

  return (
    <div
      onDoubleClick={showLabel ? handleDoubleClick : undefined}
      className="flex h-full w-max shrink-0 items-center gap-2 whitespace-nowrap select-none cursor-text"
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          onDataChange?.({ checked: !checked });
        }}
        className={`flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-none transition-colors ${
          showBorder
            ? "border border-gray-400 bg-white"
            : "border border-dashed border-neutral-300 print:border-transparent bg-transparent"
        }`}
        title={checked ? "Bỏ chọn" : "Chọn"}
      >
        {checked && <Check className="size-3 text-neutral-800" strokeWidth={3} />}
      </span>

      {showLabel && (
        <span className="relative inline-block min-w-4">
          <span className={`select-none whitespace-pre ${isEditing ? "invisible" : ""}`}>
            {labelText || " "}
          </span>
          {isEditing && (
            <InputOverlay
              value={labelText}
              onChange={setLabelText}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              inputRef={inputRef}
            />
          )}
        </span>
      )}
    </div>
  );
}
