"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, FileText, Globe, Lock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { CollectingFormSummary } from "../../services/collect.service";

interface CollectingFormComboboxProps {
  forms: CollectingFormSummary[];
  selectedFormId: number | null;
  onSelectForm: (formId: number) => void;
  disabled?: boolean;
}

/**
 * Hiển thị biểu tượng trạng thái của biểu mẫu (dùng if/else thay thế toán tử 3 ngôi lồng nhau)
 */
function renderFormStatusIcon(isSelected: boolean, isCollecting: boolean) {
  if (isSelected) {
    return <Check className="size-3.5 text-primary" />;
  }
  if (isCollecting) {
    return <span className="size-2 rounded-full bg-emerald-500" />;
  }
  return <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />;
}

export function CollectingFormCombobox({
  forms,
  selectedFormId,
  onSelectForm,
  disabled = false,
}: CollectingFormComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);

  const selectedForm = useMemo(() => {
    return forms.find((f) => f.id === selectedFormId);
  }, [forms, selectedFormId]);

  const filteredForms = useMemo(() => {
    return forms.filter((item) => {
      if (filterActiveOnly && !item.isCollecting) return false;
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
      );
    });
  }, [forms, searchTerm, filterActiveOnly]);

  const activeFormsCount = useMemo(() => {
    return forms.filter((f) => f.isCollecting).length;
  }, [forms]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || forms.length === 0}
          className="w-full sm:w-[360px] justify-between h-10 px-3 cursor-pointer bg-background"
        >
          {selectedForm ? (
            <div className="flex items-center gap-2 truncate min-w-0">
              <span className="size-2 rounded-full shrink-0 bg-emerald-500" />
              <span className="font-semibold text-foreground truncate text-xs sm:text-sm">
                {selectedForm.name}
              </span>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-5 shrink-0 font-normal"
              >
                {selectedForm.submissionsCount} phản hồi
              </Badge>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs sm:text-sm">
              {forms.length === 0 ? "Chưa có biểu mẫu nào" : "Chọn biểu mẫu đã bật thu thập..."}
            </span>
          )}
          <ChevronsUpDown className="size-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[calc(100vw-2rem)] sm:w-[420px] p-2 flex flex-col gap-2"
      >
        {/* Ô tìm kiếm form */}
        <div className="relative">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên biểu mẫu..."
            className="text-xs h-8 pl-8 focus-visible:ring-1"
            autoFocus
          />
        </div>

        {/* Nút lọc nhanh */}
        <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterActiveOnly(false)}
              className={cn(
                "px-2 py-0.5 rounded cursor-pointer transition-colors",
                !filterActiveOnly ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-muted-foreground",
              )}
            >
              Tất cả ({forms.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterActiveOnly(true)}
              className={cn(
                "px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1",
                filterActiveOnly ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted text-muted-foreground",
              )}
            >
              <Globe className="size-3" />
              Đang bật ({activeFormsCount})
            </button>
          </div>
        </div>

        {/* Danh sách các form */}
        <ScrollArea className="max-h-64 overflow-y-auto">
          {filteredForms.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground flex flex-col items-center gap-1">
              <FileText className="size-6 text-muted-foreground/50" />
              <span>Không tìm thấy biểu mẫu phù hợp.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1 p-0.5">
              {filteredForms.map((item) => {
                const isSelected = item.id === selectedFormId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectForm(item.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer text-xs group",
                      isSelected ? "bg-accent text-accent-foreground font-medium" : "hover:bg-muted/70",
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                      <div className="size-4 shrink-0 flex items-center justify-center">
                        {renderFormStatusIcon(isSelected, item.isCollecting)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate text-foreground group-hover:text-primary transition-colors">
                          {item.name}
                        </span>
                        {item.description && (
                          <span className="text-[10px] text-muted-foreground truncate">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.isCollecting ? (
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1 py-0 h-4 border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300"
                        >
                          Đang bật
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1 py-0 h-4 text-muted-foreground"
                        >
                          <Lock className="size-2.5 mr-0.5" />
                          Tắt
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 h-5 font-semibold"
                      >
                        {item.submissionsCount}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
