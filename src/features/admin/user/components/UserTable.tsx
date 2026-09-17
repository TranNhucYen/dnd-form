'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { Users, Search, ShieldAlert, Shield, User as UserIcon, UserPlus } from 'lucide-react'
import { AdminUser, UserRole, UserStatus } from '../types/user.type'
import { useUser } from '../hooks/useUser'
import { ChangeStatusModal } from './ChangeStatusModal'
import { AddUserModal } from './AddUserModal'

export function UserTable() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    user: AdminUser
    newStatus: UserStatus
  } | null>(null)

  const {
    paginatedUsers,
    isLoading,
    searchQuery,
    setSearchQuery,
    handleStatusChange,
    addUser,
    refetch,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    totalItems,
  } = useUser()

  const renderRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return (
          <Badge
            variant="outline"
            className="
              text-xs font-semibold bg-purple-50 text-purple-700
              border-purple-200 dark:bg-purple-950/40 dark:text-purple-300
              gap-1 px-2 py-0.5"
          >
            <ShieldAlert className="size-3" />
            super Admin
          </Badge>
        )
      case UserRole.ADMIN:
        return (
          <Badge
            variant="outline"
            className="
              text-xs font-semibold bg-blue-50 text-blue-700
              border-blue-200 dark:bg-blue-950/40 dark:text-blue-300
              gap-1 px-2 py-0.5"
          >
            <Shield className="size-3" />
            admin
          </Badge>
        )
      case UserRole.USER:
        return (
          <Badge
            variant="secondary"
            className="text-xs font-medium gap-1 px-2 py-0.5"
          >
            <UserIcon className="size-3" />
            user
          </Badge>
        )
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col gap-3">
      {/* Header */}
      <div
        className="
          shrink-0 flex flex-col sm:flex-row items-start sm:items-center
          justify-between gap-3 border-b pb-3"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="size-4" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Quản lý người dùng</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Danh sách tài khoản, phân quyền và trạng thái hoạt động trong hệ thống
          </p>
        </div>

        {/* Search bar & Refresh */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, email, ID..."
              className="text-xs h-8 pl-8"
            />
          </div>
          <Button
            size="sm"
            onClick={() => setIsAddUserOpen(true)}
            className="text-xs h-8 gap-1.5 cursor-pointer"
          >
            <UserPlus className="size-3.5" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Users Table Card (Tự động chiếm trọn chiều cao còn lại) */}
      <Card className="flex-1 min-h-0 flex flex-col border-border/80 shadow-xs overflow-hidden">
        <CardContent className="flex-1 min-h-0 p-0 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow className="text-xs hover:bg-transparent">
                <TableHead className="h-11 px-4 w-28 font-bold text-foreground">ID</TableHead>
                <TableHead className="h-11 px-4 font-bold text-foreground">Họ và tên</TableHead>
                <TableHead className="h-11 px-4 font-bold text-foreground">Email</TableHead>
                <TableHead className="h-11 px-4 w-36 font-bold text-foreground">Vai trò</TableHead>
                <TableHead className="h-11 px-4 w-40 font-bold text-foreground">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-16 text-xs text-muted-foreground"
                  >
                    {isLoading
                      ? 'Đang tải danh sách người dùng...'
                      : 'Không tìm thấy người dùng nào phù hợp'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((item) => (
                  <TableRow key={item.id} className="text-xs hover:bg-muted/40 transition-colors">
                    <TableCell className="px-4 py-3.5 font-mono text-muted-foreground">
                      {item.id}
                    </TableCell>

                    <TableCell className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8 border border-primary/20">
                          <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                            {getInitials(item.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-foreground">
                          {item.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3.5 text-muted-foreground">
                      {item.email}
                    </TableCell>

                    <TableCell className="px-4 py-3.5">{renderRoleBadge(item.role)}</TableCell>

                    <TableCell className="px-4 py-3.5">
                      <Select
                        value={item.status}
                        onValueChange={(val: UserStatus) => {
                          if (val !== item.status) {
                            setPendingStatusChange({
                              user: item,
                              newStatus: val,
                            })
                          }
                        }}
                        disabled={item.role === UserRole.SUPER_ADMIN}
                      >
                        <SelectTrigger className="w-28 h-8 text-xs bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value={UserStatus.ACTIVE} className="text-xs">
                              <span className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-emerald-600 inline-block" />
                                active
                              </span>
                            </SelectItem>
                            <SelectItem value={UserStatus.BLOCKED} className="text-xs">
                              <span className="flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-rose-600 inline-block" />
                                blocked
                              </span>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div
          className="
            shrink-0 flex flex-col sm:flex-row items-center
            justify-between gap-3 pt-1 text-xs text-muted-foreground"
        >
          <span>
            Hiển thị{' '}
            <strong className="font-semibold text-foreground">
              {(currentPage - 1) * pageSize + 1}
            </strong>
            -
            <strong className="font-semibold text-foreground">
              {Math.min(currentPage * pageSize, totalItems)}
            </strong>{' '}
            trên tổng số{' '}
            <strong className="font-semibold text-foreground">
              {totalItems}
            </strong>{' '}
            người dùng
          </span>

          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className={cn(
                    'cursor-pointer text-xs h-8',
                    currentPage === 1 && 'pointer-events-none opacity-50'
                  )}
                  text="Trước"
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer text-xs size-8"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  className={cn(
                    'cursor-pointer text-xs h-8',
                    currentPage === totalPages && 'pointer-events-none opacity-50'
                  )}
                  text="Sau"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Thay đổi trạng thái tài khoản */}
      <ChangeStatusModal
        open={Boolean(pendingStatusChange)}
        onOpenChange={(open) => {
          if (!open) setPendingStatusChange(null)
        }}
        user={pendingStatusChange?.user ?? null}
        newStatus={pendingStatusChange?.newStatus ?? null}
        onConfirm={async (userId, newStatus) => {
          await handleStatusChange(userId, newStatus)
          setPendingStatusChange(null)
        }}
      />

      {/* Thêm user */}
      <AddUserModal
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onAddUser={async (input) => {
          await addUser(input)
        }}
      />
    </div>
  )
}

