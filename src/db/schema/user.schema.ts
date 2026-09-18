import { mysqlTable, int, varchar, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { role } from './role.schema';

export const user = mysqlTable('user', {
  id: int('id').autoincrement().primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  roleId: int('role_id')
    .notNull()
    .references(() => role.id),
  status: mysqlEnum('status', ['active', 'blocked']).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
