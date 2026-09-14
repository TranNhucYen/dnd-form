
export function DotDecoration() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden whitespace-nowrap leading-[1.25] text-black select-none"
    >
      {".".repeat(160)}
    </span>
  );
}
