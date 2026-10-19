import type React from "react";
import type {
  FieldPartKey,
  FieldPartStyle,
  FieldStyle,
} from "../../types/formBuilder.types";

export interface PartStyleDefaults extends Partial<FieldPartStyle> {
  textAlign?: React.CSSProperties["textAlign"];
}

/**
 * getFieldPartStyle: Trích xuất CSSProperties cho một phần tử (part) bên trong field.
 */
export function getFieldPartStyle(
  style: FieldStyle | undefined,
  partKey: FieldPartKey,
  defaults?: PartStyleDefaults,
): React.CSSProperties {
  const part = style?.parts?.[partKey];

  return {
    fontWeight:
      part?.fontWeight ??
      style?.fontWeight ??
      defaults?.fontWeight,
    fontStyle:
      part?.fontStyle ??
      style?.fontStyle ??
      defaults?.fontStyle,
    textDecoration:
      part?.textDecoration ??
      style?.textDecoration ??
      defaults?.textDecoration,
    color:
      part?.color ??
      style?.color ??
      defaults?.color,
    fontSize:
      part?.fontSize ??
      (style?.fontSize ? `${style.fontSize}px` : undefined) ??
      defaults?.fontSize,
    fontFamily:
      part?.fontFamily ??
      style?.fontFamily ??
      defaults?.fontFamily,
    textAlign:
      defaults?.textAlign ??
      (style?.textAlign as React.CSSProperties["textAlign"]),
  };
}
