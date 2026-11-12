export const PERMISSIONS = {
  user: {
    create: 'user.create',
    read: 'user.read',
    update: 'user.update',
    delete: 'user.delete',
  },
  template: {
    create: 'template.create',
    read: 'template.read',
    update: 'template.update',
    delete: 'template.delete',
  },
  category: {
    create: 'category.create',
    read: 'category.read',
    update: 'category.update',
    delete: 'category.delete',
  },
  dashboard: {
    read: 'dashboard.read',
  },
  form: {
    submit: 'form.submit',
  },
} as const

export type PermissionCode =
  | (typeof PERMISSIONS.user)[keyof typeof PERMISSIONS.user]
  | (typeof PERMISSIONS.template)[keyof typeof PERMISSIONS.template]
  | (typeof PERMISSIONS.category)[keyof typeof PERMISSIONS.category]
  | (typeof PERMISSIONS.dashboard)[keyof typeof PERMISSIONS.dashboard]
  | (typeof PERMISSIONS.form)[keyof typeof PERMISSIONS.form]

export const ROLE_PERMISSION_CODES = {
  super_admin: [
    ...Object.values(PERMISSIONS.user),
    ...Object.values(PERMISSIONS.template),
    ...Object.values(PERMISSIONS.category),
    PERMISSIONS.dashboard.read,
  ],
  admin: [
    ...Object.values(PERMISSIONS.template),
    ...Object.values(PERMISSIONS.category),
    PERMISSIONS.dashboard.read,
  ],
  user: [PERMISSIONS.form.submit],
} as const

export const ADMIN_ENTRY_PERMISSIONS: readonly PermissionCode[] = [
  PERMISSIONS.dashboard.read,
  PERMISSIONS.template.read,
  PERMISSIONS.category.read,
  PERMISSIONS.user.read,
]
