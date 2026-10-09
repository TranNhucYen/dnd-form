import type { Metadata } from "next"
import HomePage from "./home/page"

export const metadata: Metadata = {
  title: "Trang chủ",
}

export default function Page() {
  return (
    <HomePage />
  )
}
