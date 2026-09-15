import type { FieldProps } from "../types/field.types";

export function LineField({ }: FieldProps = {}) {
  return (
    <div className="flex h-full w-full items-center select-none">
      <div className="h-[1px] w-full bg-black" />
    </div>
  );
}
