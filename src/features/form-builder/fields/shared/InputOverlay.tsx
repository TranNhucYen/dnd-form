import type React from "react";

export type InputOverlayProps = {
  value: string;
  onChange: (nextValue: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

/**
 * InputOverlay: Khung nhập liệu đè trực tiếp lên phần tử khi người dùng kích hoạt chế độ chỉnh sửa text/value/label
 */
export function InputOverlay({
  value,
  onChange,
  onSubmit,
  onCancel,
  inputRef,
}: InputOverlayProps) {
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onSubmit}
      onDoubleClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onSubmit();
        }

        if (event.key === "Escape") {
          onCancel();
        }
      }}
      className="absolute inset-0 z-30 m-0 border-none bg-transparent p-0 font-[inherit] text-[inherit] outline-none select-text"
    />
  );
}
