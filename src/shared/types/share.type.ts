export enum ShareRole {
  VIEW = 'view',
  EDIT = 'edit',
}

export type FormAccessPermission = 'owner' | 'edit' | 'view'

/** Thông tin người dùng được chia sẻ biểu mẫu */
export interface SharedUser {
  id: string
  email: string
  role: ShareRole
  addedAt: Date | string
}

export type SharedUserItem = SharedUser
