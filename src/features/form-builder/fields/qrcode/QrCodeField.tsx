import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { FieldProps, QrCodeFieldData } from "../types/field.types";
import { QrCodeModal } from "./QrCodeModal";

export function QrCodeField({
  data,
  onDataChange,
}: FieldProps<QrCodeFieldData> = {}) {
  const initialValue = data?.value ?? "https://example.com";
  const [qrValue, setQrValue] = useState(initialValue);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (data?.value !== undefined) {
      setQrValue(data.value || "https://example.com");
    }
  }, [data?.value]);

  const handleSave = (newValue: string) => {
    setQrValue(newValue);
    onDataChange?.({ value: newValue });
  };

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        className="flex h-full w-full items-center justify-center p-1.5 cursor-pointer bg-background"
      >
        <QRCodeSVG
          value={qrValue}
          className="h-full w-full object-contain"
        />
      </div>
      <QrCodeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        value={qrValue}
        onSave={handleSave}
      />
    </>
  );
}
