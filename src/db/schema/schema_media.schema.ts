import { mysqlTable, int, varchar, timestamp, mysqlEnum, mediumtext } from 'drizzle-orm/mysql-core';
import { schemaJson } from './schema_json.schema';

export const schemaMedia = mysqlTable('schema_media', {
  id: int('id').autoincrement().primaryKey(),
  schemaId: int('schema_id')
    .notNull()
    .references(() => schemaJson.id, { onDelete: 'cascade' }),

  mediaType: mysqlEnum('media_type', ['signature', 'image', 'document']).notNull(),

  signatureBase64: mediumtext('signature_base64'),
  fileKey: varchar('file_key', { length: 500 }),
  fileUrl: varchar('file_url', { length: 1000 }),
  fileName: varchar('file_name', { length: 255 }),
  mimeType: varchar('mime_type', { length: 100 }),
  fileSize: int('file_size'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
