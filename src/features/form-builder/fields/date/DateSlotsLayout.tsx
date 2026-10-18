import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { DotDecoration } from "../shared/DotDecoration";
import { getFieldPartStyle } from "../shared/fieldStyle.utils";
import { InputOverlay } from "../shared/InputOverlay";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import type {
  DateFieldData,
  DateFieldSlotKey,
  DateFieldSlots,
  FieldProps,
} from "../types/field.types";

export const SLOT_WIDTHS: Record<DateFieldSlotKey, number> = {
  location: 110,
  day: 20,
  month: 20,
  year: 35,
};

const SLOT_CONFIGS: Array<{
  key: DateFieldSlotKey;
  title: string;
  placeholder: string;
  align: "left" | "center";
  maxLength?: number;
}> = [
  { key: "location", title: "Địa danh", placeholder: "Địa danh...", align: "left" },
  { key: "day", title: "Ngày", placeholder: "dd", align: "center", maxLength: 2 },
  { key: "month", title: "Tháng", placeholder: "mm", align: "center", maxLength: 2 },
  { key: "year", title: "Năm", placeholder: "yyyy", align: "center", maxLength: 4 },
];

/**
 * Tính toán vị trí mặc định chia đều các ô trong khung chứa
 */
export function getDefaultDateSlots(containerWidth: number = 300): DateFieldSlots {
  const totalSlotsWidth =
    SLOT_WIDTHS.location + SLOT_WIDTHS.day + SLOT_WIDTHS.month + SLOT_WIDTHS.year;
  const w = Math.max(containerWidth, totalSlotsWidth);
  const remainingSpace = Math.max(0, w - totalSlotsWidth);
  const gap = Math.floor(remainingSpace / 3);

  const locX = 0;
  const dayX = locX + SLOT_WIDTHS.location + gap;
  const monthX = dayX + SLOT_WIDTHS.day + gap;
  const yearX = monthX + SLOT_WIDTHS.month + gap;

  return { location: locX, day: dayX, month: monthX, year: yearX };
}

