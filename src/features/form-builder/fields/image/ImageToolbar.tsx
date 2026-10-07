import { useRef, useState } from "react";
import { Upload, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadMediaAction } from "@/features/editor/actions/upload.action";
import { validateImageFile, ACCEPT_IMAGE_TYPES } from "./image.utils";
import type { FieldToolbarProps, ImageFieldData } from "../types/field.types";

export function ImageToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<ImageFieldData>) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasImage = Boolean(data?.value);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
        onDataChange({ value: res.data.url, key: res.data.key });
        toast.success("Tải ảnh lên thành công");
      } else {
        toast.error(res.error || "Tải tập tin lên thất bại");
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi tải ảnh lên");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_IMAGE_TYPES}
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />

      <Button
        variant="ghost"
        size="sm"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="h-7 gap-1 px-2 text-xs font-normal hover:bg-neutral-100"
        title={hasImage ? "Thay đổi hình ảnh" : "Tải hình ảnh lên"}
      >
        {isUploading ? (
          <Loader2 className="size-3.5 animate-spin text-neutral-500" />
        ) : hasImage ? (
          <ImageIcon className="size-3.5 text-neutral-600" />
        ) : (
          <Upload className="size-3.5 text-neutral-600" />
        )}
        <span>{isUploading ? "Đang tải..." : hasImage ? "Đổi ảnh" : "Tải ảnh"}</span>
      </Button>

      {hasImage && !isUploading && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDataChange({ value: undefined, key: undefined })}
          className="h-7 px-1.5 text-xs text-neutral-500 hover:text-red-600 hover:bg-red-50"
          title="Xóa hình ảnh"
        >
          <Trash2 className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
