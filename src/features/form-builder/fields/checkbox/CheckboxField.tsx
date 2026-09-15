import type { FieldProps } from "../types/field.types";
import { InputOverlay } from "../shared/InputOverlay";
import { useInlineEdit } from "../shared/useInlineEdit";

export function CheckboxField({ label = "Xác nhận" }: FieldProps = {}) {
  const {
    value: labelText,
    setValue: setLabelText,
    isEditing,
    inputRef,
    handleDoubleClick,
    handleSubmit,
    handleCancel,
  } = useInlineEdit(label);

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="flex h-full w-max shrink-0 items-center gap-2 whitespace-nowrap select-none cursor-text"
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-400 bg-white" />
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
