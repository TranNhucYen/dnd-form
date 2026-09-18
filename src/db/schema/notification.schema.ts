import { mysqlTable, int, varchar, text, timestamp, mysqlEnum, json } from 'drizzle-orm/mysql-core';
import { user } from './user.schema';

export const notification = mysqlTable('notification', {
  id: int('id').autoincrement().primaryKey(),

  userId: int('user_id')
    .notNull()
    .references(() => user.id),

  actorId: int('actor_id')
    .references(() => user.id),

  type: mysqlEnum('type', [
    'form_shared',
    'community_review',
    'system_update',
  ]).notNull(),

  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),

  actionUrl: varchar('action_url', { length: 500 }),
  metadata: json('metadata'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
