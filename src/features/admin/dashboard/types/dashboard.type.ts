export interface AdminDashboardStats {
  totalUsers: number
  totalTemplates: number
  totalCategories: number
  totalDownloads: number
}

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }
