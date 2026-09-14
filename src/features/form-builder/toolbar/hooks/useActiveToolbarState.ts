import { useEditorState } from "@tiptap/react";
import { useEditorStore } from "../../store/useEditorStore";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";

export function useActiveToolbarState() {
  const editor = useEditorStore((state) => state.editor);
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId);
  const selectedField = useFormBuilderStore((state) =>
    state.fields.find((f) => f.id === state.selectedFieldId)
  );
  const updateFieldStyle = useFormBuilderStore((state) => state.updateFieldStyle);

  // Lắng nghe trạng thái format của tiptap (nếu có)
  const tiptapState = useEditorState({
    editor,
    selector: (ctx) => {
      const ed = ctx.editor;
      if (!ed) {
        return { isFocused: false, formats: [] as string[] };
      }
      const formats: string[] = [];
      if (ed.isActive("bold")) formats.push("bold");
      if (ed.isActive("italic")) formats.push("italic");
      if (ed.isActive("underline")) formats.push("underline");
      return {
        isFocused: ed.isFocused,
        formats,
      };
    },
  });

  const isTiptapField = selectedField?.type === "textarea" || selectedField?.type === "datatable";
  const isTiptapActive = Boolean(editor && editor.isEditable && isTiptapField);
  const isCanvasFieldActive = Boolean(selectedField);
  const isDisabled = !isTiptapActive && !isCanvasFieldActive;

  // Active formats (B,I,U)
  const activeFormats: string[] = (() => {
    if (isTiptapActive && tiptapState) {
      return tiptapState.formats;
    }
    if (selectedField?.style) {
      const formats: string[] = [];
      if (selectedField.style.fontWeight === "bold") formats.push("bold");
      if (selectedField.style.fontStyle === "italic") formats.push("italic");
      if (selectedField.style.textDecoration === "underline") formats.push("underline");
      return formats;
    }
    return [];
  })();

  const fontFamily = selectedField?.style?.fontFamily || "Times New Roman";
  const fontSize = selectedField?.style?.fontSize || "14";
  const textAlign = selectedField?.style?.textAlign || "left";
  const textColor = selectedField?.style?.color || "#000000";
  const bgColor = selectedField?.style?.backgroundColor || "transparent";

  // Actions
  const setFontFamily = (val: string) => {
    if (selectedField) {
      updateFieldStyle(selectedField.id, { fontFamily: val });
    }
  };

  const setFontSize = (val: string) => {
    if (selectedField) {
      updateFieldStyle(selectedField.id, { fontSize: val });
    }
  };

  const toggleFormat = (format: "bold" | "italic" | "underline") => {
    if (isTiptapActive && editor) {
      if (format === "bold") editor.chain().focus().toggleBold().run();
      else if (format === "italic") editor.chain().focus().toggleItalic().run();
      else if (format === "underline") {
        if (typeof (editor.chain().focus() as any).toggleUnderline === "function") {
          (editor.chain().focus() as any).toggleUnderline().run();
        }
      }
      return;
    }

    if (selectedField) {
      if (format === "bold") {
        updateFieldStyle(selectedField.id, {
          fontWeight: selectedField.style?.fontWeight === "bold" ? "normal" : "bold",
        });
      } else if (format === "italic") {
        updateFieldStyle(selectedField.id, {
          fontStyle: selectedField.style?.fontStyle === "italic" ? "normal" : "italic",
        });
      } else if (format === "underline") {
        updateFieldStyle(selectedField.id, {
          textDecoration:
            selectedField.style?.textDecoration === "underline" ? "none" : "underline",
        });
      }
    }
  };

  const setTextAlign = (val: "left" | "center" | "right" | "justify") => {
    if (selectedField) {
      updateFieldStyle(selectedField.id, { textAlign: val });
    }
  };

  const setTextColor = (val: string) => {
    if (selectedField) {
      updateFieldStyle(selectedField.id, { color: val });
    }
  };

  const setBgColor = (val: string) => {
    if (selectedField) {
      updateFieldStyle(selectedField.id, { backgroundColor: val });
    }
  };

  return {
    isTiptapActive,
    isCanvasFieldActive,
    isDisabled,
    activeFormats,
    fontFamily,
    fontSize,
    textAlign,
    textColor,
    bgColor,
    setFontFamily,
    setFontSize,
    toggleFormat,
    setTextAlign,
    setTextColor,
    setBgColor,
  };
}
