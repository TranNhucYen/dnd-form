import { useEffect, useRef, useState } from "react";
import type { FieldProps, LabelFieldData } from "../types/field.types";
import { TextareaOverlay } from "../shared/TextareaOverlay";

export function LabelField({
  data,
  onDataChange,
}: FieldProps<LabelFieldData> = {}) {
  const initialText = data?.value ?? "Nhãn";
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.focus();
      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);

      requestAnimationFrame(() => {
        textarea.setSelectionRange(length, length);
      });
    }
  }, [isEditing]);

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsEditing(true);
  };

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
            onSubmit={() => {
              setIsEditing(false);
              onDataChange?.({ value: text });
            }}
            onCancel={() => {
              setText(initialText);
              setIsEditing(false);
            }}
            textareaRef={textareaRef}
          />
        )}
      </span>
    </div>
  );
}

