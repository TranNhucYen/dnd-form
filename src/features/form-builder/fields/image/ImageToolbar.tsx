import { Upload, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACCEPT_IMAGE_TYPES } from "./image.utils";
import { useImageUpload } from "./useImageUpload";
import type { FieldToolbarProps, ImageFieldData } from "../types/field.types";
import { FORM_BUILDER_LABELS } from "../../constants/labels";
import { useFormBuilderCapabilities } from "../../context/FormBuilderCapabilities";

export function ImageToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<ImageFieldData>) {
  const { allowMediaUpload } = useFormBuilderCapabilities();
  const hasImage = Boolean(data?.value);
  const { isUploading, inputRef, handleFileChange, triggerUpload } =
    useImageUpload({
      onSuccess: ({ url, key }) => onDataChange({ value: url, key }),
    });

  if (!allowMediaUpload) return null;

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
        onClick={triggerUpload}
        className="h-7 gap-1 px-2 text-xs font-normal hover:bg-neutral-100"
        title={hasImage ? FORM_BUILDER_LABELS.fields.image.change : FORM_BUILDER_LABELS.fields.image.upload}
      >
        {isUploading ? (
          <Loader2 className="size-3.5 animate-spin text-neutral-500" />
        ) : hasImage ? (
          <ImageIcon className="size-3.5 text-neutral-600" />
        ) : (
          <Upload className="size-3.5 text-neutral-600" />
        )}
        <span>{isUploading ? FORM_BUILDER_LABELS.fields.image.loadingShort : hasImage ? FORM_BUILDER_LABELS.fields.image.changeShort : FORM_BUILDER_LABELS.fields.image.uploadShort}</span>
      </Button>

      {hasImage && !isUploading && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDataChange({ value: undefined, key: undefined })}
          className="h-7 px-1.5 text-xs text-neutral-500 hover:text-red-600 hover:bg-red-50"
          title={FORM_BUILDER_LABELS.fields.image.remove}
        >
          <Trash2 className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
