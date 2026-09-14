import { useState, useRef } from "react";
import { Check, Pipette } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BASIC_COLORS = [
  "black",
  "#4b5563",
  "#9ca3af",
  "white",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
];

type ColorPickerPopoverProps = {
  title: string;
  currentColor: string;
  onChange: (color: string) => void;
  allowTransparent?: boolean;
  children: React.ReactNode;
};

export function ColorPickerPopover({
  title,
  currentColor,
  onChange,
  allowTransparent = false,
  children,
}: ColorPickerPopoverProps) {
  const [hexInput, setHexInput] = useState(
    currentColor === "transparent" ? "white" : currentColor,
  );
  const nativeColorInputRef = useRef<HTMLInputElement>(null);

  const handleSelectColor = (color: string) => {
    onChange(color);
    setHexInput(color === "transparent" ? "white" : color);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val) || ["black", "white", "transparent"].includes(val.toLowerCase())) {
      onChange(val);
    }
  };

  // Chuẩn hóa định dạng HEX cho input type="color" ẩn
  const getNativeHexValue = (color: string) => {
    if (color === "transparent" || color === "white") return "#ffffff";
    if (color === "black") return "#000000";
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) return color;
    return "#000000";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="w-52 p-2.5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-1.5 text-xs font-semibold text-foreground">
          <span>{title}</span>
          {allowTransparent && (
            <Button
              type="button"
              variant={currentColor === "transparent" ? "secondary" : "ghost"}
              size="xs"
              className="h-5 px-1.5 text-[10px]"
              onClick={() => handleSelectColor("transparent")}
            >
              Không màu
            </Button>
          )}
        </div>

        {/* Lưới màu cơ bản */}
        <div className="grid grid-cols-6 gap-1.5 pt-1">
          {BASIC_COLORS.map((color) => {
            const isSelected = currentColor.toLowerCase() === color.toLowerCase();
            return (
              <button
                key={color}
                type="button"
                onClick={() => handleSelectColor(color)}
                className={`
                  group relative flex size-6 shrink-0 items-center justify-center
                  rounded-md border transition-transform hover:scale-110
                  ${["white", "#ffffff"].includes(color) ? "border-border" : "border-transparent"}
                `}
                style={{ backgroundColor: color }}
                title={color}
              >
                {isSelected && (
                  <Check
                    className={`
                      size-3.5
                      ${["white", "#ffffff", "#9ca3af", "#eab308"].includes(color) ? "text-gray-800" : "text-white"}
                    `}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Thanh tùy chỉnh mã màu Hex & Native Pipette */}
        <div className="flex items-center gap-1.5 border-t border-border pt-2 text-xs">
          <div className="relative flex flex-1 items-center">
            <span className="absolute left-2 font-mono text-[10px] text-muted-foreground">HEX</span>
            <Input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              maxLength={7}
              placeholder="black"
              className="h-7 pl-9 font-mono text-[11px] uppercase"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-7 shrink-0"
            onClick={() => nativeColorInputRef.current?.click()}
            title="Chọn màu khác"
          >
            <Pipette className="size-3" />
            <input
              ref={nativeColorInputRef}
              type="color"
              value={getNativeHexValue(currentColor)}
              onChange={(e) => handleSelectColor(e.target.value)}
              className="sr-only"
            />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
