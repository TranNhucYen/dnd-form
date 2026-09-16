import { DragDropProvider } from "@dnd-kit/react";
import { useState } from "react";
import { CanvasViewPort } from "./canvas/CanvasViewPort";
import { DragPreviewOverlay } from "./dnd/DragPreviewOverlay";
import { Palette } from "./left-sidebar/Palette";
import { EditorToolbar } from "./toolbar";

export function FormBuilderWorkspace() {
  const [isDraggingOverField, setIsDraggingOverField] = useState(false);

  return (
    <DragDropProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-neutral-100">
        {/* Thanh công cụ định dạng phía trên (Toolbar) */}
        <EditorToolbar />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Thanh công cụ danh sách các field kéo thả */}
          <Palette />

          {/* Khung nhìn vùng làm việc chứa trang Canvas */}
          <main className="min-w-0 flex-1">
            <CanvasViewPort onCollisionChange={setIsDraggingOverField} />
          </main>

          {/* Lớp overlay khi kéo thả field */}
          <DragPreviewOverlay isDraggingOverField={isDraggingOverField} />
        </div>
      </div>
    </DragDropProvider>
  );
}