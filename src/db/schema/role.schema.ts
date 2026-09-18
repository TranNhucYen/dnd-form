import { mysqlTable, int, varchar, text, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';

export const role = mysqlTable('role', {
  id: int('id').autoincrement().primaryKey(),
  roleCode: mysqlEnum('role_code', ['super_admin', 'admin', 'user']).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});