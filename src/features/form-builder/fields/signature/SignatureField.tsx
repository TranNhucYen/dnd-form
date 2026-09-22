import { useEffect, useState } from "react";
import type { FieldProps, SignatureFieldData } from "../types/field.types";
import { InputOverlay } from "../shared/InputOverlay";
import { useInlineEdit } from "../shared/useInlineEdit";
import { SignatureModal } from "./SignatureModal";
import { PenLine, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SignatureField({
  data,
  onDataChange,
}: FieldProps<SignatureFieldData> = {}) {
  const [signatureUrl, setSignatureUrl] = useState<string | null>(
    data?.value ?? null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const titleEdit = useInlineEdit(data?.label ?? "Người làm đơn", (newTitle) => {
    onDataChange?.({ label: newTitle });
  });
  const noteEdit = useInlineEdit(
    data?.subTitle ?? "(Ký, ghi rõ họ tên)",
    (newNote) => {
      onDataChange?.({ subTitle: newNote });
    },
  );

  const nameEdit = useInlineEdit(
    data?.signerName ?? "Trần Văn A",
    (newName) => {
      onDataChange?.({ signerName: newName });
    },
  );

  useEffect(() => {
    setSignatureUrl(data?.value ?? null);
  }, [data?.value]);

  return (
    <div className="flex h-full w-full flex-col justify-between p-2 bg-background select-none overflow-hidden">
      {/* Phần đầu: 2 dòng tiêu đề và ghi chú */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <InlineEditLine
          edit={titleEdit}
          className="text-center text-sm font-bold text-foreground"
        />
        <InlineEditLine
          edit={noteEdit}
          className="text-center text-xs italic text-muted-foreground"
        />
      </div>

      {/* Phần giữa: Khung hiển thị chữ ký */}
      <SignaturePreview
        src={signatureUrl}
        onOpen={() => setIsModalOpen(true)}
        onClear={() => {
          setSignatureUrl(null);
          onDataChange?.({ value: undefined });
        }}
      />

      {/* Phần dưới: Tên người ký */}
      <div className="shrink-0">
        <InlineEditLine
          edit={nameEdit}
          className="text-center text-sm font-medium text-foreground"
        />
      </div>

      {/* Modal vẽ chữ ký lớn, độc lập */}
      <SignatureModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={(dataUrl) => {
          setSignatureUrl(dataUrl);
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
function InlineEditLine({ edit, className, }: {
  edit: ReturnType<typeof useInlineEdit>; className?: string;
}) {
  return (
    <div
      onDoubleClick={edit.handleDoubleClick}
      className="relative w-full cursor-text"
    >
      <span
        className={cn(
          "block w-full",
          className,
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
        />
      )}
    </div>
  );
}
