import { useEffect, useState } from "react";
import type { FieldProps, TextareaFieldData } from "../types/field.types";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEditorStore } from "../../store/useEditorStore";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";

const DEFAULT_TEXTAREA_CONTENT = "<p>Đoạn văn</p>";

export function TextareaField({
  id,
  data,
  onDataChange,
}: FieldProps<TextareaFieldData> = {}) {
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
    extensions: [StarterKit, Underline],
    content: data?.content ?? data?.html ?? DEFAULT_TEXTAREA_CONTENT,
    immediatelyRender: false,
    editable: false,
    onUpdate: ({ editor }) => {
      onDataChange?.({
        content: editor.getJSON(),
        html: editor.getHTML(),
      });
    },
    editorProps: {
      attributes: {
        class: "h-full w-full outline-none cursor-text select-text",
      },
      handleKeyDown: (_, event) => {
        if (event.key === "Escape") {
          setIsEditing(false);
          return true;
        }
        return false;
      },
    },
    onFocus: ({ editor }) => {
      setEditor(editor);
    },
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
      editor.commands.focus("end");
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
      className={`
        h-full w-full overflow-hidden border border-gray-400 bg-white p-1 cursor-text 
        ${!isEditing ? "select-none" : ""}`
      }
    >
      <EditorContent className="h-full w-full" editor={editor} />
    </div>
  );
}