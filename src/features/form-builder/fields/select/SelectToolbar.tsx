import { useState } from "react";
import { ListPlus, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolbarClearButton, ToolbarPopover } from "../shared/ToolbarPopover";
import type { FieldToolbarProps, SelectFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function SelectToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<SelectFieldData>) {
  const options = data?.options ?? DEFAULT_FIELD_DATA.select.options;
  const currentValue = data?.value;
  const [newOption, setNewOption] = useState("");

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newOption.trim();
    if (!trimmed || options.includes(trimmed)) return;

    onDataChange({ options: [...options, trimmed] });
    setNewOption("");
  };

  const handleRemoveOption = (option: string) => {
    onDataChange({
      options: options.filter((opt) => opt !== option),
      value: currentValue === option ? undefined : currentValue,
    });
  };

  const handleToggleValue = (option: string) => {
    onDataChange({ value: currentValue === option ? undefined : option });
  };

  return (
    <ToolbarPopover
      icon={ListPlus}
      label={currentValue ? `Chọn: ${currentValue}` : `Tùy chọn (${options.length})`}
      title="Quản lý danh sách lựa chọn"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-800">
          Danh sách lựa chọn
        </span>
        <span className="text-[10px] text-neutral-400">
          Click để chọn / bỏ chọn
        </span>
      </div>

      <form onSubmit={handleAddOption} className="flex gap-1.5">
        <Input
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Thêm lựa chọn..."
          className="h-7 text-xs"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!newOption.trim()}
          className="h-7 px-2"
        >
          <Plus className="size-3.5" />
        </Button>
      </form>

      <div className="flex max-h-40 flex-col gap-1 overflow-y-auto pr-1">
        {options.length === 0 && (
          <span className="py-2 text-center text-xs text-neutral-400">
            Chưa có lựa chọn nào
          </span>
        )}
        {options.map((option) => {
          const isSelected = currentValue === option;
          return (
            <div
              key={option}
              onClick={() => handleToggleValue(option)}
              className={`group flex cursor-pointer items-center justify-between rounded border px-2 py-1 text-xs transition-colors ${
                isSelected
                  ? "border-blue-400 bg-blue-50 font-medium text-blue-700"
                  : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                {isSelected && <Check className="size-3 text-blue-600" />}
                <span className="truncate">{option}</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveOption(option);
                }}
                className="p-0.5 text-neutral-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                title="Xóa lựa chọn"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          );
        })}
      </div>

      {currentValue && (
        <ToolbarClearButton onClick={() => onDataChange({ value: undefined })}>
          Bỏ chọn (để trống)
        </ToolbarClearButton>
      )}
    </ToolbarPopover>
  );
}
