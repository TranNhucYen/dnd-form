import type { Metadata } from "next"
import { LoginForm } from "@/features/auth"

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập tài khoản DragForm để bắt đầu thiết kế biểu mẫu chuyên nghiệp.",
}

export default function LoginPage() {
  return <LoginForm />
}
