import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadMediaAction } from "@/features/editor/actions/upload.action";
import { validateImageFile } from "./image.utils";

interface UseImageUploadOptions {
  onSuccess: (data: { url: string; key?: string }) => void;
}

export function useImageUpload({ onSuccess }: UseImageUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
        onSuccess({ url: res.data.url, key: res.data.key });
        toast.success("Tải ảnh lên thành công");
      } else {
        toast.error(res.error || "Tải tập tin lên thất bại");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải ảnh lên");
      console.error("[ImageUpload] Error:", error);
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const triggerUpload = () => {
    if (isUploading) return;
    inputRef.current?.click();
  };

  return {
    isUploading,
    inputRef,
    handleFileChange,
    triggerUpload,
  };
}
