import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { closeHistory } from "@tiptap/pm/history";
import type { EditorState } from "@tiptap/pm/state";
import type { FieldProps, DatatableFieldData } from "../types/field.types";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import Underline from "@tiptap/extension-underline";
import { useEditorStore } from "../../store/useEditorStore";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import { DEFAULT_FIELD_DATA } from "../../constants";
import "./datatable.css";

/**
 * Helper: Xác định vị trí bắt đầu (offset) của ô bảng (tableCell hoặc tableHeader) hiện tại
 */
function getActiveCellPos(state: EditorState): number | null {
  const { $from } = state.selection;
  for (let d = $from.depth; d > 0; d--) {
    const node = $from.node(d);
    if (node.type.name === "tableCell" || node.type.name === "tableHeader") {
      return $from.before(d);
    }
  }
  return null;
}

export function DatatableField({
  id,
  data,
  onDataChange,
}: FieldProps<DatatableFieldData> = {}) {
  const setEditor = useEditorStore((state) => state.setEditor);
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId);
  const [isEditing, setIsEditing] = useState(false);
  const hasRecordedCellHistoryRef = useRef(false);
  const lastCellPosRef = useRef<number | null>(null);

  const isFieldSelected = id !== undefined ? selectedFieldId === id : false;

  // Khi click ra ngoài canvas hoặc unselect field này thì tự động tắt editing
  useEffect(() => {
    if (!isFieldSelected && isEditing) {
      setIsEditing(false);
    }
  }, [isFieldSelected, isEditing]);

  useEffect(() => {
    if (isEditing) {
      hasRecordedCellHistoryRef.current = false;
      lastCellPosRef.current = null;
    }
  }, [isEditing]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        undoRedo: {
          newGroupDelay: 300,
        },
      }),
      Underline,
      TableKit.configure({
        table: {
          resizable: true,
          renderWrapper: true,
          handleWidth: 6,
          cellMinWidth: 25,
          lastColumnResizable: true,
        },
      }),
    ],
    immediatelyRender: false,
    editable: false,
    content:
      data?.content ?? data?.html ?? DEFAULT_FIELD_DATA.datatable.html,
    onSelectionUpdate: ({ editor }) => {
      const currentCellPos = getActiveCellPos(editor.state);
      if (
        currentCellPos !== null &&
        lastCellPosRef.current !== null &&
        currentCellPos !== lastCellPosRef.current
      ) {
        // Chuyển sang ô khác trong bảng: đóng nhóm undo cũ để không gộp với ô mới
        editor.view.dispatch(closeHistory(editor.state.tr));
        hasRecordedCellHistoryRef.current = false;
      }
      lastCellPosRef.current = currentCellPos;
    },
    onUpdate: ({ editor }) => {
      const currentCellPos = getActiveCellPos(editor.state);
      if (
        currentCellPos !== null &&
        lastCellPosRef.current !== null &&
        currentCellPos !== lastCellPosRef.current
      ) {
        editor.view.dispatch(closeHistory(editor.state.tr));
        hasRecordedCellHistoryRef.current = false;
      }
      lastCellPosRef.current = currentCellPos;

      if (!hasRecordedCellHistoryRef.current) {
        hasRecordedCellHistoryRef.current = true;
        useFormBuilderStore.getState().recordHistory();
      }
      onDataChange?.(
        {
          content: editor.getJSON(),
          html: editor.getHTML(),
        },
        { skipHistory: true },
      );
    },
    editorProps: {
      handleKeyDown: (_, event) => {
        if (event.key === "Escape") {
          setIsEditing(false);
          return true;
        }
        return false;
      },
    },
    onFocus: ({ editor }) => setEditor(editor),
    onBlur: ({ event }) => {
      const relatedTarget = event?.relatedTarget as HTMLElement | null;
      if (
        relatedTarget &&
        (relatedTarget.closest("[data-toolbar]") ||
          relatedTarget.closest("[data-radix-popper-content-wrapper]") ||
          relatedTarget.closest("[role='dialog']"))
      ) {
        return;
      }
      setIsEditing(false);
    },
    onDestroy: () => {
      if (useEditorStore.getState().editor === editor) {
        setEditor(null);
      }
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(isEditing);
    if (isEditing) {
      setEditor(editor);
      editor.commands.focus();
    } else {
      if (useEditorStore.getState().editor === editor) {
        setEditor(null);
      }
    }
  }, [isEditing, editor, setEditor]);

  // Đồng bộ ngược khi dữ liệu từ store thay đổi (ví dụ khi Undo / Redo)
  useEffect(() => {
    if (!editor || isEditing) return;
    const currentHtml = editor.getHTML();
    const targetHtml = data?.html ?? "";
    if (targetHtml && currentHtml !== targetHtml) {
      editor.commands.setContent(data?.content ?? targetHtml, {
        emitUpdate: false,
      });
    }
  }, [data?.content, data?.html, editor, isEditing]);

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsEditing(true);
  };

  if (!editor) return null;

  return (
    <div
      onDoubleClick={handleDoubleClick}
      onPointerDown={(event) => {
        if (isEditing) {
          event.stopPropagation();
        }
      }}
      className={`h-full w-full overflow-hidden bg-white ${!isEditing ? "select-none" : "cursor-text"}`}
    >
      <EditorContent className="datatable-field-editor" editor={editor} />
    </div>
  );
}
