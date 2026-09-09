import { useEffect, useRef, useState } from "react";
import { Check, Eraser, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SignatureModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (dataUrl: string) => void;
};

export function SignatureModal({
  open,
  onOpenChange,
  onSave,
}: SignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  };

  useEffect(() => {
    if (!open) return;
    setHasDrawn(false);
    const timer = requestAnimationFrame(() => {
      initCanvas();
    });
    return () => cancelAnimationFrame(timer);
  }, [open]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPosRef.current = { x, y };

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, 1.25, 0, Math.PI * 2);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas || !lastPosRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    lastPosRef.current = { x, y };

    if (!hasDrawn) {
      setHasDrawn(true);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    }
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    setHasDrawn(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDown={(e) => e.stopPropagation()}
        className="sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenLine className="size-5 text-primary" />
            <span>Ký chữ ký điện tử</span>
          </DialogTitle>
          <DialogDescription>
            Dùng chuột hoặc ngón tay để vẽ chữ ký của bạn vào khung bên dưới
          </DialogDescription>
        </DialogHeader>

        {/* Khung vẽ Canvas */}
        <div className="
          relative my-2 h-56 w-full rounded-lg border-2 border-dashed 
          border-border bg-muted/30 overflow-hidden cursor-crosshair"
        >
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="block h-full w-full touch-none"
          />
          {!hasDrawn && (
            <div
              className="pointer-events-none absolute inset-0 flex flex-col 
              items-center justify-center text-sm text-muted-foreground select-none"
            >
              <span>Vẽ chữ ký của bạn tại đây</span>
              <div className="w-1/2 border-b border-dashed border-border mt-2" />
            </div>
          )}
        </div>

        {/* Thanh tác vụ chân Modal */}
        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
          >
            <Eraser className="size-3.5" />
            <span>Xóa chữ ký</span>
          </Button>

          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" size="sm">
                Hủy
              </Button>
            </DialogClose>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={!hasDrawn}
            >
              <Check className="size-3.5" />
              <span>Lưu chữ ký</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
