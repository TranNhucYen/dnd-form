import type React from "react";

export type TextareaOverlayProps = {
  value: string;
  onChange: (nextValue: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

/**
 * TextareaOverlay: Khung nhập liệu nhiều dòng (textarea) đè trực tiếp lên phần tử khi chỉnh sửa văn bản.
 */
export function TextareaOverlay({
  value,
  onChange,
  onSubmit,
  onCancel,
  textareaRef,
}: TextareaOverlayProps) {
  return (
    <textarea
      className="
        absolute inset-0 z-30 m-0 resize-none border-none bg-transparent p-0 
        font-[inherit] text-[inherit] leading-normal outline-none select-text whitespace-pre-wrap break-words"
      ref={textareaRef}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onSubmit}
      onDoubleClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          onSubmit();
          return;
        }

        if (event.key === "Escape") {
          onCancel();
        }
      }}
    />
  );
}
