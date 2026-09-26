import { db } from '@/db'
import { user, form, template } from '@/db/schema'
import { eq, count } from 'drizzle-orm'
import { UserProfile, UpdateProfileInput } from '../types/account.type'

export interface IAccountRepository {
  getProfile(userId: number): Promise<UserProfile | null>
  updateProfile(userId: number, input: UpdateProfileInput): Promise<boolean>
  getUserPassword(userId: number): Promise<string | null>
  updatePassword(userId: number, hashedPassword: string): Promise<boolean>
}

export const drizzleAccountRepository: IAccountRepository = {
  async getProfile(userId: number): Promise<UserProfile | null> {
    const [foundUser] = await db
      .select({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, userId))

    if (!foundUser) return null

    const [formsRes, contributionsRes] = await Promise.all([
      db.select({ count: count() }).from(form).where(eq(form.ownerId, userId)),
      db.select({ count: count() }).from(template).where(eq(template.createdById, userId)),
    ])

    const createdDate = new Date(foundUser.createdAt)
    const joinedAt = createdDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

    return {
      id: foundUser.id,
      name: foundUser.fullName,
      email: foundUser.email,
      joinedAt,
      formsCount: formsRes[0]?.count ?? 0,
      contributionsCount: contributionsRes[0]?.count ?? 0,
    }
  },

  async updateProfile(userId: number, input: UpdateProfileInput): Promise<boolean> {
    const [result] = await db
      .update(user)
      .set({ fullName: input.name.trim() })
      .where(eq(user.id, userId))

    return result.affectedRows > 0
  },

  async getUserPassword(userId: number): Promise<string | null> {
    const [found] = await db
      .select({ password: user.password })
      .from(user)
      .where(eq(user.id, userId))

    return found?.password ?? null
  },

  async updatePassword(userId: number, hashedPassword: string): Promise<boolean> {
    const [result] = await db
      .update(user)
      .set({ password: hashedPassword })
      .where(eq(user.id, userId))

    return result.affectedRows > 0
  },
}
