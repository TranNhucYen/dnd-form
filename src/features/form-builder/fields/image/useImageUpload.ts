import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadMediaAction } from "@/features/editor/actions/upload.action";
import { validateImageFile } from "./image.utils";
import { FORM_BUILDER_LABELS } from "../../constants/labels";

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
        toast.success(FORM_BUILDER_LABELS.fields.image.uploadSuccess);
      } else {
        toast.error(res.error || FORM_BUILDER_LABELS.fields.image.uploadFailed);
      }
    } catch (error) {
      toast.error(FORM_BUILDER_LABELS.fields.image.uploadError);
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
