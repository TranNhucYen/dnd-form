import { useEditorState } from "@tiptap/react";
import type { FieldPartStyle, FieldStyle } from "../../types/formBuilder.types";
import { useEditorStore } from "../../store/useEditorStore";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";

type ScopedProp = "FontWeight" | "FontStyle" | "TextDecoration" | "Color";

const FORMAT_CONFIG = {
  bold: { prop: "FontWeight", activeVal: "bold", defaultVal: "normal" },
  italic: { prop: "FontStyle", activeVal: "italic", defaultVal: "normal" },
  underline: { prop: "TextDecoration", activeVal: "underline", defaultVal: "none" },
} as const;

export function useActiveToolbarState() {
  const editor = useEditorStore((state) => state.editor);
  const selectedField = useFormBuilderStore((state) =>
    state.fields.find((f) => f.id === state.selectedFieldId),
  );
  const updateFieldStyle = useFormBuilderStore((state) => state.updateFieldStyle);
  const updateFieldPartStyle = useFormBuilderStore((state) => state.updateFieldPartStyle);

  const formatScope = useFormBuilderStore((state) => state.formatScope);
  const setFormatScope = useFormBuilderStore((state) => state.setFormatScope);

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

  const canScope = Boolean(
    selectedField &&
    ["text", "number", "select", "date", "signature"].includes(selectedField.type),
  );

  // Helper đọc style hiện tại, tự động phân giải qua parts hoặc base style
  const getScopedStyle = (prop: ScopedProp) => {
    const s = selectedField?.style;
    if (!s) return undefined;
    const key = (prop.charAt(0).toLowerCase() + prop.slice(1)) as keyof FieldPartStyle;
    if (canScope && formatScope !== "all") {
      return s.parts?.[formatScope]?.[key] ?? s[key];
    }
    return s[key];
  };

  // Active formats (B, I, U)
  const activeFormats: string[] = (() => {
    if (isTiptapActive && tiptapState) {
      return tiptapState.formats;
    }
    if (!selectedField?.style) {
      return [];
    }

    const formats: string[] = [];
    if (getScopedStyle("FontWeight") === "bold") formats.push("bold");
    if (getScopedStyle("FontStyle") === "italic") formats.push("italic");
    if (getScopedStyle("TextDecoration") === "underline") formats.push("underline");
    return formats;
  })();

  const fontFamily = selectedField?.style?.fontFamily || "Times New Roman";
  const fontSize = selectedField?.style?.fontSize || "14";
  const textAlign = selectedField?.style?.textAlign || "left";
  const textColor = (getScopedStyle("Color") as string) || "#000000";
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
        const chain = editor.chain().focus() as unknown as {
          toggleUnderline?: () => { run: () => boolean };
        };
        if (typeof chain.toggleUnderline === "function") {
          chain.toggleUnderline().run();
        }
      }
      return;
    }

    if (!selectedField) return;

    const { prop, activeVal, defaultVal } = FORMAT_CONFIG[format];
    const current = getScopedStyle(prop);
    const nextVal = current === activeVal ? defaultVal : activeVal;
    const key = (prop.charAt(0).toLowerCase() + prop.slice(1)) as keyof FieldPartStyle;

    if (canScope && formatScope !== "all") {
      updateFieldPartStyle(selectedField.id, formatScope, {
        [key]: nextVal,
      });
    } else {
      updateFieldStyle(selectedField.id, {
        [key]: nextVal,
      });
    }
  };

  const setTextAlign = (val: "left" | "center" | "right" | "justify") => {
    if (selectedField) {
      updateFieldStyle(selectedField.id, { textAlign: val });
    }
  };

  const setTextColor = (val: string) => {
    if (!selectedField) return;
    if (canScope && formatScope !== "all") {
      updateFieldPartStyle(selectedField.id, formatScope, {
        color: val,
      });
    } else {
      updateFieldStyle(selectedField.id, {
        color: val,
      });
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
    canScope,
    formatScope,
    setFormatScope,
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
