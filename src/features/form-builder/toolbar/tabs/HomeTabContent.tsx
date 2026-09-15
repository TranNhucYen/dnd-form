import { Baseline, ChevronDown, PaintBucket } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ColorPickerPopover,
  EditableSelect,
  TextFormatGroup,
} from "../components";
import {
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  TEXT_ALIGN_ITEMS,
} from "../constants/toolbar.constants";
import { useActiveToolbarState } from "../hooks";

export function HomeTabContent() {
  const {
    fontFamily,
    fontSize,
    textAlign,
    textColor,
    bgColor,
    setFontFamily,
    setFontSize,
    setTextAlign,
    setTextColor,
    setBgColor,
    isDisabled,
  } = useActiveToolbarState();

  return (
    <div className="flex items-center gap-1.5">
      {/* Nhóm: Font chữ & Cỡ chữ */}
      <div className="flex items-center gap-1">
        <Select value={fontFamily} onValueChange={setFontFamily} disabled={isDisabled}>
          <SelectTrigger size="sm" className="h-7 w-[145px] rounded-md text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4} align="start">
            <SelectGroup>
              {FONT_OPTIONS.map((item) => (
                <SelectItem key={item.id} value={item.id} className="text-xs">
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <EditableSelect
          value={fontSize}
          onChange={setFontSize}
          options={FONT_SIZE_OPTIONS}
          className="h-7 w-[56px] text-xs"
          popoverClassName="w-20"
          disabled={isDisabled}
        />
      </div>

      <Separator orientation="vertical" />

      {/* Nhóm: Định dạng: Đậm, Nghiêng, Gạch chân */}
      <TextFormatGroup />

      <Separator orientation="vertical" />

      {/* Nhóm: Căn lề: Trái, Giữa, Phải, Đều */}
      <ToggleGroup
        type="single"
        size="sm"
        value={textAlign}
        onValueChange={(val) => val && setTextAlign(val as any)}
        disabled={isDisabled}
      >
        {TEXT_ALIGN_ITEMS.map(({ value, label, icon: Icon }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-label={label}
            onMouseDown={(e) => e.preventDefault()}
            className="
              data-[state=on]:bg-neutral-200 data-[state=on]:text-neutral-900 
              dark:data-[state=on]:bg-neutral-700 dark:data-[state=on]:text-neutral-50"
          >
            <Icon className="size-3" />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Separator orientation="vertical"/>

      {/* Nhóm: Chỉnh màu: Màu chữ & Màu nền */}
      <div className="flex items-center gap-0.5">
        <ColorPickerPopover
          title="Màu chữ"
          currentColor={textColor}
          onChange={setTextColor}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isDisabled}
            className="h-7 gap-1 px-1.5 text-xs text-muted-foreground hover:text-foreground"
            title="Màu chữ"
          >
            <Baseline className="size-3 text-muted-foreground" />
            <span
              className="size-2 rounded-full border border-border shadow-inner"
              style={{ backgroundColor: textColor }}
            />
            <ChevronDown className="size-3 text-muted-foreground" />
          </Button>
        </ColorPickerPopover>

        <ColorPickerPopover
          title="Màu nền"
          currentColor={bgColor}
          onChange={setBgColor}
          allowTransparent
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isDisabled}
            className="h-7 gap-1 px-1.5 text-xs text-muted-foreground hover:text-foreground"
            title="Màu nền"
          >
            <PaintBucket className="size-3 text-muted-foreground" />
            <span
              className="size-2 rounded-full border border-border shadow-inner"
              style={{
                backgroundColor:
                  bgColor === "transparent" ? "white" : bgColor,
              }}
            />
            <ChevronDown className="size-3 text-muted-foreground" />
          </Button>
        </ColorPickerPopover>
      </div>
    </div>
  );
}
