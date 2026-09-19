export interface UserLogin {
  email: string
  password: string
}

export interface UserRegister extends UserLogin {
  fullName: string
}

export interface AuthUser {
  id: number
  fullName: string
  email: string
  role: string
  status: 'active' | 'blocked'
}

export interface ActionResponse<T> {
  success: boolean
  data?: T
  error?: string
}
