export interface UserProfile {
  id: number
  name: string
  email: string
  avatarUrl?: string
  role?: string
  joinedAt: string
  formsCount: number
  contributionsCount: number
}

export interface UpdateProfileInput {
  name: string
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }
