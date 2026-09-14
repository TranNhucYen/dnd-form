import {
  Copy,
  CopyPlus,
  Plus,
  Scissors,
  TableCellsMerge,
  Trash2,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import { useEditorStore } from "../../store/useEditorStore";
import type { FieldType } from "../../types/formBuilder.types";

type FieldContextMenuProps = {
  fieldId: string;
  type?: FieldType;
  children: React.ReactNode;
};

/**
 * FieldContextMenu: Contextmenu hiển thị khi nhấp chuột phải vào một Field trên canvas
 */
export function FieldContextMenu({
  fieldId,
  type,
  children,
}: FieldContextMenuProps) {
  const setSelectedFieldId = useFormBuilderStore(
    (state) => state.setSelectedFieldId,
  );
  const duplicateField = useFormBuilderStore((state) => state.duplicateField);
  const copyField = useFormBuilderStore((state) => state.copyField);
  const cutField = useFormBuilderStore((state) => state.cutField);
  const removeField = useFormBuilderStore((state) => state.removeField);

  return (
    <ContextMenu
      onOpenChange={(open) => {
        if (open) {
          setSelectedFieldId(fieldId);
        }
      }}
    >
      <ContextMenuTrigger
        asChild
        onContextMenu={(event) => {
          event.stopPropagation();
        }}
      >
        {children}
      </ContextMenuTrigger>

      <ContextMenuContent className="w-52">
        <ContextMenuItem
          variant="destructive"
          onClick={() => removeField(fieldId)}
        >
          <Trash2 className="size-3.5" />
          <span>Xóa</span>
          <ContextMenuShortcut>Del / Backspace</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => duplicateField(fieldId)}>
          <CopyPlus className="size-3.5" />
          <span>Nhân bản</span>
          <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => copyField(fieldId)}>
          <Copy className="size-3.5" />
          <span>Sao chép</span>
          <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => cutField(fieldId)}>
          <Scissors className="size-3.5" />
          <span>Cắt</span>
          <ContextMenuShortcut>Ctrl+X</ContextMenuShortcut>
        </ContextMenuItem>

        {type === "datatable" && (
          <>
            <ContextMenuSeparator />
            <TableTool />
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}

function TableTool() {
  const editor = useEditorStore((state) => state.editor);

  if (!editor) return null;

  return (
    <>
      <ContextMenuItem
        onClick={() => editor.chain().focus().addRowBefore().run()}
      >
        <Plus className="size-3.5" />
        <span>Thêm hàng trên</span>
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        <Plus className="size-3.5" />
        <span>Thêm hàng dưới</span>
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => editor.chain().focus().addColumnBefore().run()}
      >
        <Plus className="size-3.5" />
        <span>Thêm cột trái</span>
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        <Plus className="size-3.5" />
        <span>Thêm cột phải</span>
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => editor.chain().focus().mergeOrSplit().run()}
      >
        <TableCellsMerge className="size-3.5" />
        <span>Gộp / Tách ô</span>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        variant="destructive"
        onClick={() => editor.chain().focus().deleteRow().run()}
      >
        <Trash2 className="size-3.5" />
        <span>Xóa hàng</span>
      </ContextMenuItem>
      <ContextMenuItem
        variant="destructive"
        onClick={() => editor.chain().focus().deleteColumn().run()}
      >
        <Trash2 className="size-3.5" />
        <span>Xóa cột</span>
      </ContextMenuItem>
    </>
  );
}