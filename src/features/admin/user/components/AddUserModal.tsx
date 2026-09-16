'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { CreateUserInput, UserRole } from '../types/user.type'

interface AddUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddUser: (input: CreateUserInput) => Promise<unknown>
}

export function AddUserModal({
  open,
  onOpenChange,
  onAddUser,
}: AddUserModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>(UserRole.USER)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleClose = () => {
    onOpenChange(false)
    setName('')
    setEmail('')
    setRole(UserRole.USER)
    setErrorMessage(null)
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      await onAddUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
      })
      handleClose()
    } catch {
      setErrorMessage('Đã có lỗi xảy ra khi thêm người dùng.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader className="flex flex-col gap-1 text-left">
            <DialogTitle className="text-base font-bold text-foreground">
              Thêm người dùng mới
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Nhập đầy đủ thông tin để khởi tạo tài khoản người dùng mới trong hệ thống.
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <div className="p-2.5 text-xs rounded-md bg-destructive/10 text-destructive">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-3 py-1">
            {/* Họ và tên */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user-name" className="text-xs font-semibold text-foreground">
                Họ và tên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="text-xs h-9"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user-email" className="text-xs font-semibold text-foreground">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="text-xs h-9"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Vai trò */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user-role" className="text-xs font-semibold text-foreground">
                Vai trò <span className="text-destructive">*</span>
              </Label>
              <Select
                value={role}
                onValueChange={(val: UserRole) => setRole(val)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="user-role" className="w-full text-xs h-9 bg-background">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.USER} className="text-xs">
                    user
                  </SelectItem>
                  <SelectItem value={UserRole.ADMIN} className="text-xs">
                    admin
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="cursor-pointer text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer text-xs gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                'Thêm người dùng'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
