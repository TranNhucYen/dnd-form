import { useState } from "react";
import type { FieldProps, SignatureFieldData } from "../types/field.types";
import { FieldScopeSlot } from "../shared/FieldScopeSlot";
import { InputOverlay } from "../shared/InputOverlay";
import { useInlineEdit, type UseInlineEditReturn } from "../shared/useInlineEdit";
import { SignatureModal } from "./SignatureModal";
import { PenLine, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { getFieldPartStyle } from "../shared/fieldStyle.utils";
import { DEFAULT_FIELD_DATA } from "../../constants";

export function SignatureField({
  id,
  data,
  style,
  onDataChange,
}: FieldProps<SignatureFieldData>) {
  const fieldData = data;
  const signatureUrl = fieldData.value ?? null;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const titleEdit = useInlineEdit(fieldData.label, (newTitle) => {
    onDataChange?.({ label: newTitle });
  });
  const noteEdit = useInlineEdit(
    fieldData.subTitle,
    (newNote) => {
      onDataChange?.({ subTitle: newNote });
    },
  );

  const nameEdit = useInlineEdit(
    fieldData.signerName,
    (newName) => {
      onDataChange?.({ signerName: newName });
    },
  );

  const { showSignatureLabels, showSignerName } = fieldData;

  const labelCustomStyle = getFieldPartStyle(style, "label", {
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "center",
  });

  const noteCustomStyle = getFieldPartStyle(style, "subTitle", {
    fontWeight: "normal",
    fontStyle: "italic",
    textAlign: "center",
  });

  const valueCustomStyle = getFieldPartStyle(style, "value", {
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "center",
  });

  return (
    <div className="flex h-full w-full flex-col justify-between p-2 bg-transparent select-none overflow-hidden">
      {/* Phần đầu: 2 dòng tiêu đề và ghi chú */}
      {showSignatureLabels && (
        <div className="flex flex-col gap-0.5 shrink-0">
          <FieldScopeSlot
            fieldId={id}
            scope="label"
            as="div"
            isEditing={titleEdit.isEditing}
          >
            <InlineEditLine
              edit={titleEdit}
              style={labelCustomStyle}
              className="text-center"
            />
          </FieldScopeSlot>
          <FieldScopeSlot
            fieldId={id}
            scope="subTitle"
            as="div"
            isEditing={noteEdit.isEditing}
          >
            <InlineEditLine
              edit={noteEdit}
              style={noteCustomStyle}
              className="text-center"
            />
          </FieldScopeSlot>
        </div>
      )}

      {/* Phần giữa: Khung hiển thị chữ ký */}
      <SignaturePreview
        src={signatureUrl}
        onOpen={() => setIsModalOpen(true)}
        onClear={() => {
          onDataChange?.({ value: undefined });
        }}
      />

      {/* Phần dưới: Tên người ký */}
      {showSignerName && (
        <FieldScopeSlot
          fieldId={id}
          scope="value"
          as="div"
          isEditing={nameEdit.isEditing}
          className="shrink-0"
        >
          <InlineEditLine
            edit={nameEdit}
            style={valueCustomStyle}
            className="text-center"
          />
        </FieldScopeSlot>
      )}

      {/* Modal vẽ chữ ký lớn, độc lập */}
      <SignatureModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={(dataUrl) => {
          onDataChange?.({ value: dataUrl ?? undefined });
        }}
      />
    </div>
  );
}

/**
 * SignaturePreview: Khung hiển thị chữ ký ở giữa field
 */
function SignaturePreview({ src, onOpen, onClear }: {
  src: string | null;
  onOpen: () => void;
  onClear: () => void;
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      className="flex flex-1 w-full min-h-12 max-h-20 my-1 cursor-pointer"
    >
      {src ? (
        <div className="group relative flex h-full w-full items-center justify-center p-1">
          <img
            src={src}
            alt="Chữ ký"
            className="max-h-full max-w-full object-contain pointer-events-none"
            draggable={false}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1 text-xs text-destructive"
          >
            <Trash2 className="size-3" />
            Xóa
          </button>
        </div>
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center 
          rounded border border-dashed text-muted-foreground hover:bg-muted/50"
        >
          <PenLine className="size-4" />
          <span className="text-xs">Nhấn để ký</span>
        </div>
      )}
    </div>
  );
}

/**
 * InlineEditLine: Dòng văn bản cho phép chỉnh sửa in-place với InputOverlay
 */
function InlineEditLine({
  edit,
  className,
  style,
}: {
  edit: UseInlineEditReturn<HTMLInputElement>;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      onDoubleClick={edit.handleDoubleClick}
      className={cn("relative w-full cursor-text", className)}
      style={style}
    >
      <span
        className={cn(
          "block w-full truncate",
          edit.isEditing && "invisible"
        )}
      >
        {edit.value || " "}
      </span>
      {edit.isEditing && (
        <InputOverlay
          value={edit.value}
          onChange={edit.setValue}
          onSubmit={edit.handleSubmit}
          onCancel={edit.handleCancel}
          inputRef={edit.inputRef}
          className="w-full"
          style={{ textAlign: style?.textAlign || "center" }}
        />
      )}
    </div>
  );
}
