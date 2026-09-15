import { SlidersHorizontal } from "lucide-react";
import { EditableSelect, PageSizePopover } from "../components";
import { MARGIN_FIELDS, MARGIN_OPTIONS } from "../constants/toolbar.constants";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";

export function PageTabContent() {
  const pageSizePreset = useFormBuilderStore((state) => state.pageSizePreset);
  const orientation = useFormBuilderStore((state) => state.orientation);
  const margins = useFormBuilderStore((state) => state.margins);

  const setPageSizePreset = useFormBuilderStore(
    (state) => state.setPageSizePreset,
  );
  const setOrientation = useFormBuilderStore((state) => state.setOrientation);
  const setMarginValue = useFormBuilderStore((state) => state.setMarginValue);

  return (
    <div className="flex items-center gap-2.5">
      {/* Khổ giấy & Hướng giấy */}
      <PageSizePopover
        pageSize={pageSizePreset}
        onPageSizeChange={setPageSizePreset}
        orientation={orientation}
        onOrientationChange={setOrientation}
      />

      {/* Cụm thiết lập Lề trang (Top, Bottom, Left, Right) */}
      <div className="flex h-7 items-center gap-1.5 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <SlidersHorizontal className="size-3" />
          <span className="text-[11px] font-medium text-foreground">Lề:</span>
        </div>

        {MARGIN_FIELDS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground">
              {label}
            </span>
            <EditableSelect
              value={margins[key]}
              onChange={(val) => setMarginValue(key, val)}
              options={MARGIN_OPTIONS}
              suffix="mm"
              className="h-5.5 w-[56px]"
              inputClassName="text-[11px]"
              popoverClassName="w-24"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
