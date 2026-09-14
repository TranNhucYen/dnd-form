import type { FieldProps } from "../types/field.types";

export function RadioField({ label = "Lựa chọn" }: FieldProps = {}) {
  return (
    <div className="flex h-full w-max shrink-0 items-center gap-2 whitespace-nowrap select-none">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gray-400 bg-white">
        <span className="h-2 w-2 rounded-full bg-gray-500" />
      </span>
      <span>{label}</span>
    </div>
  );
}
