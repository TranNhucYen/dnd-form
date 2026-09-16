'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Users, LayoutDashboard } from 'lucide-react'
import { mockAdminUsers } from '../user'

export function AdminDashboardView() {
  const totalUsers = mockAdminUsers.length

  return (
    <div className="w-full flex flex-col gap-5">
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

      {/* Single User Metric Card */}
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
      </div>
    </div>
  )
}
