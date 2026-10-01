"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface FormTitleInputProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
}

export function FormTitleInput({
  inputRef,
  defaultValue = "Biểu mẫu chưa đặt tên",
  className,
  disabled,
}: FormTitleInputProps) {
  return (
    <Input
      ref={inputRef}
      defaultValue={defaultValue}
      disabled={disabled}
      placeholder="Nhập tên biểu mẫu..."
      title={disabled ? "Chế độ chỉ xem" : "Nhấp đúp chuột để đổi tên"}
      onDoubleClick={(e) => e.currentTarget.select()}
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
