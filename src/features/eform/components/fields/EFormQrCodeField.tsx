import type { QrCodeFieldData } from "@/features/form-builder/types/formBuilder.types";
import { QRCodeSVG } from "qrcode.react";

interface EFormQrCodeFieldProps {
  data: QrCodeFieldData;
}

export function EFormQrCodeField({ data }: EFormQrCodeFieldProps) {
  const value = data.value || "https://dnd-form.example.com";

  return (
    <div className="flex w-full items-center justify-center p-2">
      <div className="rounded-md border border-neutral-200 bg-white p-2 shadow-2xs">
        <QRCodeSVG value={value} size={110} />
      </div>
    </div>
  );
}
