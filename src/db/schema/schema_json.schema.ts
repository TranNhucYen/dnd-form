import { mysqlTable, int, json, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';

export const schemaJson = mysqlTable('schema_json', {
  id: int('id').autoincrement().primaryKey(),
  schemaType: mysqlEnum('schema_type', ['template', 'form']).notNull(),
  content: json('content').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
