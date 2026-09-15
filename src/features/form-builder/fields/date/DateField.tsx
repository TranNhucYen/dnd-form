import { DotDecoration } from "../shared/DotDecoration";
import { InputOverlay } from "../shared/InputOverlay";
import { useInlineEdit } from "../shared/useInlineEdit";
import type { FieldProps } from "../types/field.types";

export function DateField({
  label = "",
  value = "24/08/2026",
  width,
}: FieldProps = {}) {
  const {
    value: locationText,
    setValue: setLocationText,
    isEditing,
    inputRef,
    handleDoubleClick,
    handleSubmit,
    handleCancel,
  } = useInlineEdit(label);

  return (
    <span
      style={width !== undefined ? { width: "100%" } : undefined}
      onDoubleClick={handleDoubleClick}
      className={`
        relative inline-flex items-center whitespace-nowrap overflow-hidden select-none cursor-text
        ${width === undefined ? "w-max" : "w-full"}
      `}
    >
      {/* Vùng địa điểm dạng chấm (tái sử dụng DotDecoration) */}
      <span className="relative inline-block h-[1lh] min-w-6 flex-1 overflow-hidden leading-[1.25]">
        <DotDecoration />
        {locationText && (
          <span
            className={`relative z-10 bg-white pr-1 leading-[1.25] ${
              isEditing ? "invisible" : ""
            }`}
          >
            {locationText}
          </span>
        )}
        {isEditing && (
          <InputOverlay
            value={locationText}
            onChange={setLocationText}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            inputRef={inputRef}
          />
        )}
      </span>
      {/* Phần value ngày tháng năm */}
      <span className="shrink-0 inline-flex items-center leading-[1.25]">
        <span>, ngày </span>
        <span className="relative inline-block h-[1lh] w-7 overflow-hidden leading-[1.25]">
          <DotDecoration />
        </span>
        <span> tháng </span>
        <span className="relative inline-block h-[1lh] w-7 overflow-hidden leading-[1.25]">
          <DotDecoration />
        </span>
        <span> năm </span>
        <span className="relative inline-block h-[1lh] w-10 overflow-hidden leading-[1.25]">
          <DotDecoration />
        </span>
      </span>
    </span>
  );
}
