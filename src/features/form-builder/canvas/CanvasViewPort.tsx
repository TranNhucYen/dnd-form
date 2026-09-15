import { FormCanvas } from "./FormCanvas";

type CanvasViewPortProps = {
  onCollisionChange?: (isColliding: boolean) => void;
};

export function CanvasViewPort({ onCollisionChange }: CanvasViewPortProps) {
  return (
    <div className="flex h-full w-full min-w-0 flex-1 justify-center overflow-auto bg-neutral-100 p-10">
      <FormCanvas onCollisionChange={onCollisionChange} />
    </div>
  );
}