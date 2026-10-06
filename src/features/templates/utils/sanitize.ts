import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types';

export function sanitizeSignatureFromSchema(schema?: FormSchemaJson | null): FormSchemaJson | null {
  if (!schema?.pages) return null;

  const cloned = structuredClone(schema);
  for (const page of cloned.pages) {
    if (Array.isArray(page.fields)) {
      for (const field of page.fields) {
        if (field.type === 'signature' && field.data) {
          (field.data as { value?: string }).value = '';
        }
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
