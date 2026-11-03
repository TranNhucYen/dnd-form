import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { PaletteItem } from "./PaletteItem";
import { FIELD_DEFINITIONS } from "../constants/fields.config";
import { FORM_BUILDER_LABELS } from "../constants/labels";


export function Palette() {
  const [opened, setOpened] = useState(true);

  return (
    <aside
      className={`
        flex shrink-0 flex-col overflow-hidden border-r border-gray-200 
        bg-gray-50  transition-[width] duration-200 ease-in-out select-none
        ${opened ? "w-48 p-2" : "w-10 items-center px-1 py-2"}
      `}
    >
      <div
        className={`
          flex items-center
          ${opened ? "mb-2 w-full justify-between" : "justify-center"}
        `}
      >
        {opened && (
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {FORM_BUILDER_LABELS.palette.heading}
          </h2>
        )}

        {/* Nút bật/tắt thu gọn sidebar */}
        <button
          type="button"
          onClick={() => setOpened((prev) => !prev)}
          title={opened ? FORM_BUILDER_LABELS.palette.collapse : FORM_BUILDER_LABELS.palette.expand}
          aria-label={opened ? FORM_BUILDER_LABELS.palette.collapse : FORM_BUILDER_LABELS.palette.expand}
          className="
            flex h-6 w-6 shrink-0 items-center justify-center
            rounded text-gray-400
            transition-colors
            hover:bg-gray-200 hover:text-gray-700
            [&_svg]:h-4 [&_svg]:w-4
          "
        >
          {opened ? <PanelLeftClose /> : <PanelLeftOpen />}
        </button>
      </div>

      {opened && (
        <div className="grid grid-cols-2 gap-1.5">
          {FIELD_DEFINITIONS.map((item) => (
            <PaletteItem
              key={item.type}
              type={item.type}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
