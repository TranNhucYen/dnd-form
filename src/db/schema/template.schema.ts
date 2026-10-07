import { mysqlTable, int, varchar, text, json, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { user } from './user.schema';
import { templateCategory } from './template_category.schema';
import { schemaJson } from './schema_json.schema';

export const template = mysqlTable('template', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),

  createdById: int('created_by_id')
    .notNull()
    .references(() => user.id),
  approvedById: int('approved_by_id')
    .references(() => user.id),

  rejectionReason: varchar('rejection_reason', { length: 255 }),

  categoryId: int('category_id')
    .notNull()
    .references(() => templateCategory.id),

  pricingType: mysqlEnum('pricing_type', ['free', 'paid']).notNull(),

  description: text('description'),
  guideline: json('guideline'),

  reviewStatus: mysqlEnum('review_status', ['pending', 'approved', 'rejected'])
    .default('pending')
    .notNull(),

  status: mysqlEnum('status', ['active', 'blocked']),

  downloads: int('downloads').default(0).notNull(),

  schemaId: int('schema_id')
    .notNull()
    .references(() => schemaJson.id),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