export function DateSlotsLayout({
  id,
  data,
  style,
  width,
  onDataChange,
}: FieldProps<DateFieldData>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId);
  const setSelectedFieldId = useFormBuilderStore((state) => state.setSelectedFieldId);
  const isFieldSelected = Boolean(id && selectedFieldId === id);

  const valueCustomStyle = getFieldPartStyle(style, "value");
  const [measuredWidth, setMeasuredWidth] = useState<number>(width || 300);

  useEffect(() => {
    if (width !== undefined) {
      setMeasuredWidth(width);
    } else if (containerRef.current) {
      setMeasuredWidth(containerRef.current.offsetWidth || 300);
    }
  }, [width]);

  const defaultSlots = getDefaultDateSlots(measuredWidth);
  const slots: DateFieldSlots = {
    location: data.slots?.location ?? defaultSlots.location,
    day: data.slots?.day ?? defaultSlots.day,
    month: data.slots?.month ?? defaultSlots.month,
    year: data.slots?.year ?? defaultSlots.year,
  };

  const [day = "", month = "", year = ""] = data.value?.split("/") ?? [];
  const slotValues: Record<DateFieldSlotKey, string> = {
    location: data.label || "",
    day,
    month,
    year,
  };

  // Trạng thái inline edit khi nhấp đúp vào ô
  const [editingSlot, setEditingSlot] = useState<DateFieldSlotKey | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (editingSlot && inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [editingSlot]);

  const handleFinishEdit = useCallback(() => {
    if (!editingSlot) return;
    const config = SLOT_CONFIGS.find((c) => c.key === editingSlot);
    const maxLen = config?.maxLength;
    const trimmed = maxLen ? editValue.trim().slice(0, maxLen) : editValue.trim();

    if (editingSlot === "location") {
      onDataChange?.({ label: trimmed });
    } else {
      const parts = data.value ? data.value.split("/") : ["", "", ""];
      while (parts.length < 3) parts.push("");
      const index = editingSlot === "day" ? 0 : editingSlot === "month" ? 1 : 2;
      parts[index] = trimmed;

      if (!parts[0] && !parts[1] && !parts[2]) {
        onDataChange?.({ value: undefined });
      } else {
        onDataChange?.({ value: parts.join("/") });
      }
    }
    setEditingSlot(null);
  }, [editingSlot, editValue, data.value, onDataChange]);

  // Trượt ô theo chiều ngang: dừng khi chạm ô liền kề (không cho đè lên nhau)
  const handleDragPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, key: DateFieldSlotKey) => {
      if (e.button !== 0 || !onDataChange || editingSlot) return;
      e.stopPropagation();

      const startPointerX = e.clientX;
      const startX = slots[key];
      let latestX = startX;
      let hasMoved = false;

      const currentContainerWidth = containerRef.current?.offsetWidth || measuredWidth;

      // Giới hạn trượt dừng lại khi chạm ô bên cạnh, không đè lên nhau
      let minX = 0;
      let maxX = currentContainerWidth - SLOT_WIDTHS[key];

      if (key === "location") {
        maxX = slots.day - SLOT_WIDTHS.location;
      } else if (key === "day") {
        minX = slots.location + SLOT_WIDTHS.location;
        maxX = slots.month - SLOT_WIDTHS.day;
      } else if (key === "month") {
        minX = slots.day + SLOT_WIDTHS.day;
        maxX = slots.year - SLOT_WIDTHS.month;
      } else if (key === "year") {
        minX = slots.month + SLOT_WIDTHS.month;
      }

      const prevCursor = document.body.style.cursor;
      const prevUserSelect = document.body.style.userSelect;
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";

      const onPointerMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startPointerX;
        if (!hasMoved && Math.abs(deltaX) > 2) {
          hasMoved = true;
        }

        if (hasMoved) {
          const nextX = Math.round(Math.max(minX, Math.min(maxX, startX + deltaX)));
          if (nextX !== latestX) {
            latestX = nextX;
            onDataChange({ slots: { ...slots, [key]: nextX } }, { skipHistory: true });
          }
        }
      };

      const onPointerUp = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);

        document.body.style.cursor = prevCursor;
        document.body.style.userSelect = prevUserSelect;

        if (hasMoved) {
          isDraggingRef.current = true;
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 120);

          onDataChange({ slots: { ...slots, [key]: latestX } });
        }
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    },
    [editingSlot, measuredWidth, onDataChange, slots],
  );

  return (
    <div
      ref={containerRef}
      style={width !== undefined ? { width: "100%", height: "100%" } : undefined}
      className={cn(
        "relative select-none h-full min-h-[24px] flex items-center overflow-visible",
        width === undefined ? "w-[300px] min-w-16" : "w-full",
      )}
    >
      {SLOT_CONFIGS.map(({ key, title, placeholder, align }) => {
        const xPos = slots[key];
        const slotWidth = SLOT_WIDTHS[key];
        const val = slotValues[key];
        const isEditingThisSlot = editingSlot === key;

        return (
          <div
            key={key}
            data-date-slot="true"
            style={{
              position: "absolute",
              left: `${xPos}px`,
              width: `${slotWidth}px`,
              top: 0,
              bottom: 0,
              zIndex: isEditingThisSlot ? 30 : 10,
            }}
            onPointerDown={(e) => handleDragPointerDown(e, key)}
            onClick={(e) => {
              if (isDraggingRef.current) return;
              if (id) {
                e.stopPropagation();
                setSelectedFieldId(id, "value");
              }
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (isDraggingRef.current || !onDataChange) return;
              setEditingSlot(key);
              setEditValue(val);
            }}
            className={cn(
              "absolute select-none flex items-center justify-center h-full p-0 box-border",
              onDataChange && !isEditingThisSlot ? "cursor-grab active:cursor-grabbing" : "",
              "transition-colors",
              "border border-dashed border-sky-400/60 dark:border-sky-500/50 bg-sky-50/20 dark:bg-sky-950/20 hover:border-sky-500 hover:bg-sky-50/40 rounded-xs",
              "print:border-none print:bg-transparent print:rounded-none",
              isFieldSelected && "border-sky-500/80 shadow-xs",
            )}
            title={`${title} (Kéo trượt ngang, nhấp đúp để gõ)`}
          >
            {/* Dòng kẻ chấm */}
            {data.showDottedLine && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <DotDecoration />
              </div>
            )}

            {/* Giá trị chữ hiển thị */}
            {val ? (
              <span
                style={valueCustomStyle}
                className={cn(
                  "relative z-10 leading-[1.25] truncate",
                  align === "center"
                    ? "text-center w-full px-0"
                    : "text-left w-full pl-1 pr-0.5",
                  data.showDottedLine &&
                    "bg-white/90 dark:bg-neutral-900/90 print:bg-transparent",
                  isEditingThisSlot && "invisible",
                )}
              >
                {val}
              </span>
            ) : (
              <span
                className={cn(
                  "relative z-10 text-[10px] italic text-neutral-400/80 dark:text-neutral-500 select-none pointer-events-none print:hidden truncate",
                  align === "center"
                    ? "text-center w-full px-0"
                    : "text-left w-full pl-1 pr-0.5",
                )}
              >
                {align === "center" ? placeholder : `[${placeholder}]`}
              </span>
            )}

            {/* Nhãn định danh nhỏ khi field được chọn */}
            {isFieldSelected && (
              <span
                className="absolute -top-3.5 left-0 text-[8.5px] font-semibold leading-none tracking-tight text-sky-600 dark:text-sky-400 bg-sky-100/95 dark:bg-sky-950/95 px-1 py-0.5 rounded border border-sky-300/70 select-none pointer-events-none print:hidden no-print shadow-xs"
              >
                {title}
              </span>
            )}

            {/* Khung nhập liệu khi double click vào ô */}
            {isEditingThisSlot && (
              <InputOverlay
                value={editValue}
                onChange={(nextVal) => {
                  const maxLen = SLOT_CONFIGS.find((c) => c.key === key)?.maxLength;
                  if (maxLen && nextVal.length > maxLen) return;
                  setEditValue(nextVal);
                }}
                onSubmit={handleFinishEdit}
                onCancel={() => setEditingSlot(null)}
                inputRef={inputRef}
                className={align === "center" ? "text-center p-0" : "text-left pl-1 pr-0.5"}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
