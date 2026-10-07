import type { ReactNode } from "react";
import { Trash2, type LucideIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type ToolbarPopoverProps = {
  icon: LucideIcon;
  label: string;
  title: string;
  contentClassName?: string;
  children: ReactNode;
};

/**
 * ToolbarPopover: Nút trên floating toolbar, bấm vào sẽ mở popover chứa các ô cấu hình
 */
export function ToolbarPopover({
  icon: Icon,
  label,
  title,
  contentClassName = "w-64",
  children,
}: ToolbarPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs font-normal hover:bg-neutral-100"
          title={title}
        >
          <Icon className="size-3.5 text-neutral-600" />
          <span className="max-w-[140px] truncate">{label}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={`${contentClassName} p-3`}
        align="start"
        side="top"
        sideOffset={6}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2.5">{children}</div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * ToolbarField: Ô nhập kèm nhãn phía trên
 */
export function ToolbarField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] text-neutral-500">{label}</label>
      {children}
    </div>
  );
}

/**
 * ToolbarClearButton: Nút dùng để xóa giá trị đã điền
 */
export function ToolbarClearButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className="h-7 w-full gap-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      <Trash2 className="size-3" />
      <span>{children}</span>
    </Button>
  );
}
