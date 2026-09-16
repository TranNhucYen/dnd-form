import { useRef, useState } from "react";
import type { FieldProps } from "../types/field.types";
import { Image as ImageIcon } from "lucide-react";

export function ImageField({}: FieldProps = {}) {
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newUrl = URL.createObjectURL(file);
      setUrl(newUrl);
    }
    event.target.value = "";
  };

  const handleTriggerUpload = (event: React.MouseEvent) => {
    event.stopPropagation();
    inputRef.current?.click();
  };

  return (
    <div
      onClick={!url ? handleTriggerUpload : undefined}
      onDoubleClick={url ? handleTriggerUpload : undefined}
      className={`relative flex h-full w-full overflow-hidden border border-gray-300 bg-gray-50 select-none ${
        !url ? "cursor-pointer hover:bg-gray-100 transition-colors" : ""
      }`}
    >
      <input
        ref={inputRef}
        onChange={handleFileChange}
        type="file"
        accept="image/*"
        className="hidden"
      />

      {url ? (
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
