import { useEffect, useRef, useState } from "react";
import type { FieldProps, TextareaFieldData } from "../types/field.types";
import { useEditor, EditorContent } from "@tiptap/react";
import { closeHistory } from "@tiptap/pm/history";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEditorStore } from "../../store/useEditorStore";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function TextareaField({
  id,
  data,
  onDataChange,
}: FieldProps<TextareaFieldData> = {}) {
  const setEditor = useEditorStore((state) => state.setEditor);
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId);
  const [isEditing, setIsEditing] = useState(false);
  const hasRecordedHistoryRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFieldSelected = id !== undefined ? selectedFieldId === id : false;

  // Khi click ra ngoài canvas hoặc unselect field này thì tự động tắt editing
  useEffect(() => {
    if (!isFieldSelected && isEditing) {
      setIsEditing(false);
    }
  }, [isFieldSelected, isEditing]);

  useEffect(() => {
    if (isEditing) {
      hasRecordedHistoryRef.current = false;
    }
  }, [isEditing]);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        undoRedo: {
          newGroupDelay: 300,
        },
      }),
      Underline,
    ],
    content: data?.content ?? data?.html ?? DEFAULT_FIELD_DATA.textarea.html,
    immediatelyRender: false,
    editable: false,
    onUpdate: ({ editor }) => {
      if (!hasRecordedHistoryRef.current) {
        hasRecordedHistoryRef.current = true;
        useFormBuilderStore.getState().recordHistory();
      }

      // Tự động phân đoạn lịch sử nếu người dùng tạm dừng gõ > 1.2s (kết thúc một câu / một ý)
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = setTimeout(() => {
        hasRecordedHistoryRef.current = false;
        editor.view.dispatch(closeHistory(editor.state.tr));
      }, 1200);

      onDataChange?.(
        {
          content: editor.getJSON(),
          html: editor.getHTML(),
        },
        { skipHistory: true },
      );
    },
    editorProps: {
      attributes: {
        class: "h-full w-full outline-none cursor-text select-text",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Escape") {
          setIsEditing(false);
          return true;
        }

        if (event.key === "Enter") {
          // Khi nhấn Enter xuống dòng (đoạn văn mới): chốt ngay nhóm lịch sử của dòng trước
          view.dispatch(closeHistory(view.state.tr));
          hasRecordedHistoryRef.current = false;
          return false;
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