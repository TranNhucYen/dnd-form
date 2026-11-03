"use client";

import type { FieldProps, ImageFieldData } from "../types/field.types";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { ACCEPT_IMAGE_TYPES } from "./image.utils";
import { useImageUpload } from "./useImageUpload";
import { FORM_BUILDER_LABELS } from "../../constants/labels";

export function ImageField({
  data,
  onDataChange,
}: FieldProps<ImageFieldData>) {
  const url = data.value ?? "";
  const { isUploading, inputRef, handleFileChange, triggerUpload } =
    useImageUpload({
      onSuccess: ({ url: newUrl, key }) =>
        onDataChange?.({ value: newUrl, key }),
    });

  const handleTriggerUpload = (event: React.MouseEvent) => {
    event.stopPropagation();
    triggerUpload();
  };

  return (
    <div
      onDoubleClick={!isUploading ? handleTriggerUpload : undefined}
      title={url ? FORM_BUILDER_LABELS.fields.image.changeHint : FORM_BUILDER_LABELS.fields.image.uploadHint}
      className="relative flex h-full w-full overflow-hidden border border-gray-300 bg-gray-50 select-none cursor-pointer"
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
          <span className="text-xs font-medium">{FORM_BUILDER_LABELS.fields.image.loading}</span>
        </div>
      ) : url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="block h-full w-full object-cover"
          src={url}
          alt={FORM_BUILDER_LABELS.fields.image.alt}
          draggable={false}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-2 text-gray-400">
          <ImageIcon className="mb-1 size-8 stroke-1 text-gray-400" />
          <span className="text-xs font-medium text-gray-500">{FORM_BUILDER_LABELS.fields.image.choose}</span>
          <span className="text-[10px] text-gray-400">{FORM_BUILDER_LABELS.fields.image.uploadHint}</span>
        </div>
      )}
    </div>
  );
}
