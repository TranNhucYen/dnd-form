import { useState } from "react";
import { Check, ChevronDown, FileText } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PAGE_SIZE_OPTIONS } from "../constants/toolbar.constants";
import type { Orientation } from "../../types/formBuilder.types";
import type { PagePresetKey } from "../../store/useFormBuilderStore";

type PageSizePopoverProps = {
  pageSize: PagePresetKey;
  onPageSizeChange: (pageSize: PagePresetKey) => void;
  orientation: Orientation;
  onOrientationChange: (orientation: Orientation) => void;
};

export function PageSizePopover({
  pageSize,
  onPageSizeChange,
  orientation,
  onOrientationChange,
}: PageSizePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedPage = PAGE_SIZE_OPTIONS.find((p) => p.id === pageSize);
  const pageDisplayName = `${selectedPage?.id ?? "A4"} (${orientation === "PORTRAIT" ? "Dọc" : "Ngang"})`;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="
            h-7 w-[125px] justify-between gap-1
            rounded-md px-2 text-xs font-normal"
        >
          <div className="flex min-w-0 items-center gap-1">
            <FileText className="size-3 shrink-0 text-muted-foreground" />
            <span className="truncate">{pageDisplayName}</span>
          </div>
          <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1.5">
        <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
          Khổ giấy
        </div>
        <div className="space-y-0.5">
          {PAGE_SIZE_OPTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onPageSizeChange(item.id);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent",
                pageSize === item.id && "bg-accent font-medium text-accent-foreground",
              )}
            >
              <span>{item.label}</span>
              {pageSize === item.id && <Check className="size-3.5" />}
            </button>
          ))}
        </div>

        <div className="my-1.5 h-px bg-border" />

        {/* Radio chọn hướng giấy */}
        <div className="px-2 pt-0.5 text-[11px] font-semibold text-muted-foreground">
          Hướng giấy
        </div>
        <div className="flex items-center gap-4 px-2 py-1 text-xs">
          <label className="flex cursor-pointer items-center gap-1.5 select-none hover:text-foreground">
            <input
              type="radio"
              name="page-orientation"
              checked={orientation === "PORTRAIT"}
              onChange={() => onOrientationChange("PORTRAIT")}
              className="size-3.5 accent-primary cursor-pointer"
            />
            <span>Dọc</span>
          </label>

          <label className="flex cursor-pointer items-center gap-1.5 select-none hover:text-foreground">
            <input
              type="radio"
              name="page-orientation"
              checked={orientation === "LANDSCAPE"}
              onChange={() => onOrientationChange("LANDSCAPE")}
              className="size-3.5 accent-primary cursor-pointer"
            />
            <span>Ngang</span>
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}
