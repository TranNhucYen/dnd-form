export type SchemaMediaType = 'signature' | 'image' | 'document'

/** Bản ghi liên kết với schema biểu mẫu */
export interface SchemaMediaItem {
  id?: number
  mediaType: SchemaMediaType
  fileKey?: string | null
  fileUrl?: string | null
  signatureBase64?: string | null
  fileName?: string | null
  mimeType?: string | null
  fileSize?: number | null
}
