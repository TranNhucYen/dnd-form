import { Check } from "lucide-react";
import type { FieldProps, CheckboxFieldData } from "../types/field.types";
import { InputOverlay } from "../shared/InputOverlay";
import { useInlineEdit } from "../shared/useInlineEdit";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function CheckboxField({
  data,
  onDataChange,
}: FieldProps<CheckboxFieldData> = {}) {
  const currentLabel = data?.label ?? DEFAULT_FIELD_DATA.checkbox.label;
  const {
    value: labelText,
    setValue: setLabelText,
    isEditing,
    inputRef,
    handleDoubleClick,
    handleSubmit,
    handleCancel,
  } = useInlineEdit(currentLabel, (newLabel) => {
    onDataChange?.({ label: newLabel });
  });

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="flex h-full w-max shrink-0 items-center gap-2 whitespace-nowrap select-none cursor-text"
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          onDataChange?.({ checked: !data?.checked });
        }}
        className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border border-gray-400 bg-white"
        title={data?.checked ? "Bỏ chọn" : "Chọn"}
      >
        {data?.checked && <Check className="size-3 text-neutral-800" strokeWidth={3} />}
      </span>
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
    </div>
  );
}
