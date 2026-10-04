import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types';

export function sanitizeSignatureFromSchema(schema?: FormSchemaJson | null): FormSchemaJson | null {
  if (!schema) return null;

  const cloned = structuredClone(schema);
  if (Array.isArray(cloned.fields)) {
    for (const field of cloned.fields) {
      if (field.type === 'signature' && field.data) {
        (field.data as { value?: string }).value = '';
      }
    }
  }
  return cloned;
}

/**
 * Lọc bỏ chữ kí
 */
export function filterTemplateMedia<T extends { mediaType: string }>(mediaList: T[]): T[] {
  return mediaList.filter((m) => m.mediaType !== 'signature');
}
