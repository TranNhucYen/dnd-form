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
  titleKey: string
  url: string
  icon: LucideIcon
}

export const mainNavItems: NavItem[] = [
  {
    titleKey: "nav.home",
    url: ROUTES.HOME,
    icon: Home,
  },
  {
    titleKey: "nav.myForms",
    url: ROUTES.MY_FORM,
    icon: FileText,
  },
  {
    titleKey: "nav.collectionStats",
    url: ROUTES.COLLECTION_STATS,
    icon: BarChart3,
  },
  {
    titleKey: "nav.sharedWithMe",
    url: ROUTES.SHARED_WITH_ME,
    icon: Users,
  },
  {
    titleKey: "nav.editor",
    url: ROUTES.EDITOR,
    icon: FileEdit,
  },
  {
    titleKey: "nav.templates",
    url: ROUTES.TEMPLATES,
    icon: LayoutTemplate,
  },
  {
    titleKey: "nav.community",
    url: ROUTES.COMMUNITY,
    icon: Globe,
  },
]

export const personalNavItems: NavItem[] = [
  {
    titleKey: "nav.notifications",
    url: ROUTES.NOTIFICATIONS,
    icon: Bell,
  },
  {
    titleKey: "nav.settings",
    url: ROUTES.SETTINGS,
    icon: Settings,
  },
  {
    titleKey: "nav.account",
    url: ROUTES.ACCOUNT,
    icon: User,
  },
]
