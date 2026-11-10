"use client";

import { useEffect } from "react";
import { useFormBuilderStore } from "@/features/form-builder/store/useFormBuilderStore";

export function GlobalSelectionGuard() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "a") {
        return;
      }

      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const isTextEntry =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable ||
        Boolean(target.closest('[contenteditable="true"], [role="textbox"]'));
      if (isTextEntry) return;

      event.preventDefault();

      if (target.closest('[data-droppable-id="canvas"]')) {
        useFormBuilderStore.getState().selectAllFields();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  return null;
}
