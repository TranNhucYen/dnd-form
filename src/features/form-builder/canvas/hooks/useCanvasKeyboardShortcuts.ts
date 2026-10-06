import { useEffect } from "react";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";

/** useCanvasKeyboardShortcuts: Quản lý toàn bộ tổ hợp phím tắt thao tác trên canvas */
export function useCanvasKeyboardShortcuts() {
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId);
  const duplicateField = useFormBuilderStore((state) => state.duplicateField);
  const copyField = useFormBuilderStore((state) => state.copyField);
  const cutField = useFormBuilderStore((state) => state.cutField);
  const pasteField = useFormBuilderStore((state) => state.pasteField);
  const removeField = useFormBuilderStore((state) => state.removeField);
  const undo = useFormBuilderStore((state) => state.undo);
  const redo = useFormBuilderStore((state) => state.redo);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isInputOrEditing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          Boolean(target.closest('[contenteditable="true"]')) ||
          Boolean(target.closest('[role="dialog"]')));

      if (isInputOrEditing) {
        return;
      }

      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();

      // Undo: Ctrl+Z (Windows) hoặc Cmd+Z (Mac)
      if (isCtrlOrCmd && !event.shiftKey && key === "z") {
        event.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Shift+Z, Cmd+Shift+Z, hoặc Ctrl+Y
      if (
        (isCtrlOrCmd && event.shiftKey && key === "z") ||
        (isCtrlOrCmd && !event.shiftKey && key === "y")
      ) {
        event.preventDefault();
        redo();
        return;
      }

      if (
        (event.key === "Delete" || event.key === "Backspace") &&
        selectedFieldId
      ) {
        event.preventDefault();
        removeField(selectedFieldId);
        return;
      }

      if (
        isCtrlOrCmd &&
        (event.key === "d" || event.key === "D") &&
        selectedFieldId
      ) {
        event.preventDefault();
        duplicateField(selectedFieldId);
        return;
      }

      if (
        isCtrlOrCmd &&
        (event.key === "c" || event.key === "C") &&
        selectedFieldId
      ) {
        event.preventDefault();
        copyField(selectedFieldId);
        return;
      }

      if (
        isCtrlOrCmd &&
        (event.key === "x" || event.key === "X") &&
        selectedFieldId
      ) {
        event.preventDefault();
        cutField(selectedFieldId);
        return;
      }

      if (isCtrlOrCmd && (event.key === "v" || event.key === "V")) {
        event.preventDefault();
        pasteField();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedFieldId,
    duplicateField,
    copyField,
    cutField,
    pasteField,
    removeField,
    undo,
    redo,
  ]);
}
