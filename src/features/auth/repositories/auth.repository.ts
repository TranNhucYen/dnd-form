import { db } from "@/db";
import { role, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UserRole, UserStatus } from "@/shared/types/user.type";
import { AuthUser } from "../types/auth.type";

export interface UserWithPassword {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

export interface RegisterUserPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface IAuthRepository {
  getUserByEmail(email: string): Promise<UserWithPassword | null>;
  createUser(data: RegisterUserPayload): Promise<AuthUser>;
}

export const drizzleAuthRepository: IAuthRepository = {
  async getUserByEmail(email: string): Promise<UserWithPassword | null> {
    const [foundUser] = await db
      .select({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        password: user.password,
        role: role.roleCode,
        status: user.status,
      })
      .from(user)
      .innerJoin(role, eq(user.roleId, role.id))
      .where(eq(user.email, email.trim().toLowerCase()))
      .limit(1);

    if (!foundUser) return null;
    return {
      ...foundUser,
      role: foundUser.role as UserRole,
      status: foundUser.status as UserStatus,
    };
  },

  async createUser(data: RegisterUserPayload): Promise<AuthUser> {
    // Kiểm tra role có thật đã tồn tại trong hệ thống chưa
    const [foundRole] = await db
      .select({ roleId: role.id })
      .from(role)
      .where(eq(role.roleCode, UserRole.USER))
      .limit(1);

    if (!foundRole) {
      throw new Error('Role không tồn tại');
    }

    const [result] = await db.insert(user).values({
      fullName: data.fullName,
      email: data.email.trim().toLowerCase(),
      password: data.password,
      roleId: foundRole.roleId,
      status: UserStatus.ACTIVE,
    });

    return {
      id: result.insertId,
      fullName: data.fullName,
      email: data.email.trim().toLowerCase(),
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    };
  },
};