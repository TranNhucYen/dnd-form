"use client";

import { useEffect, useRef, useState } from "react";
import type { SignatureFieldData, FieldStyle } from "@/features/form-builder/types/formBuilder.types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

interface EFormSignatureFieldProps {
  data: SignatureFieldData;
  style?: FieldStyle;
  onChange?: (value: string | undefined) => void;
}

export function EFormSignatureField({ data, style, onChange }: EFormSignatureFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  // Lưu các nét vẽ theo toạ độ chuẩn hoá (0..1) để vẽ lại vừa khít khi đổi kích thước canvas
  const strokesRef = useRef<Array<Array<{ x: number; y: number }>>>([]);
  const [hasDrawn, setHasDrawn] = useState(false);

  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.5 * (window.devicePixelRatio || 1);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const stroke of strokesRef.current) {
      ctx.beginPath();
      stroke.forEach((p, i) => {
        const x = p.x * canvas.width;
        const y = p.y * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      if (stroke.length === 1) {
        ctx.lineTo(stroke[0].x * canvas.width, stroke[0].y * canvas.height);
      }
      ctx.stroke();
    }
  };

  // Đồng bộ kích thước bitmap với kích thước hiển thị rồi vẽ lại toàn bộ nét (không bị cắt khi đổi màn hình)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const syncSize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      redraw();
    };

    syncSize();
    const observer = new ResizeObserver(syncSize);
    observer.observe(canvas);
    return () => observer.disconnect();
     
  }, []);

  // Toạ độ chuẩn hoá (0..1) theo kích thước hiển thị của canvas
  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    strokesRef.current.push([getPos(e)]);
    redraw();
    setHasDrawn(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const stroke = strokesRef.current[strokesRef.current.length - 1];
    if (!stroke) return;
    stroke.push(getPos(e));
    redraw();
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas && strokesRef.current.length > 0) {
      onChange?.(canvas.toDataURL("image/png"));
    }
  };

  const handleClear = () => {
    strokesRef.current = [];
    redraw();
    setHasDrawn(false);
    onChange?.(undefined);
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex h-6 items-center justify-between">
        <Label
          style={{
            color: style?.parts?.label?.color || style?.color,
            fontSize: style?.parts?.label?.fontSize,
            fontWeight: style?.parts?.label?.fontWeight,
          }}
          className="text-xs md:text-sm font-medium text-neutral-700"
        >
          {data.label || "Chữ ký"}
        </Label>
        {hasDrawn && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 gap-1 px-2 text-xs"
          >
            <Eraser className="size-3" />
            <span>Xóa</span>
          </Button>
        )}
      </div>

      {/* Ký trực tiếp trên khung, không cần mở modal */}
      <div className="relative h-44 w-full overflow-hidden rounded-md border border-dashed border-neutral-300 bg-white">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="block h-full w-full cursor-crosshair touch-none"
        />
        {!hasDrawn && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-neutral-400 select-none">
            Ký tên tại đây
          </span>
        )}
      </div>

      {data.signerName && (
        <span className="text-center text-xs font-semibold text-neutral-700">
          {data.signerName}
        </span>
      )}
    </div>
  );
}
