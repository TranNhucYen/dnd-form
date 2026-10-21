import type { FieldProps, LabelFieldData } from "../types/field.types";
import { TextareaOverlay } from "../shared/TextareaOverlay";
import { useInlineEdit } from "../shared/useInlineEdit";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function LabelField({
  data,
  onDataChange,
}: FieldProps<LabelFieldData>) {
  const initialText = data.value;
  const {
    value: text,
    setValue: setText,
    isEditing,
    inputRef: textareaRef,
    handleDoubleClick,
    handleSubmit,
    handleCancel,
  } = useInlineEdit<HTMLTextAreaElement>(initialText, (newText) => {
    onDataChange?.({ value: newText });
  });

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="relative flex h-full w-full shrink-0 overflow-hidden px-1 py-0.5 select-none cursor-text"
    >
      <span className="relative block h-full w-full">
        <span
          className={`block whitespace-pre-wrap break-words leading-normal ${isEditing ? "invisible" : ""}`}
        >
          {text}
        </span>
        {isEditing && (
          <TextareaOverlay
            value={text}
            onChange={setText}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            textareaRef={textareaRef}
          />
        )}
      </span>
    </div>
  );
}

