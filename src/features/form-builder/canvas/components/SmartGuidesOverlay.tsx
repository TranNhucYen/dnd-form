import type { AlignmentGuide } from "../utils/snap.utils";

type SmartGuidesOverlayProps = {
  guides: AlignmentGuide[];
};

/**
 * SmartGuidesOverlay: Hiển thị các đường gióng thông minh (đường ngang và dọc)
 */
export function SmartGuidesOverlay({ guides }: SmartGuidesOverlayProps) {
  if (guides.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {guides.map((guide, index) => {
        if (guide.type === "vertical") {
          return (
            <div
              key={`v-${index}-${guide.position}`}
              className="absolute top-0 bottom-0 border-l border-green-500"
              style={{ left: `${guide.position}px` }}
            />
          );
        }

        return (
          <div
            key={`h-${index}-${guide.position}`}
            className="absolute left-0 right-0 border-t border-green-500"
            style={{ top: `${guide.position}px` }}
          />
        );
      })}
    </div>
  );
}
