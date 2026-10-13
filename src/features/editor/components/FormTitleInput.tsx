"use client";

import { useEffect, useRef } from "react";
import type React from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useFormBuilderStore } from "@/features/form-builder/store/useFormBuilderStore";
import { cn } from "@/lib/utils";

export interface FormTitleInputProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  defaultValue?: string;
  savedTitle?: string;
  className?: string;
  disabled?: boolean;
  onTitleChange?: (title: string) => void;
}

export function FormTitleInput({
  inputRef,
  defaultValue = "Biểu mẫu chưa đặt tên",
  savedTitle,
  className,
  disabled,
  onTitleChange,
}: FormTitleInputProps) {
  const currentSavedTitle = (savedTitle ?? defaultValue).trim();
  const lastAlertedValueRef = useRef<string>(currentSavedTitle);

  // Cập nhật mốc kiểm tra khi savedTitle từ server thay đổi (khi load form hoặc khi save thành công)
  useEffect(() => {
    lastAlertedValueRef.current = currentSavedTitle;
  }, [currentSavedTitle]);

  // Đồng bộ giá trị input khi defaultValue thay đổi từ bên ngoài (ví dụ nạp form hoặc lưu thành công)
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== defaultValue) {
      inputRef.current.value = defaultValue;
    }
  }, [defaultValue, inputRef]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value.trim();
    if (val !== currentSavedTitle) {
      // Khi người dùng đang gõ tên khác tên thật, làm sáng nút Lưu
      useFormBuilderStore.getState().setIsDirty(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Nếu blur vì người dùng đang click vào nút Lưu (SaveTool), không khôi phục để nút Lưu kịp thực thi
    const isSaveTool = Boolean(
      e.relatedTarget?.closest("[data-save-tool]") ||
      (document.activeElement && document.activeElement.closest("[data-save-tool]")),
    );
    if (isSaveTool) {
      return;
    }

    const trimmed = e.currentTarget.value.trim();
    const finalValue = trimmed || defaultValue || "Biểu mẫu chưa đặt tên";

    // Nếu tên khác với tên thật sự đã lưu trên hệ thống
    if (finalValue !== currentSavedTitle) {
      // Khôi phục lại tên cũ trên ô input và state
      e.currentTarget.value = currentSavedTitle;
      onTitleChange?.(currentSavedTitle);

      // Thông báo cho người dùng biết cần bấm Lưu để áp dụng tên mới
      toast.info("Cần bấm lưu để đổi tên");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = e.currentTarget.value.trim();
      const finalValue = trimmed || defaultValue || "Biểu mẫu chưa đặt tên";

      if (finalValue !== currentSavedTitle) {
        onTitleChange?.(finalValue);
        useFormBuilderStore.getState().triggerSave();
      }
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.currentTarget.value = currentSavedTitle;
      onTitleChange?.(currentSavedTitle);
      e.currentTarget.blur();
    }
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
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={cn(
        "h-auto w-auto [field-sizing:content] min-w-32 max-w-full rounded-sm pl-0 py-0.5 text-xl font-bold",
        "border-transparent focus-visible:border-ring",
        "shadow-none focus-visible:ring-0",
        className,
      )}
    />
  );
}
