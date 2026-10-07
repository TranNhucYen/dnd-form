import { mysqlTable, int, varchar, text, timestamp } from 'drizzle-orm/mysql-core';
import { user } from './user.schema';
import { template } from './template.schema';
import { schemaJson } from './schema_json.schema';

export const form = mysqlTable('form', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),

  ownerId: int('owner_id')
    .notNull()
    .references(() => user.id),

  description: text('description'),

  sourceTemplateId: int('source_template_id')
    .references(() => template.id),

  schemaId: int('schema_id')
    .notNull()
    .references(() => schemaJson.id),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
