import { useEffect, useRef } from "react";
import { EditorContent, Node, useEditor } from "@tiptap/react";
import { closeHistory } from "@tiptap/pm/history";
import type { EditorState } from "@tiptap/pm/state";
import type { FieldProps, DatatableFieldData } from "../types/field.types";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import { useEditorStore } from "../../store/useEditorStore";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import { DEFAULT_FIELD_DATA } from "../../constants";
import "./datatable.css";

/**
 * Giới hạn root document chỉ chứa bảng, ngăn ProseMirror tự chèn đoạn văn thừa ở đáy bảng
 */
const TableDocument = Node.create({
  name: "doc",
  topNode: true,
  content: "table",
});

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
}: FieldProps<DatatableFieldData>) {
  const setEditor = useEditorStore((state) => state.setEditor);
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId);
  const hasRecordedCellHistoryRef = useRef(false);
  const lastCellPosRef = useRef<number | null>(null);

  const isFieldSelected = id !== undefined ? selectedFieldId === id : false;

  useEffect(() => {
    if (isFieldSelected) {
      hasRecordedCellHistoryRef.current = false;
      lastCellPosRef.current = null;
    }
  }, [isFieldSelected]);

  const editor = useEditor({
    extensions: [
      TableDocument,
      StarterKit.configure({
        document: false, // Dùng TableDocument thay thế document mặc định
        undoRedo: {
          newGroupDelay: 300,
        },
      }),
      TableKit.configure({
        table: {
          resizable: true,
          renderWrapper: true,
          handleWidth: 6,
          cellMinWidth: 35, // Độ rộng cột tối thiểu
          lastColumnResizable: false, // Không kéo mép ngoài cùng để tránh vượt tổng width
        },
      }),
    ],
    immediatelyRender: false,
    editable: true,
    content:
      data.content ?? data.html ?? DEFAULT_FIELD_DATA.datatable.html,
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
          useFormBuilderStore.getState().setSelectedFieldId(null);
          return true;
        }
        return false;
      },
    },
    onFocus: ({ editor }) => setEditor(editor),
    onBlur: () => {
      // Khi blur, không làm gì nếu người dùng click vào toolbar
    },
    onDestroy: () => {
      if (useEditorStore.getState().editor === editor) {
        setEditor(null);
      }
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(isFieldSelected);
    if (isFieldSelected) {
      setEditor(editor);
    } else {
      if (useEditorStore.getState().editor === editor) {
        setEditor(null);
      }
    }
  }, [isFieldSelected, editor, setEditor]);

  // Đồng bộ ngược khi dữ liệu từ store thay đổi (ví dụ khi Undo / Redo)
  useEffect(() => {
    if (!editor || isFieldSelected) return;
    const currentHtml = editor.getHTML();
    const targetHtml = data?.html ?? "";
    if (targetHtml && currentHtml !== targetHtml) {
      editor.commands.setContent(data?.content ?? targetHtml, {
        emitUpdate: false,
      });
    }
  }, [data?.content, data?.html, editor, isFieldSelected]);

  if (!editor) return null;

  return (
    <div
      onPointerDown={(event) => {
        if (isFieldSelected) {
          event.stopPropagation();
        }
      }}
      className={`w-full bg-white ${!isFieldSelected ? "select-none" : "cursor-text"}`}
    >
      <EditorContent className="datatable-field-editor" editor={editor} />
    </div>
  );
}
