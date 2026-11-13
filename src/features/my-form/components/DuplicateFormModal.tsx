'use client'

import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Copy, Loader2 } from 'lucide-react'
import type { MyForm } from '../types/my-form.type'

interface DuplicateFormModalProps {
  form: MyForm | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDuplicate: (id: number, customName?: string) => Promise<MyForm | null>
}

interface DuplicateFormContentProps {
  form: MyForm
  onOpenChange: (open: boolean) => void
  onConfirmDuplicate: (id: number, customName?: string) => Promise<MyForm | null>
}

function DuplicateFormContent({
  form,
  onOpenChange,
  onConfirmDuplicate,
}: DuplicateFormContentProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [name, setName] = useState(() => t('myForm.copyName', { name: form.name }))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      const cloned = await onConfirmDuplicate(form.id, name.trim())
      onOpenChange(false)
      if (cloned) {
        router.push(`/editor?formId=${cloned.id}`)
      }
    } catch (err) {
      console.error(t('myForm.generated.loiKhiNhanBanBieuMau'), err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <div
          className="size-9 rounded-lg bg-primary/10 text-primary
          flex items-center justify-center mb-1"
        >
          <Copy className="size-4.5" />
        </div>
        <DialogTitle className="text-lg font-bold text-foreground">
          {t('myForm.generated.nhanBanBieuMau')}
        </DialogTitle>
        <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
          {t('myForm.generated.taoBanSaoDocLapTuBieuMau')}{' '}
          <strong className="text-foreground font-semibold">
            &ldquo;{form.name}&rdquo;
          </strong>
          {t('myForm.generated.banCoTheThayDoiTenChoBanSao')}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dup-name" className="text-xs font-semibold">
            {t('myForm.generated.tenBieuMauMoi')} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dup-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('myForm.generated.nhapTenBieuMauBanSao')}
            autoFocus
            required
            className="text-xs h-9"
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
          className="cursor-pointer text-xs"
        >
          {t('myForm.generated.huyBo')}
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={!name.trim() || isSubmitting}
          className="cursor-pointer text-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 data-icon="inline-start" className="animate-spin" />
              {t('myForm.generated.dangNhanBan')}
            </>
          ) : (
            t('myForm.duplicateAction')
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function DuplicateFormModal({
  form,
  open,
  onOpenChange,
  onConfirmDuplicate,
}: DuplicateFormModalProps) {
  if (!form) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DuplicateFormContent
          key={form.id}
          form={form}
          onOpenChange={onOpenChange}
          onConfirmDuplicate={onConfirmDuplicate}
        />
      </DialogContent>
    </Dialog>
  )
}
