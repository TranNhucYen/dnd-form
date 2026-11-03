import type { ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import {
  Rows3,
  Columns3,
  TableCellsMerge,
  Trash2,
  Plus,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "../../store/useEditorStore";
import type { FieldToolbarProps, DatatableFieldData } from "../types/field.types";
import { FORM_BUILDER_LABELS } from "../../constants/labels";

type MenuAction = { label: string; run: () => void; destructive?: boolean };

const TOOLBAR_BUTTON_CLASS =
  "h-7 gap-1 px-1.5 text-xs font-normal hover:bg-neutral-100";

/**
 * Chạy thao tác trên bảng mà không làm mất vùng ô đang chọn (CellSelection) của editor
 */
function runOnEditor(editor: Editor, action: () => void) {
  if (!editor.isEditable) {
    editor.setEditable(true);
  }
  action();
}

function TableMenu({
  icon: Icon,
  label,
  title,
  addActions,
  deleteAction,
  editor,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  addActions: MenuAction[];
  deleteAction: MenuAction;
  editor: Editor;
}): ReactNode {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={TOOLBAR_BUTTON_CLASS} title={title}>
          <Icon className="size-3.5 text-neutral-600" />
          <span>{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        className="w-40 text-xs"
        onMouseDown={(e) => e.preventDefault()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {addActions.map(({ label, run }) => (
          <DropdownMenuItem key={label} onClick={() => runOnEditor(editor, run)}>
            <Plus className="mr-1.5 size-3" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => runOnEditor(editor, deleteAction.run)}
        >
          <Trash2 className="mr-1.5 size-3" />
          <span>{deleteAction.label}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DatatableToolbar({}: FieldToolbarProps<DatatableFieldData>) {
  const editor = useEditorStore((state) => state.editor);

  if (!editor) {
    return null;
  }

  const mergeOrSplit = () => {
    if (editor.can().mergeCells()) {
      editor.commands.mergeCells();
    } else if (editor.can().splitCell()) {
      editor.commands.splitCell();
    } else {
      editor.commands.mergeOrSplit();
    }
  };

  return (
    // preventDefault ở mousedown để editor không mất focus / vùng chọn khi bấm toolbar
    <div
      className="flex items-center gap-0.5"
      onMouseDown={(e) => e.preventDefault()}
    >
      <TableMenu
        editor={editor}
        icon={Rows3}
        label={FORM_BUILDER_LABELS.fields.datatable.row}
        title={FORM_BUILDER_LABELS.fields.datatable.rowActions}
        addActions={[
          { label: FORM_BUILDER_LABELS.fields.datatable.addRowAbove, run: () => editor.chain().addRowBefore().run() },
          { label: FORM_BUILDER_LABELS.fields.datatable.addRowBelow, run: () => editor.chain().addRowAfter().run() },
        ]}
        deleteAction={{ label: FORM_BUILDER_LABELS.fields.datatable.deleteRow, run: () => editor.chain().deleteRow().run() }}
      />

      <TableMenu
        editor={editor}
        icon={Columns3}
        label={FORM_BUILDER_LABELS.fields.datatable.column}
        title={FORM_BUILDER_LABELS.fields.datatable.columnActions}
        addActions={[
          { label: FORM_BUILDER_LABELS.fields.datatable.addColumnLeft, run: () => editor.chain().addColumnBefore().run() },
          { label: FORM_BUILDER_LABELS.fields.datatable.addColumnRight, run: () => editor.chain().addColumnAfter().run() },
        ]}
        deleteAction={{ label: FORM_BUILDER_LABELS.fields.datatable.deleteColumn, run: () => editor.chain().deleteColumn().run() }}
      />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => runOnEditor(editor, mergeOrSplit)}
        className={TOOLBAR_BUTTON_CLASS}
        title={FORM_BUILDER_LABELS.fields.datatable.mergeSplitTitle}
      >
        <TableCellsMerge className="size-3.5 text-neutral-600" />
        <span>{FORM_BUILDER_LABELS.fields.datatable.mergeSplit}</span>
      </Button>
    </div>
  );
}
