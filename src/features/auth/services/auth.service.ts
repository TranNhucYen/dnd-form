import bcrypt from "bcrypt";
import { authRepository } from "../repositories";
import { AuthUser, UserLogin } from "../types/auth.type";

export const authService = {
  async login(userInfo: UserLogin): Promise<AuthUser> {
    const email = userInfo.email?.trim().toLowerCase();
    const password = userInfo.password;

    if (!email || !password) {
      throw new Error("Email và mật khẩu không được để trống");
    }

    const foundUser = await authRepository.getUserByEmail(email);
    if (!foundUser) {
      throw new Error("Email hoặc mật khẩu không chính xác");
    }

    if (foundUser.status === "blocked") {
      throw new Error("Tài khoản đã bị khóa");
    }

    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordMatch) {
      throw new Error("Email hoặc mật khẩu không chính xác");
    }

    return {
      id: foundUser.id,
      fullName: foundUser.fullName,
      email: foundUser.email,
      role: foundUser.role,
      status: foundUser.status,
    };
  },
};