'use client'

import { useState, useEffect, useRef } from 'react'
import { getBaseUrl } from '@/lib/url'
import { MyForm, ShareRole, SharedUser } from '../types/my-form.type'
import {
  getFormShareTokenAction,
  saveFormSharingAction,
} from '../actions/my-form.action'

interface UseFormSharingParams {
  form: MyForm
  onOpenChange: (open: boolean) => void
  onUpdateSharing: (
    id: number,
    sharing: { isPublic: boolean; sharedWith: SharedUser[] }
  ) => Promise<unknown>
}

export function useFormSharing({
  form,
  onOpenChange,
  onUpdateSharing,
}: UseFormSharingParams) {
  const [isPublic, setIsPublic] = useState(() => form.isPublic)
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>(
    () => form.sharedWith || []
  )
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<ShareRole>(ShareRole.VIEW)
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const initialIsPublicRef = useRef<boolean>(form.isPublic)
  const createdLinkInSessionRef = useRef<boolean>(false)
  const isSavedRef = useRef<boolean>(false)

  // Nạp thông tin token và danh sách thành viên chia sẻ từ cơ sở dữ liệu
  useEffect(() => {
    let isMounted = true
    getFormShareTokenAction(form.id).then((res) => {
      if (!isMounted) return
      if (res.success && res.data) {
        setIsPublic(res.data.isPublic)
        setShareToken(res.data.token)
        initialIsPublicRef.current = res.data.isPublic
        if (res.data.sharedWith) {
          setSharedUsers(res.data.sharedWith)
        }
      }
    })
    return () => {
      isMounted = false
    }
  }, [form.id])

  // Tự động xóa link chia sẻ tạm thời nếu thoát modal mà chưa bấm lưu thay đổi
  useEffect(() => {
    return () => {
      if (createdLinkInSessionRef.current && !isSavedRef.current) {
        createdLinkInSessionRef.current = false
        saveFormSharingAction(form.id, { isPublic: false }).catch((err) => {
          console.error('Lỗi khi tự động xóa link chia sẻ tạm thời trên unmount:', err)
        })
      }
    }
  }, [form.id])

  const shareUrl = shareToken
    ? `${getBaseUrl()}/share/${shareToken}`
    : isPublic
    ? `${getBaseUrl()}/share/...`
    : `${getBaseUrl()}/share/...`

  const handleCopyLink = () => {
    if (!shareToken) return
    navigator.clipboard.writeText(`${getBaseUrl()}/share/${shareToken}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTogglePublic = async () => {
    const nextPublic = !isPublic
    setIsPublic(nextPublic)
    if (nextPublic && !shareToken) {
      try {
        const res = await saveFormSharingAction(form.id, { isPublic: true })
        if (res.success && res.data?.token) {
          setShareToken(res.data.token)
          if (!initialIsPublicRef.current) {
            createdLinkInSessionRef.current = true
          }
        }
      } catch (err) {
        console.error('Lỗi khi sinh link chia sẻ:', err)
      }
    }
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim() || !newEmail.includes('@')) return

    if (
      sharedUsers.some(
        (u) => u.email.toLowerCase() === newEmail.trim().toLowerCase()
      )
    ) {
      return
    }

    const newUser: SharedUser = {
      id: `u_${Date.now()}`,
      email: newEmail.trim(),
      role: newRole,
      addedAt: new Date().toISOString(),
    }

    setSharedUsers([...sharedUsers, newUser])
    setNewEmail('')
  }

  const handleRemoveUser = (userId: string) => {
    setSharedUsers(sharedUsers.filter((u) => u.id !== userId))
  }

  const handleRoleChange = (userId: string, role: ShareRole) => {
    setSharedUsers(
      sharedUsers.map((u) => (u.id === userId ? { ...u, role } : u))
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      isSavedRef.current = true
      await onUpdateSharing(form.id, {
        isPublic,
        sharedWith: sharedUsers,
      })
      onOpenChange(false)
    } catch (err) {
      isSavedRef.current = false
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (createdLinkInSessionRef.current && !isSavedRef.current) {
      createdLinkInSessionRef.current = false
      saveFormSharingAction(form.id, { isPublic: false }).catch((err) => {
        console.error('Lỗi khi tự động xóa link chia sẻ tạm thời:', err)
      })
    }
    onOpenChange(false)
  }

  return {
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
  }
}
