'use client'

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
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Link2,
  Copy,
  Check,
  Globe,
  Lock,
  UserPlus,
  User,
  Trash2,
  Shield,
} from 'lucide-react'
import { MyForm, ShareRole, SharedUser } from '../types/my-form.type'
import { useFormSharing } from '../hooks/useFormSharing'

interface ShareFormModalProps {
  form: MyForm | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateSharing: (
    id: number,
    sharing: { isPublic: boolean; sharedWith: SharedUser[] }
  ) => Promise<unknown>
}

interface ShareFormDialogProps {
  form: MyForm
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateSharing: (
    id: number,
    sharing: { isPublic: boolean; sharedWith: SharedUser[] }
  ) => Promise<unknown>
}

function ShareFormDialog({
  form,
  open,
  onOpenChange,
  onUpdateSharing,
}: ShareFormDialogProps) {
  const {
    isPublic,
    shareToken,
    shareUrl,
    sharedUsers,
    newEmail,
    setNewEmail,
    newRole,
    setNewRole,
    copied,
    isSaving,
    handleCopyLink,
    handleTogglePublic,
    handleAddUser,
    handleRemoveUser,
    handleRoleChange,
    handleSave,
    handleCancel,
  } = useFormSharing({ form, onOpenChange, onUpdateSharing })

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleCancel()
    } else {
      onOpenChange(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[560px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Shield className="size-5 text-foreground" />
            Chia sẻ biểu mẫu
          </DialogTitle>
          <DialogDescription className="truncate" title={form.name}>
            Biểu mẫu: <span className="font-semibold text-foreground">{form.name}</span>
          </DialogDescription>
        </DialogHeader>

      <div className="flex flex-col gap-6 py-2 min-w-0 w-full overflow-hidden">
        {/* Public link section */}
        <div
          className="p-4 rounded-xl bg-muted/50 border border-border
          flex flex-col gap-3 min-w-0 w-full"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`size-8 rounded-lg flex items-center justify-center ${
                  isPublic
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isPublic ? <Globe className="size-4" /> : <Lock className="size-4" />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  Chia sẻ bằng liên kết
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {isPublic
                    ? 'Bất kỳ ai có liên kết đều có thể xem biểu mẫu này'
                    : 'Chỉ những người được cấp quyền mới có thể truy cập'}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant={isPublic ? 'default' : 'outline'}
              size="sm"
              onClick={handleTogglePublic}
              className="text-xs h-8 cursor-pointer"
            >
              {isPublic ? 'Đang bật' : 'Đang tắt'}
            </Button>
          </div>

          <div className="flex gap-2 items-center pt-1 min-w-0 w-full">
            <div
              className="min-w-0 flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg
              bg-background border border-border text-xs text-muted-foreground overflow-hidden"
            >
              <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="w-0 flex-1 truncate select-all font-mono" title={shareUrl}>
                {shareUrl}
              </span>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCopyLink}
              disabled={!isPublic || !shareToken}
              className="text-xs h-8 shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check data-icon="inline-start" className="text-emerald-600" />
                  <span>Đã sao chép</span>
                </>
              ) : (
                <>
                  <Copy data-icon="inline-start" />
                  <span>Sao chép link</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Add People via Email */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <UserPlus className="size-4 text-muted-foreground" />
            Mời thành viên theo Email
          </h4>

          <form onSubmit={handleAddUser} className="flex gap-2">
            <Input
              type="email"
              placeholder="Nhập địa chỉ email người nhận..."
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1 text-xs h-9"
            />

            <Select
              value={newRole}
              onValueChange={(val) => setNewRole(val as ShareRole)}
            >
              <SelectTrigger className="w-[120px] h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={ShareRole.VIEW} className="text-xs">
                    Viewer (Xem)
                  </SelectItem>
                  <SelectItem value={ShareRole.EDIT} className="text-xs">
                    Editor (Sửa)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              size="sm"
              disabled={!newEmail.trim() || !newEmail.includes('@')}
              className="text-xs h-9 cursor-pointer"
            >
              Mời
            </Button>
          </form>
        </div>

        {/* Shared Members List */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Danh sách có quyền truy cập
          </span>

          <div className="max-h-[160px] overflow-y-auto flex flex-col gap-2 pr-1">
            {/* Owner */}
            <div
              className="flex items-center justify-between p-2.5 rounded-lg
              bg-muted/40 border border-border text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar size="sm">
                  <AvatarFallback>
                    <User className="size-3.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-foreground truncate">
                    Bạn (Chủ sở hữu)
                  </span>
                  <span className="text-[10px] text-muted-foreground">Toàn quyền quản trị</span>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Owner
              </Badge>
            </div>

            {/* Shared Users */}
            {sharedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2.5 rounded-lg
                border border-border hover:bg-muted/40 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground truncate">
                    {user.email}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={user.role}
                    onValueChange={(val) =>
                      handleRoleChange(user.id, val as ShareRole)
                    }
                  >
                    <SelectTrigger className="w-[110px] h-7 text-[11px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={ShareRole.VIEW} className="text-xs">
                          Viewer (Xem)
                        </SelectItem>
                        <SelectItem value={ShareRole.EDIT} className="text-xs">
                          Editor (Sửa)
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveUser(user.id)}
                    className="size-7 text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}

            {sharedUsers.length === 0 && !isPublic && (
              <p className="text-xs text-muted-foreground italic py-2 text-center">
                Biểu mẫu này hiện đang ở chế độ riêng tư, chưa chia sẻ với ai.
              </p>
            )}
          </div>
        </div>
      </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Hủy
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ShareFormModal({
  form,
  open,
  onOpenChange,
  onUpdateSharing,
}: ShareFormModalProps) {
  if (!form) return null

  return (
    <ShareFormDialog
      key={form.id}
      form={form}
      open={open}
      onOpenChange={onOpenChange}
      onUpdateSharing={onUpdateSharing}
    />
  )
}
