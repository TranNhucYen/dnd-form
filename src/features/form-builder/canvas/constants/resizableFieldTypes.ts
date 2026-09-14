import { FIELD_DEFINITIONS } from "../../constants/fields.config";
import type { FieldType } from "../../types/formBuilder.types";

export const RESIZABLE_FIELD_TYPES: FieldType[] = FIELD_DEFINITIONS
  .filter((field) => field.resizeMode !== "none")
  .map((field) => field.type);

export const HORIZONTAL_RESIZE_TYPES: FieldType[] = FIELD_DEFINITIONS
  .filter((field) => field.resizeMode === "horizontal")
  .map((field) => field.type);
