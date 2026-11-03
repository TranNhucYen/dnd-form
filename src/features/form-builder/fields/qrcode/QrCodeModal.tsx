import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FORM_BUILDER_LABELS } from "../../constants/labels";

type QrCodeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onSave: (newValue: string) => void;
};

export function QrCodeModal({
  open,
  onOpenChange,
  value,
  onSave,
}: QrCodeModalProps) {
  const [text, setText] = useState(value);

  useEffect(() => {
    if (open) {
      setText(value);
    }
  }, [open, value]);

  const handleSave = () => {
    onSave(text);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>{FORM_BUILDER_LABELS.fields.qrcode.dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
            placeholder={FORM_BUILDER_LABELS.fields.qrcode.placeholder}
            autoFocus
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" size="sm" onClick={handleSave}>
              {FORM_BUILDER_LABELS.fields.qrcode.save}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
