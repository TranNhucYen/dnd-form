import { useState } from "react";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";

/**
 * useCanvasFieldsState: Quản lý danh sách fields và các thao tác thêm, sửa, đổi vị trí, resize từ zustand store
 */
export function useCanvasFieldsState() {
  const fields = useFormBuilderStore((state) => state.fields);
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId);
  const setSelectedFieldId = useFormBuilderStore(
    (state) => state.setSelectedFieldId,
  );
  const addField = useFormBuilderStore((state) => state.addField);
  const updateFieldPosition = useFormBuilderStore(
    (state) => state.updateFieldPosition,
  );
  const updateFieldResize = useFormBuilderStore(
    (state) => state.updateFieldResize,
  );
  const measureField = useFormBuilderStore((state) => state.measureField);
  const removeField = useFormBuilderStore((state) => state.removeField);
  const duplicateField = useFormBuilderStore((state) => state.duplicateField);

  const [collidingFieldIds, setCollidingFieldIds] = useState<string[]>([]);

  return {
    fields,
    selectedFieldId,
    setSelectedFieldId,
    collidingFieldIds,
    setCollidingFieldIds,
    addField,
    updateFieldPosition,
    updateFieldResize,
    measureField,
    removeField,
    duplicateField,
  };
}
