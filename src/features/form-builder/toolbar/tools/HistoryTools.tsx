"use client";

import { Redo2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorState } from "@tiptap/react";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import { useEditorStore } from "../../store/useEditorStore";

export function HistoryTools() {
  const editor = useEditorStore((state) => state.editor);
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId);
  const selectedField = useFormBuilderStore((state) =>
    state.fields.find((f) => f.id === state.selectedFieldId),
  );

  // Canvas History State từ useFormBuilderStore
  const canvasCanUndo = useFormBuilderStore((state) => state.canUndo);
  const canvasCanRedo = useFormBuilderStore((state) => state.canRedo);
  const canvasUndo = useFormBuilderStore((state) => state.undo);
  const canvasRedo = useFormBuilderStore((state) => state.redo);

  // Kiểm tra field hiện tại có phải là Tiptap Editor (Textarea, Datatable) đang mở soạn thảo không
  const isTiptapField = selectedField?.type === "textarea" || selectedField?.type === "datatable";
  const isTiptapActive = Boolean(editor && editor.isEditable && isTiptapField);

  // Lắng nghe trạng thái undo/redo từ tiptap khi người dùng đang soạn thảo
  const tiptapHistory = useEditorState({
    editor,
    selector: (ctx) => {
      const ed = ctx.editor;
      if (!ed || !isTiptapActive) {
        return { canUndo: false, canRedo: false };
      }
      return {
        canUndo: ed.can().undo(),
        canRedo: ed.can().redo(),
      };
    },
  });

  // Chuyển đổi ngữ cảnh giữa titap và canvas cho chức năng undo, redo
  const canUndo = isTiptapActive
    ? (tiptapHistory?.canUndo ?? false)
    : canvasCanUndo;

  const canRedo = isTiptapActive
    ? (tiptapHistory?.canRedo ?? false)
    : canvasCanRedo;

  const handleUndo = () => {
    if (isTiptapActive && editor) {
      // undo nội dung chữ trong Tiptap editor
      editor.chain().focus().undo().run();
    } else {
      // undo đối tượng trên Canvas
      canvasUndo();
    }
  };

  const handleRedo = () => {
    if (isTiptapActive && editor) {
      // redo nội dung chữ trong Tiptap editor
      editor.chain().focus().redo().run();
    } else {
      // redo đối tượng trên Canvas
      canvasRedo();
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled={!canUndo}
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleUndo}
        title="Undo (ctrl + z)"
        className="size-7 p-0 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
      >
        <Undo2 className="size-3.5" />
      </Button>

      {/* Nút Làm lại (Redo) */}
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled={!canRedo}
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleRedo}
        title="Redo (ctrl + z),(ctrl + shift + z)"
        className="size-7 p-0 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
      >
        <Redo2 className="size-3.5" />
      </Button>
    </div>
  );
}
