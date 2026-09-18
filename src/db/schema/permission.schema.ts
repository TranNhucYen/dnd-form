import { mysqlTable, int, varchar, text, timestamp } from 'drizzle-orm/mysql-core';

export const permission = mysqlTable('permission', {
  id: int('id').autoincrement().primaryKey(),
  permissionCode: varchar('permission_code', { length: 255 }).notNull().unique(),
  description: text('description'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});