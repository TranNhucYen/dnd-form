import { Suspense } from "react";
import { EditorWorkspace } from "@/features/editor";

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="p-4">Đang tải trình chỉnh sửa...</div>}>
      <EditorWorkspace />
    </Suspense>
  );
}
