import { CheckSquare, ClipboardPaste } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import { FORM_BUILDER_LABELS } from "../../constants/labels";

type CanvasContextMenuProps = {
  children: React.ReactNode;
};

/**
 * CanvasContextMenu: ContextMenu hiển thị khi nhấp chuột phải vào vùng trống của canvas
 */
export function CanvasContextMenu({ children }: CanvasContextMenuProps) {
  const clipboardField = useFormBuilderStore((state) => state.clipboardField);
  const pasteField = useFormBuilderStore((state) => state.pasteField);
  const selectAllFields = useFormBuilderStore((state) => state.selectAllFields);

  const canPaste = clipboardField !== null;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-48">
        <ContextMenuItem
          disabled={!canPaste}
          onClick={() => {
            if (canPaste) {
              pasteField();
            }
          }}
        >
          <ClipboardPaste className="size-3.5" />
          <span>{FORM_BUILDER_LABELS.canvasMenu.paste}</span>
          <ContextMenuShortcut>{FORM_BUILDER_LABELS.canvasMenu.pasteShortcut}</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={() => selectAllFields()}>
          <CheckSquare className="size-3.5" />
          <span>{FORM_BUILDER_LABELS.canvasMenu.selectAll}</span>
          <ContextMenuShortcut>{FORM_BUILDER_LABELS.canvasMenu.selectAllShortcut}</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
