import { db } from '@/db'
import { User, CreateUserInput, UserRole, UserStatus, UserPaginationParams } from '../types/user.type'
import { PaginatedResult } from '@/shared/types/pagination.type'
import { role, user } from '@/db/schema'
import { eq, or, like, count, desc } from 'drizzle-orm'

export async function getUserCount(search: string = ''): Promise<number> {
  let whereClause = undefined
  if (search) {
    whereClause = or(
      like(user.fullName, `%${search}%`),
      like(user.email, `%${search}%`)
    )
  }

  const subquery = db
    .select({ id: user.id })
    .from(user)
    .innerJoin(role, eq(user.roleId, role.id))
    .where(whereClause)
    .limit(10000)
    .as('subquery')

  const [countRes] = await db
    .select({ count: count() })
    .from(subquery)

  return countRes?.count ?? 0
}

export interface IUserRepository {
  getUsers(params?: UserPaginationParams): Promise<PaginatedResult<User>>
  getUserById(id: number): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  updateUserStatus(id: number, status: UserStatus): Promise<User | null>
  createUser(input: CreateUserInput): Promise<User>
}

export const drizzleUserRepository: IUserRepository = {
  async getUsers(params?: UserPaginationParams): Promise<PaginatedResult<User>> {
    const page = Math.max(1, Number(params?.page) || 1)
    const pageSize = Math.min(100, Math.max(1, Number(params?.pageSize) || 8))
    const offset = (page - 1) * pageSize
    const search = params?.search?.trim() || ''

    let whereClause = undefined
    if (search) {
      whereClause = or(
        like(user.fullName, `%${search}%`),
        like(user.email, `%${search}%`)
      )
    }

    const [rows, totalItems] = await Promise.all([
      db
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
        .where(whereClause)
        .orderBy(desc(user.createdAt))
        .limit(pageSize)
        .offset(offset),
      getUserCount(search),
    ])
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

    return {
      items: rows.map((r) => ({
        ...r,
        role: r.role as UserRole,
        status: r.status as UserStatus,
        createdAt: r.createdAt.toISOString(),
      })),
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
    }
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
