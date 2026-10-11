import type { Metadata } from "next";
import { Suspense } from "react";
import { EditorWorkspace } from "@/features/editor";

export const metadata: Metadata = {
  title: "Trình thiết kế",
};

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="p-4">Đang tải trình chỉnh sửa...</div>}>
      <EditorWorkspace />
    </Suspense>
  );
}
