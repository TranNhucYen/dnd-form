import { toInternalUnit, toScreenPx } from "../../domain/units";
import { useFormBuilderStore } from "../../store/useFormBuilderStore";

type MarginCornerMarksProps = {
  canvasWidth: number;
  canvasHeight: number;
};

const MARK_LENGTH = 12; // Chiều dài mỗi đoạn thẳng của góc vuông (px)

/**
 * MarginCornerMarks: Hiển thị 4 góc vuông (mỗi góc tạo từ 2 đoạn thẳng nhỏ)
 * đại diện cho ranh giới 4 lề trang in theo chuẩn phong cách Microsoft Word / Print Crop Marks.
 */
export function MarginCornerMarks({
  canvasWidth,
  canvasHeight,
}: MarginCornerMarksProps) {
  const margins = useFormBuilderStore((state) => state.margins);

  const topMm = Number.parseFloat(margins.top) || 0;
  const bottomMm = Number.parseFloat(margins.bottom) || 0;
  const leftMm = Number.parseFloat(margins.left) || 0;
  const rightMm = Number.parseFloat(margins.right) || 0;

  const topPx = toScreenPx(toInternalUnit(topMm));
  const bottomPx = toScreenPx(toInternalUnit(bottomMm));
  const leftPx = toScreenPx(toInternalUnit(leftMm));
  const rightPx = toScreenPx(toInternalUnit(rightMm));

  const xLeft = leftPx;
  const xRight = Math.max(0, canvasWidth - rightPx);
  const yTop = topPx;
  const yBottom = Math.max(0, canvasHeight - bottomPx);

  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full select-none"
      width={canvasWidth}
      height={canvasHeight}
    >
      {/* 1. Góc vuông Trên - Trái (Top-Left) */}
      <path
        d={`M ${Math.max(0, xLeft - MARK_LENGTH)} ${yTop} L ${xLeft} ${yTop} L ${xLeft} ${Math.max(0, yTop - MARK_LENGTH)}`}
        fill="none"
        strokeWidth="1"
        className="stroke-neutral-400/90 dark:stroke-neutral-500"
      />

      {/* 2. Góc vuông Trên - Phải (Top-Right) */}
      <path
        d={`M ${Math.min(canvasWidth, xRight + MARK_LENGTH)} ${yTop} L ${xRight} ${yTop} L ${xRight} ${Math.max(0, yTop - MARK_LENGTH)}`}
        fill="none"
        strokeWidth="1"
        className="stroke-neutral-400/90 dark:stroke-neutral-500"
      />

      {/* 3. Góc vuông Dưới - Trái (Bottom-Left) */}
      <path
        d={`M ${Math.max(0, xLeft - MARK_LENGTH)} ${yBottom} L ${xLeft} ${yBottom} L ${xLeft} ${Math.min(canvasHeight, yBottom + MARK_LENGTH)}`}
        fill="none"
        strokeWidth="1"
        className="stroke-neutral-400/90 dark:stroke-neutral-500"
      />

      {/* 4. Góc vuông Dưới - Phải (Bottom-Right) */}
      <path
        d={`M ${Math.min(canvasWidth, xRight + MARK_LENGTH)} ${yBottom} L ${xRight} ${yBottom} L ${xRight} ${Math.min(canvasHeight, yBottom + MARK_LENGTH)}`}
        fill="none"
        strokeWidth="1"
        className="stroke-neutral-400/90 dark:stroke-neutral-500"
      />
    </svg>
  );
}
