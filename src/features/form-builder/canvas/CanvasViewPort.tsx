import { FormCanvas } from "./FormCanvas";
import { useFormBuilderStore } from "../store/useFormBuilderStore";

type CanvasViewPortProps = {
  onCollisionChange?: (isColliding: boolean) => void;
};

export function CanvasViewPort({ onCollisionChange }: CanvasViewPortProps) {
  const isReadOnly = useFormBuilderStore((state) => state.isReadOnly);
  return (
    <div className="flex h-full w-full min-w-0 flex-1 justify-center overflow-auto bg-neutral-100 p-10">
      <div className="relative self-start">
        <FormCanvas onCollisionChange={onCollisionChange} />
        {isReadOnly && (
          <div
            title="Chế độ chỉ xem"
            className="absolute inset-0 z-50 bg-transparent cursor-default"
          />
        )}
      </div>
    </div>
  );
}