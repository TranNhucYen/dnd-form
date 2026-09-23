import type { FieldProps, LineFieldData } from "../types/field.types";

export function LineField({}: FieldProps<LineFieldData> = {}) {
  return (
    <div className="flex h-full w-full items-center select-none">
      <div className="h-[1px] w-full bg-black" />
    </div>
  );
}
