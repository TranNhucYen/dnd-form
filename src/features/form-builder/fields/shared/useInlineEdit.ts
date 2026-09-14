import { useEffect, useRef, useState } from "react";

export function useInlineEdit(
  initialValue: string,
  onSave?: (val: string) => void,
) {
  const [value, setValue] = useState(initialValue);
  const [prevInitial, setPrevInitial] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tự đồng bộ nếu props từ ngoài thay đổi
  if (initialValue !== prevInitial) {
    setPrevInitial(initialValue);
    setValue(initialValue);
  }

  // Tự động focus và đưa con trỏ về cuối chữ khi kích hoạt edit
  useEffect(() => {
    if (isEditing && inputRef.current) {
      const input = inputRef.current;
      input.focus();
      const length = input.value.length;
      input.setSelectionRange(length, length);
      requestAnimationFrame(() => input.setSelectionRange(length, length));
    }
  }, [isEditing]);

  const handleDoubleClick = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    setIsEditing(true);
  };

  const handleSubmit = () => {
    setIsEditing(false);
    onSave?.(value);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  return {
    value,
    setValue,
    isEditing,
    setIsEditing,
    inputRef,
    handleDoubleClick,
    handleSubmit,
    handleCancel,
  };
}
