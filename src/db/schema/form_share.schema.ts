import { mysqlTable, int, varchar, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { user } from './user.schema';
import { form } from './form.schema';

export const formShare = mysqlTable('form_share', {
  id: int('id').autoincrement().primaryKey(),

  userId: int('user_id')
    .references(() => user.id),
  formId: int('form_id')
    .notNull()
    .references(() => form.id),

  subjectType: mysqlEnum('subject_type', ['user', 'link']).notNull(),

  permission: mysqlEnum('permission', ['view', 'edit']).notNull(),

  token: varchar('token', { length: 255 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
