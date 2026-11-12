"use client";

import { useState } from "react";
import type { DateFieldData, FieldStyle } from "@/features/form-builder/types/formBuilder.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EFormDateFieldProps {
  data: DateFieldData;
  style?: FieldStyle;
  onChange?: (value: { label: string; value: string }) => void;
}

function toInputDateValue(raw?: string): string {
  if (!raw) return "";
  const parts = raw.split("/");
  if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
    const d = parts[0].padStart(2, "0");
    const m = parts[1].padStart(2, "0");
    const y = parts[2].padStart(4, "20");
    return `${y}-${m}-${d}`;
  }
  return "";
}

export function EFormDateField({ data, style, onChange }: EFormDateFieldProps) {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(() => toInputDateValue(data.value));

  const updateLocation = (nextLocation: string) => {
    setLocation(nextLocation);
    onChange?.({ label: nextLocation, value: date });
  };

  const updateDate = (nextDate: string) => {
    setDate(nextDate);
    onChange?.({ label: location, value: nextDate });
  };

  return (
    <div className="flex w-full items-center gap-3">
      {(data.showLabel ?? true) && (
        <>
          <Label className="sr-only">{data.label || "Địa điểm"}</Label>
          <Input
            type="text"
            value={location}
            onChange={(e) => updateLocation(e.target.value)}
            placeholder={data.label || "Địa điểm"}
            style={{
              color: style?.parts?.label?.color || style?.color,
              fontSize: style?.parts?.label?.fontSize,
              fontWeight: style?.parts?.label?.fontWeight,
            }}
            className="h-9 min-w-0 flex-1 bg-white text-xs text-neutral-700 md:text-sm"
          />
        </>
      )}
      <Input
        type="date"
        value={date}
        onChange={(e) => updateDate(e.target.value)}
        aria-label="Ngày tháng năm"
        className="h-9 min-w-0 flex-1 bg-white text-xs text-neutral-700 md:text-sm"
      />
    </div>
  );
}
