import { db } from "@/db";
import { role, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface UserWithPassword {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role: string;
  status: 'active' | 'blocked';
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
    return foundUser as UserWithPassword;
  },
};