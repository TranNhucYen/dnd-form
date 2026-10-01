"use client";

import { useEffect, useRef, useState } from "react";
import type { FieldProps, ImageFieldData } from "../types/field.types";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadMediaAction } from "@/features/editor/actions/upload.action";
import { validateImageFile, ACCEPT_IMAGE_TYPES } from "./image.utils";

export function ImageField({
  data,
  onDataChange,
}: FieldProps<ImageFieldData> = {}) {
  const [url, setUrl] = useState(data?.value ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Đồng bộ url khi data.value từ props thay đổi (ví dụ khi nạp form, undo/redo)
  useEffect(() => {
    setUrl(data?.value ?? "");
  }, [data?.value]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file phía client 
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadMediaAction(formData);

      if (res.success) {
        setUrl(res.data.url);
        onDataChange?.({ value: res.data.url, key: res.data.key });
      } else {
        toast.error(res.error || "Tải tập tin lên thất bại");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải ảnh lên");
      console.error("[ImageField] Upload error:", error);
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleTriggerUpload = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isUploading) return;
    inputRef.current?.click();
  };

  return (
    <div
      onClick={!url && !isUploading ? handleTriggerUpload : undefined}
      onDoubleClick={url && !isUploading ? handleTriggerUpload : undefined}
      title={url ? "Nhấp đúp để thay đổi ảnh" : undefined}
      className={`
        relative flex h-full w-full overflow-hidden border border-gray-300 bg-gray-50 select-none 
        ${!url && !isUploading ? "cursor-pointer hover:bg-gray-100 transition-colors" : ""} 
        ${url && !isUploading ? "cursor-pointer" : ""}`}
    >
      <input
        ref={inputRef}
        onChange={handleFileChange}
        type="file"
        accept={ACCEPT_IMAGE_TYPES}
        disabled={isUploading}
        className="hidden"
      />

      {isUploading ? (
        <div className="flex h-full w-full flex-col items-center justify-center p-2 text-gray-500">
          <Loader2 className="mb-1 size-7 animate-spin text-primary" />
          <span className="text-xs font-medium">Đang tải ảnh lên...</span>
        </div>
      ) : url ? (
        <img
          className="block h-full w-full object-cover"
          src={url}
          alt="Hình ảnh"
          draggable={false}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-2 text-gray-400">
          <ImageIcon className="mb-1 size-8 stroke-1 text-gray-400" />
          <span className="text-xs font-medium text-gray-500">Chọn hình ảnh</span>
          <span className="text-[10px] text-gray-400">Nhấp để tải ảnh lên</span>
        </div>
      )}
    </div>
  );
}
