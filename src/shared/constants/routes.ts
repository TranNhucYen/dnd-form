export const ROUTES = {
  // Auth Routes
  LOGIN: "/login",
  REGISTER: "/register",

  // Dashboard / App Routes
  HOME: "/home",
  MY_FORM: "/my-form",
  EDITOR: "/editor",
  TEMPLATES: "/templates",
  COMMUNITY: "/community",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
  ACCOUNT: "/account",

  // Admin Routes
  ADMIN_DASHBOARD: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_TEMPLATES: "/admin/templates",
} as const

export const DYNAMIC_ROUTES = {
  FORM_EDIT: (id: string | number) => `/editor/${id}`,
  FORM_DETAIL: (id: string | number) => `/my-form/${id}`,
  TEMPLATE_DETAIL: (id: string | number) => `/templates/${id}`,
} as const

export type AppRoutes = typeof ROUTES[keyof typeof ROUTES]

