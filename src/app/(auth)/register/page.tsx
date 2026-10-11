import type { Metadata } from "next"
import { RegisterForm } from "@/features/auth"

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản DragForm để thiết kế và chia sẻ biểu mẫu kéo thả trực quan.",
}

export default function RegisterPage() {
  return <RegisterForm />
}
