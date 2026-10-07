'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
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
import { Users, Search, ShieldAlert, Shield, User as UserIcon, UserPlus } from 'lucide-react'
import { User, UserRole, UserStatus } from '../types/user.type'
import { useUser } from '../hooks/useUser'
import { ChangeStatusModal } from './ChangeStatusModal'
import { AddUserModal } from './AddUserModal'
import { AdminPageHeader, AdminPagination, AdminTableHeader } from '@/features/admin/shared'

export function UserTable() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    user: User
    newStatus: UserStatus
  } | null>(null)

  const {
    paginatedUsers,
    isLoading,
    searchQuery,
    setSearchQuery,
    handleStatusChange,
    addUser,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
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
      {/* Header trang dùng chung */}
      <AdminPageHeader
        title="Quản lý người dùng"
        description="Danh sách tài khoản, phân quyền và trạng thái hoạt động trong hệ thống"
        icon={<Users className="size-4" />}
      >
        <div className="relative flex-1 sm:w-64">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, email, ID..."
            className="text-xs h-9 pl-8"
          />
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddUserOpen(true)}
          className="text-xs h-9 gap-1.5 cursor-pointer shrink-0"
        >
          <UserPlus className="size-3.5" />
          Thêm người dùng
        </Button>
      </AdminPageHeader>

      {/* Bảng danh sách người dùng */}
      <Card className="flex-1 min-h-0 flex flex-col border-border/80 shadow-xs overflow-hidden">
        <CardContent className="flex-1 min-h-0 p-0 overflow-auto">
          <Table>
            <AdminTableHeader
              columns={[
                { title: 'ID', width: 'w-28' },
                'Họ và tên',
                'Email',
                { title: 'Vai trò', width: 'w-36' },
                { title: 'Trạng thái', width: 'w-40' },
              ]}
            />
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
                    {/* Cột ID */}
                    <TableCell className="px-4 py-3 font-mono text-muted-foreground">
                      #{item.id}
                    </TableCell>

                    {/* Cột Họ và tên */}
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8 border border-primary/20">
                          <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                            {getInitials(item.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-foreground">
                          {item.fullName}
                        </span>
                      </div>
                    </TableCell>

                    {/* Cột Email */}
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {item.email}
                    </TableCell>

                    {/* Cột Vai trò */}
                    <TableCell className="px-4 py-3">{renderRoleBadge(item.role)}</TableCell>

                    {/* Cột Trạng thái */}
                    <TableCell className="px-4 py-3">
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

        {/* Phân trang dùng chung */}
        <AdminPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 8, 16, 32]}
          itemName="người dùng"
        />
      </Card>

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
