'use client';
import { FormBuilderWorkspace } from "@/features/form-builder/FormBuilderWorkspace";

export default function EditorPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Trình chỉnh sửa biểu mẫu (Form Editor)</h1>
      <p className="text-muted-foreground text-sm mt-2">Kéo thả các trường dữ liệu để thiết kế biểu mẫu.</p>
      <FormBuilderWorkspace/>
    </div>
  )
}
