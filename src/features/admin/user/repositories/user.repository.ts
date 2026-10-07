import { db } from '@/db'
import { User, CreateUserInput, UserRole, UserStatus } from '../types/user.type'
import { role, user } from '@/db/schema'
import { eq } from 'drizzle-orm'

export interface IUserRepository {
  getUsers(): Promise<User[]>
  getUserById(id: number): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  updateUserStatus(id: number, status: UserStatus): Promise<User | null>
  createUser(input: CreateUserInput): Promise<User>
}

export const drizzleUserRepository: IUserRepository = {
  async getUsers(): Promise<User[]> {
    const rows = await db
      .select({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: role.roleCode,
        status: user.status,
        createdAt: user.createdAt,
      })
      .from(user)
      .innerJoin(role, eq(user.roleId, role.id))

    return rows.map((r) => ({
      ...r,
      role: r.role as UserRole,
      status: r.status as UserStatus,
      createdAt: r.createdAt.toISOString(),
    }))
  },

  async getUserById(id: number): Promise<User | null> {
    const [foundUser] = await db
      .select({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: role.roleCode,
        status: user.status,
        createdAt: user.createdAt,
      })
      .from(user)
      .innerJoin(role, eq(user.roleId, role.id))
      .where(eq(user.id, id))

    if (!foundUser) return null

    return {
      ...foundUser,
      role: foundUser.role as UserRole,
      status: foundUser.status as UserStatus,
      createdAt: foundUser.createdAt.toISOString(),
    }
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const [foundUser] = await db
      .select({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: role.roleCode,
        status: user.status,
        createdAt: user.createdAt,
      })
      .from(user)
      .innerJoin(role, eq(user.roleId, role.id))
      .where(eq(user.email, email.trim().toLowerCase()))

    if (!foundUser) return null

    return {
      ...foundUser,
      role: foundUser.role as UserRole,
      status: foundUser.status as UserStatus,
      createdAt: foundUser.createdAt.toISOString(),
    }
  },

  async updateUserStatus(id: number, status: UserStatus): Promise<User | null> {
    await db.update(user).set({ status }).where(eq(user.id, id))
    return this.getUserById(id)
  },

  async createUser(input: CreateUserInput): Promise<User> {
    const [foundRole] = await db
      .select({ roleId: role.id })
      .from(role)
      .where(eq(role.roleCode, input.role))
      .limit(1)

    const roleId = foundRole?.roleId ?? 3

    const [result] = await db.insert(user).values({
      fullName: input.fullName,
      email: input.email.trim().toLowerCase(),
      roleId,
      status: input.status,
      password: input.password!,
    })

    const createdUser = await this.getUserById(result.insertId)
    return createdUser!
  },
}

export type IUserManagerRepository = IUserRepository
