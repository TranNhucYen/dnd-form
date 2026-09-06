import { useEditorState } from "@tiptap/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEditorStore } from "../../store/useEditorStore";
import { TEXT_FORMAT_ITEMS } from "../constants/toolbar.constants";

export function TextFormatGroup() {
  const editor = useEditorStore((state) => state.editor);

  // Lắng nghe trạng thái format tại vị trí con trỏ chuột trong editor (2-way sync)
  const activeFormats =
    useEditorState({
      editor,
      selector: (ctx) => {
        const ed = ctx.editor;
        if (!ed) return [];
        const formats: string[] = [];
        if (ed.isActive("bold")) formats.push("bold");
        if (ed.isActive("italic")) formats.push("italic");
        if (ed.isActive("underline")) formats.push("underline");
        return formats;
      },
    }) ?? [];

  const handleToggle = (formatValue: string) => {
    if (!editor) return;

    if (formatValue === "bold") {
      editor.chain().focus().toggleBold().run();
    } else if (formatValue === "italic") {
      editor.chain().focus().toggleItalic().run();
    } else if (formatValue === "underline") {
      if (typeof (editor.chain().focus() as any).toggleUnderline === "function") {
        (editor.chain().focus() as any).toggleUnderline().run();
      }
    }
  };

  return (
    <ToggleGroup
      type="multiple"
      size="sm"
      value={activeFormats}
      disabled={!editor}
    >
      {TEXT_FORMAT_ITEMS.map(({ value, label, icon: Icon }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          aria-label={label}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleToggle(value)}
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
