import { useState } from "react";
import { ListPlus, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ToolbarCheckbox,
  ToolbarClearButton,
  ToolbarField,
  ToolbarPopover,
} from "../shared/ToolbarPopover";
import type { FieldToolbarProps, SelectFieldData } from "../types/field.types";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function SelectToolbar({
  data,
  onDataChange,
}: FieldToolbarProps<SelectFieldData>) {
  const fieldData = { ...DEFAULT_FIELD_DATA.select, ...data };
  const { label, options, value: currentValue, showLabel, showDottedLine } = fieldData;
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
      label={currentValue ? `Chọn: ${currentValue}` : label || `Tùy chọn (${options.length})`}
      title="Quản lý danh sách lựa chọn"
    >
      <ToolbarField label="Nhãn (Tiêu đề trường)">
        <Input
          value={label}
          onChange={(e) => onDataChange({ label: e.target.value })}
          placeholder="VD: Danh sách..."
          className="h-7 text-xs"
        />
      </ToolbarField>

      <div className="flex flex-col gap-0.5 border-y border-border py-1.5 my-0.5">
        <ToolbarCheckbox
          label="Hiển thị nhãn"
          checked={showLabel}
          onCheckedChange={(checked) => onDataChange({ showLabel: checked })}
        />
        <ToolbarCheckbox
          label="Hiển thị dòng kẻ chấm"
          checked={showDottedLine}
          onCheckedChange={(checked) => onDataChange({ showDottedLine: checked })}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">
          Danh sách lựa chọn
        </span>
        <span className="text-[10px] text-muted-foreground">
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
          <span className="py-2 text-center text-xs text-muted-foreground">
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
                  ? "border-blue-400 bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700"
                  : "border-border bg-card text-foreground hover:bg-accent"
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
