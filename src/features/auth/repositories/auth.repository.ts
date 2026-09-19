import { db } from "@/db";
import { role, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UserRole, UserStatus } from "@/shared/types/user.type";

export interface UserWithPassword {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

export interface IAuthRepository {
  getUserByEmail(email: string): Promise<UserWithPassword | null>;
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
      .where(eq(user.email, email))
      .limit(1);

    if (!foundUser) return null;
    return {
      ...foundUser,
      role: foundUser.role as UserRole,
      status: foundUser.status as UserStatus,
    };
  },
};