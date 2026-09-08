import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import type { FieldProps } from "../types/field.types";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import { useEditorStore } from "../../store/useEditorStore";
import "./datatable.css";

export function DatatableField({ }: FieldProps = {}) {
  const setEditor = useEditorStore((state) => state.setEditor);
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
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
    onCreate: ({ editor }) => {
      setEditor(editor);
      editor.setEditable(false);
    },
    onFocus: ({ editor }) => setEditor(editor),
    onBlur: () => {
      setIsEditing(false);
    },
    onDestroy: () => setEditor(null),
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(isEditing);
    if (isEditing) {
      editor.commands.focus();
    }
  }, [isEditing, editor]);

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
