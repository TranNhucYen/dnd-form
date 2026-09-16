import { type ReactNode } from "react";
import { useDraggable } from "@dnd-kit/react";
import { FieldType } from "../types/formBuilder.types";
import { FIELD_DEFINITIONS_MAP } from "../constants/fields.config";

interface PaletteItemProps {
  type: FieldType;
  label: string;
  icon: ReactNode;
}

export function PaletteItem({
  type,
  label,
  icon,
}: PaletteItemProps) {
  const defaultSize = FIELD_DEFINITIONS_MAP[type]?.defaultSize;

  const { ref } = useDraggable({
    id: `palette-${type}`,
    type,
    data: {
      type,
      label,
      icon,
      width: defaultSize?.width,
      height: defaultSize?.height,
    },
  });

  return (
    <div ref={ref} title={label}>
      <div
        className="
          flex flex-col items-center gap-1 rounded-md border border-gray-200 bg-white px-1 py-1.5
          cursor-grab hover:border-blue-400 hover:bg-blue-50 active:cursor-grabbing"
      >
        <span
          className="
            flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-700
            [&_svg]:h-3.5 [&_svg]:w-3.5
          "
        >
          {icon}
        </span>

        <span className="w-full truncate text-center text-[10px] leading-none text-gray-600">
          {label}
        </span>
      </div>
    </div>
  );
}