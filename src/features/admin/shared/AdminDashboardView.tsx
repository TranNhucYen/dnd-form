'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Users, LayoutDashboard, LayoutTemplate, Download, ChartBarStacked } from 'lucide-react'
import { mockAdminUsers } from '../user'
import { mockAdminTemplates } from '../template'
import { mockCategories } from '../category'

export function AdminDashboardView() {
  const totalUsers = mockAdminUsers.length
  const totalTemplates = mockAdminTemplates.length
  const totalCategories = mockCategories.length
  const totalDownloads = '4,508'

  return (
    <div className="w-full h-full flex flex-col gap-5 overflow-y-auto">
      {/* Header */}
      <div
        className="
          flex flex-col sm:flex-row items-start sm:items-center
          justify-between gap-3 border-b pb-4"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <LayoutDashboard className="size-4" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Bảng điều khiển và theo dõi chỉ số toàn hệ thống
          </p>
        </div>
      </div>

      {/* Danh sách các chỉ số thống kê (Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border/80 shadow-xs bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-xs font-medium">
              Tổng số người dùng
            </CardDescription>
            <div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <CardTitle className="text-2xl font-bold text-foreground">
              {totalUsers}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Tài khoản đang được quản lý trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-xs font-medium">
              Tổng số form mẫu
            </CardDescription>
            <div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <LayoutTemplate className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <CardTitle className="text-2xl font-bold text-foreground">
              {totalTemplates}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Biểu mẫu mẫu trong thư viện hệ thống
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-xs font-medium">
              Tổng loại biểu mẫu
            </CardDescription>
            <div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <ChartBarStacked className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <CardTitle className="text-2xl font-bold text-foreground">
              {totalCategories}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Danh mục loại biểu mẫu trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-xs font-medium">
              Tổng lượt tải
            </CardDescription>
            <div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Download className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <CardTitle className="text-2xl font-bold text-foreground">
              {totalDownloads}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Lượt tải các biểu mẫu trong hệ thống
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
