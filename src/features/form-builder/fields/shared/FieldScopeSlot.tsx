import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";

export interface FieldScopeSlotProps extends HTMLAttributes<HTMLElement> {
  fieldId?: string;
  scope: "label" | "value" | "subTitle";
  isEditing?: boolean;
  as?: "span" | "div";
  children?: ReactNode;
}

/**
 * FieldScopeSlot: Khung hiển thị và bắt sự kiện chọn phạm vi định dạng (label / value)
 */
export function FieldScopeSlot({
  fieldId,
  scope,
  isEditing = false,
  as: Component = "span",
  className,
  onClick,
  children,
  style,
  ...rest
}: FieldScopeSlotProps) {
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId);
  const formatScope = useFormBuilderStore((state) => state.formatScope);
  const setSelectedFieldId = useFormBuilderStore((state) => state.setSelectedFieldId);

  const isFieldSelected = Boolean(fieldId && selectedFieldId === fieldId);
  const isActive = isFieldSelected && formatScope === scope;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || isEditing) return;
    if (fieldId) {
      e.stopPropagation();
      setSelectedFieldId(fieldId, scope);
    }
  };

  return (
    <Component
      {...rest}
      onClick={handleClick}
      style={style}
      className={cn(
        "select-none",
        isActive && "ring-1 ring-blue-500 bg-blue-500/10 print:ring-0 print:bg-transparent",
        className,
      )}
    >
      {children}
    </Component>
  );
}
