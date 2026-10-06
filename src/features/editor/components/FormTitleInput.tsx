"use client";

import { useEffect } from "react";
import type React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface FormTitleInputProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
  onTitleChange?: (title: string) => void;
}

export function FormTitleInput({
  inputRef,
  defaultValue = "Biểu mẫu chưa đặt tên",
  className,
  disabled,
  onTitleChange,
}: FormTitleInputProps) {
  // Đồng bộ giá trị input khi defaultValue thay đổi từ bên ngoài (ví dụ nạp form hoặc lưu thành công)
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== defaultValue) {
      inputRef.current.value = defaultValue;
    }
  }, [defaultValue, inputRef]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const trimmed = e.currentTarget.value.trim();
    const finalValue = trimmed || defaultValue || "Biểu mẫu chưa đặt tên";
    e.currentTarget.value = finalValue;
    onTitleChange?.(finalValue);
  };

  return (
    <Input
      ref={inputRef}
      defaultValue={defaultValue}
      disabled={disabled}
      maxLength={150}
      placeholder="Nhập tên biểu mẫu..."
      title={disabled ? "Chế độ chỉ xem" : "Nhấp đúp chuột để đổi tên"}
      onDoubleClick={(e) => e.currentTarget.select()}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      className={cn(
        "h-auto w-auto [field-sizing:content] min-w-32 max-w-full rounded-sm pl-0 py-0.5 text-xl font-bold",
        "border-transparent focus-visible:border-ring",
        "shadow-none focus-visible:ring-0",
        className,
      )}
    />
  );
}
