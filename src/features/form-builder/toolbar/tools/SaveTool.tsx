"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";

export function SaveTool() {
  const getFormSchema = useFormBuilderStore((state) => state.getFormSchema);

  const handleSave = () => {
    // Hiện thị schema json ở console
    const schema = getFormSchema();
    console.log("=== Form Schema Snapshot ===", schema);
    console.log(JSON.stringify(schema, null, 2));
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleSave}
      title="Lưu"
      className="p-0 hover:text-foreground"
    >
      <Save className="size-3.5 text-primary" />
    </Button>
  );
}
