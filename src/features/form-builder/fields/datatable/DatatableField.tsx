import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import type { FieldProps } from "../types/field.types";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import Underline from "@tiptap/extension-underline";
import { useEditorStore } from "../../store/useEditorStore";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import "./datatable.css";

export function DatatableField({ id }: FieldProps = {}) {
  const setEditor = useEditorStore((state) => state.setEditor);
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId);
  const [isEditing, setIsEditing] = useState(false);

  const isFieldSelected = id !== undefined ? selectedFieldId === id : false;

  // Khi click ra ngoài canvas hoặc unselect field này thì tự động tắt editing
  useEffect(() => {
    if (!isFieldSelected && isEditing) {
      setIsEditing(false);
    }
  }, [isFieldSelected, isEditing]);

  const editor = useEditor({
    extensions: [
      StarterKit,
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
    content: `
      <table>
        <tbody>
          <tr>
            <th>Cột 1</th>
            <th>Cột 2</th>
          </tr>
          <tr>
            <td>Hàng 1</td>
            <td>Hàng 2</td>
          </tr>
        </tbody>
      </table>
    `,
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
