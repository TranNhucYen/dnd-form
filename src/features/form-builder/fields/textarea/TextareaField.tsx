import { useEffect, useState } from "react";
import type { FieldProps } from "../types/field.types";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEditorStore } from "../../store/useEditorStore";

export function TextareaField({ }: FieldProps = {}) {
  const setEditor = useEditorStore((state) => state.setEditor);
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p>Đoạn văn</p>',
    immediatelyRender: false,
    editable: false,
    editorProps: {
      attributes: {
        class: 'h-full w-full outline-none cursor-text select-text',
      },
      handleKeyDown: (_, event) => {
        if (event.key === "Escape") {
          setIsEditing(false);
          return true;
        }
        return false;
      },
    },
    onCreate: ({ editor }) => setEditor(editor),
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
      editor.commands.focus('end');
    }
  }, [isEditing, editor]);

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsEditing(true);
  };

  if (!editor) {
    return null;
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      onPointerDown={(event) => {
        if (isEditing) {
          event.stopPropagation();
        }
      }}
      className={
        `h-full w-full overflow-hidden border border-gray-400 bg-white p-1 cursor-text 
        ${!isEditing ? "select-none" : ""}`}
    >
      <EditorContent className="h-full w-full" editor={editor} />
    </div>
  );
}