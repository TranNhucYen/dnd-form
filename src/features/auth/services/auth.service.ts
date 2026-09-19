import bcrypt from "bcrypt";
import { authRepository } from "../repositories";
import { AuthUser, UserLogin, UserRegister } from "../types/auth.type";
import { UserRole, UserStatus } from "@/shared/types/user.type";
import { loginValidation, registerValidation } from "../validation/auth.validation";

export const authService = {
  async login(userInfo: UserLogin): Promise<AuthUser> {
    const parsed = loginValidation.safeParse(userInfo);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0].message);
    }

    const { email, password } = parsed.data;

    const foundUser = await authRepository.getUserByEmail(email.toLowerCase());
    if (!foundUser) {
      throw new Error("Email hoặc mật khẩu không chính xác");
    }

    if (foundUser.status === UserStatus.BLOCKED) {
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

  async register(userInfo: UserRegister): Promise<AuthUser> {
    const parsed = registerValidation.safeParse(userInfo);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0].message);
    }

    const { fullName, email, password } = parsed.data;
    
    const existingUser = await authRepository.getUserByEmail(email.toLowerCase());
    if (existingUser) {
      throw new Error("Email này đã tồn tại");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await authRepository.createUser({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    if (!createdUser) {
      throw new Error("Đăng ký tài khoản thất bại");
    }

    return createdUser;
  },
};