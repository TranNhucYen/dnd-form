import { FormCanvas } from "./FormCanvas";
import { VerticalPageSelector } from "../page-tab/VerticalPageSelector";
import { useFormBuilderStore } from "../store/useFormBuilderStore";

type CanvasViewPortProps = {
  onCollisionChange?: (isColliding: boolean) => void;
};

export function CanvasViewPort({ onCollisionChange }: CanvasViewPortProps) {
  const isReadOnly = useFormBuilderStore((state) => state.isReadOnly);
  return (
    <div className="flex h-full w-full min-w-0 flex-1 justify-center overflow-auto bg-neutral-100 p-10">
      <div className="relative self-start flex items-start gap-4">
        <div className="relative">
          <FormCanvas onCollisionChange={onCollisionChange} />
          {isReadOnly && (
            <div
              title="Chế độ chỉ xem"
              className="absolute inset-0 z-50 bg-transparent cursor-default"
            />
          )}
        </div>

        {/* Thanh chọn trang dạng hình vuông, fixed ở giữa chừng bên phải phía dưới của trang giấy */}
        <VerticalPageSelector className="sticky top-[55%] -translate-y-1/2" />
      </div>
    </div>
  );
}