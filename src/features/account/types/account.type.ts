export interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: string
  joinedAt: string
}

export interface UpdateProfileInput {
  name: string
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

