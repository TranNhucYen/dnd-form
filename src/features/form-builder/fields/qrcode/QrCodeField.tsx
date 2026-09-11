import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { FieldProps } from "../types/field.types";
import { QrCodeModal } from "./QrCodeModal";

export function QrCodeField({ value }: FieldProps = {}) {
  const [qrValue, setQrValue] = useState(value || "https://example.com");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setQrValue(value || "https://example.com");
    }
  }, [value]);

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
        onSave={setQrValue}
      />
    </>
  );
}
