import { mysqlTable, int, varchar, json, timestamp } from 'drizzle-orm/mysql-core';
import { form } from './form.schema';

export const formSubmission = mysqlTable('form_submission', {
  id: int('id').autoincrement().primaryKey(),

  formId: int('form_id')
    .notNull()
    .references(() => form.id, { onDelete: 'cascade' }),

  token: varchar('token', { length: 255 }).notNull(),

  submittedData: json('submitted_data').notNull(),

  filledSchema: json('filled_schema').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
