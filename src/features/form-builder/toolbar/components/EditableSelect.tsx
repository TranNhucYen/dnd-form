import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type EditableSelectOption = {
  value: string;
  label?: string;
};

type EditableSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: (string | number | EditableSelectOption)[];
  suffix?: string;
  className?: string;
  inputClassName?: string;
  popoverClassName?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function EditableSelect({
  value,
  onChange,
  options,
  suffix = "",
  className,
  inputClassName,
  popoverClassName,
  placeholder,
  disabled = false,
}: EditableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  // Chuẩn hóa danh sách options sang format { value, label }
  const normalizedOptions: EditableSelectOption[] = options.map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      return opt;
    }
    const strVal = opt.toString();
    return {
      value: strVal,
      label: suffix ? `${strVal} ${suffix}` : strVal,
    };
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (localValue !== value) {
        onChange(localValue);
      }
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleBlur = () => {
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleSelectOption = (optValue: string) => {
    setLocalValue(optValue);
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        `flex h-7 items-center rounded-md border border-input bg-background 
        transition-colors focus-within:border-ring focus-within:ring-1 focus-within:ring-ring`,
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    >
      <input
        type="text"
        value={localValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "h-full w-full min-w-0 bg-transparent px-1.5 text-center text-xs outline-none select-none",
          inputClassName,
        )}
      />

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className="flex h-full items-center px-1 text-muted-foreground hover:text-foreground focus:outline-none"
            title="Mở danh sách tùy chọn"
          >
            <ChevronDown className="size-3 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={4}
          className={cn("max-h-56 w-24 overflow-y-auto p-1", popoverClassName)}
        >
          <div className="space-y-0.5">
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectOption(opt.value)}
                  className={cn(
                    `flex w-full items-center justify-between rounded-sm px-2 py-1 text-left text-xs 
                    transition-colors hover:bg-accent hover:text-accent-foreground`,
                    isSelected && "bg-accent font-medium text-accent-foreground",
                  )}
                >
                  <span>{opt.label ?? opt.value}</span>
                  {isSelected && <Check className="size-3" />}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
