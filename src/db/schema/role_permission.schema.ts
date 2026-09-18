import { int, mysqlTable, timestamp, unique } from 'drizzle-orm/mysql-core';
import { role } from './role.schema';
import { permission } from './permission.schema';

export const rolePermission = mysqlTable(
  'role_permission',
  {
    id: int('id').autoincrement().primaryKey(),
    roleId: int('role_id')
      .notNull()
      .references(() => role.id),
    permissionId: int('permission_id')
      .notNull()
      .references(() => permission.id),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    unique('role_permission_role_id_permission_id_unique').on(
      table.roleId,
      table.permissionId
    ),
  ]
);