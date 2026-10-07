import 'server-only';
import type {
  FormSchemaJson,
  ImageFieldData,
} from '@/features/form-builder/types/formBuilder.types';
import { getStorageService } from '@/lib/storage';

/** Tạo URL đầy đủ hiển thị từ fileKey(tên file) cho các field ảnh trong schema */
export function hydrateImageUrls(schema?: FormSchemaJson | null): void {
  if (!schema?.pages) return;
  const storage = getStorageService();

  for (const page of schema.pages) {
    if (!page.fields) continue;
    for (const field of page.fields) {
      if (field.type !== 'image') continue;
      const imageData = field.data as ImageFieldData | undefined;
      if (imageData?.key) {
        imageData.value = storage.getUrl(imageData.key);
      }
    }
  }
}
