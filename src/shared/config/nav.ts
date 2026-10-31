import {
  Home,
  LayoutTemplate,
  FileEdit,
  Globe,
  Bell,
  Settings,
  User,
  FileText,
  Users,
  BarChart3,
  type LucideIcon,
} from "lucide-react"
import { ROUTES } from "@/shared/constants/routes"

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
}

export const mainNavItems: NavItem[] = [
  {
    title: "Trang chủ",
    url: ROUTES.HOME,
    icon: Home,
  },
  {
    title: "Biểu mẫu của tôi",
    url: ROUTES.MY_FORM,
    icon: FileText,
  },
  {
    title: "Thống kê thu thập",
    url: ROUTES.COLLECTION_STATS,
    icon: BarChart3,
  },
  {
    title: "Chia sẻ với tôi",
    url: ROUTES.SHARED_WITH_ME,
    icon: Users,
  },
  {
    title: "Trình thiết kế",
    url: ROUTES.EDITOR,
    icon: FileEdit,
  },
  {
    title: "Form mẫu",
    url: ROUTES.TEMPLATES,
    icon: LayoutTemplate,
  },
  {
    title: "Kho cộng đồng",
    url: ROUTES.COMMUNITY,
    icon: Globe,
  },
]

export const personalNavItems: NavItem[] = [
  {
    title: "Thông báo",
    url: ROUTES.NOTIFICATIONS,
    icon: Bell,
  },
  {
    title: "Cài đặt",
    url: ROUTES.SETTINGS,
    icon: Settings,
  },
  {
    title: "Tài khoản",
    url: ROUTES.ACCOUNT,
    icon: User,
  },
]
