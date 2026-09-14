import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TEXT_FORMAT_ITEMS } from "../constants/toolbar.constants";
import { useActiveToolbarState } from "../hooks";

export function TextFormatGroup() {
  const { activeFormats, toggleFormat, isDisabled } = useActiveToolbarState();

  return (
    <ToggleGroup
      type="multiple"
      size="sm"
      value={activeFormats}
      disabled={isDisabled}
    >
      {TEXT_FORMAT_ITEMS.map(({ value, label, icon: Icon }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          aria-label={label}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleFormat(value as "bold" | "italic" | "underline")}
          className="
            data-[state=on]:bg-neutral-200 data-[state=on]:text-neutral-900 
            dark:data-[state=on]:bg-neutral-700 dark:data-[state=on]:text-neutral-50"
        >
          <Icon className="size-3" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
